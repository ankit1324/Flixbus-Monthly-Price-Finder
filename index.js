const puppeteer = require('puppeteer');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const xlsx = require('xlsx'); // Added xlsx for Excel file handling

// Extend dayjs with the customParseFormat plugin
dayjs.extend(customParseFormat);

// Configuration
const CONFIG = {
    departureCity: '1b94cdac-d344-4d36-97b2-76778e8d3b57',// Palampur
    arrivalCity: '23f05be4-8c5e-49a6-b27d-7c49c89eed3e',   // Chandigarh
    route: 'Palampur-Chandigarh',
    adult: 1,
    locale: 'en_IN',
    departureCountryCode: 'IN',
    arrivalCountryCode: 'IN',
    features: {
        'feature.enable_distribusion': 1,
        'feature.train_cities_only': 0,
        'feature.auto_update_disabled': 0,
        'feature.webc_search_us_veterans_promoted': 0,
        'feature.darken_page': 1
    },
    startDate: '29.11.2024', // Starting date in DD.MM.YYYY
    daysToScrape: 30,        // Number of days to scrape
    delayBetweenRequests: 1000, // 5 seconds delay
    outputFile: 'flixbus_prices.xlsx' // Output Excel file
};

// Function to construct the search URL for a given date
function constructURL(date) {
    const params = new URLSearchParams({
        departureCity: CONFIG.departureCity,
        arrivalCity: CONFIG.arrivalCity,
        route: CONFIG.route,
        rideDate: date, // Ensure date is in DD.MM.YYYY format
        adult: CONFIG.adult.toString(),
        _locale: CONFIG.locale,
        departureCountryCode: CONFIG.departureCountryCode,
        arrivalCountryCode: CONFIG.arrivalCountryCode,
    });

    // Append feature flags
    Object.keys(CONFIG.features).forEach(key => {
        params.append(`features[${key}]`, CONFIG.features[key]);
    });

    const url = `https://shop.flixbus.in/search?${params.toString()}`;
    // console.log(`Constructed URL for date ${date}: ${url}`);
    return url;
}

// Function to get all dates to scrape
function getDateRange(startDate, days) {
    const dates = [];
    let current = dayjs(startDate, 'DD.MM.YYYY');

    if (!current.isValid()) {
        throw new Error('Start date is invalid. Please check the format (DD.MM.YYYY).');
    }

    for (let i = 0; i < days; i++) {
        dates.push(current.format('DD.MM.YYYY'));
        current = current.add(1, 'day');
    }
    return dates;
}

// Function to scrape bus prices for a given date
async function scrapePrices(page, url, date) {
    try {
        // console.log(`Navigating to ${url}`);
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Wait for the price elements to load
        await page.waitForSelector('.Price__priceWrapper___eDs_Y', { timeout: 15000 });

        // Extract prices
        const data = await page.evaluate(() => {
            const prices = [];
            const priceElements = document.querySelectorAll('.Price__priceWrapper___eDs_Y');

            priceElements.forEach(priceEl => {
                const priceText = priceEl.querySelector('[data-e2e="search-result-prices"]')?.innerText.trim() || 'N/A';
                prices.push(priceText);
            });

            return prices;
        });

        console.log(`Found ${data.length} prices for ${date}`);
        return { date, prices: data };
    } catch (error) {
        console.error(`Error scraping ${date}: ${error.message}`);
        return { date, prices: [], error: error.message };
    }
}

// Function to save data to an Excel file
// Function to save data to an Excel file with combined prices per date
function saveToExcel(data, outputFile) {
    const rows = [];

    data.forEach(item => {
        // Combine prices into a single comma-separated string
        const uniquePrices = [...new Set(item.prices)]; // Remove duplicate prices if needed
        const combinedPrices = uniquePrices.join(', ');

        // Push a single row with the date and all combined prices
        rows.push({ Date: item.date, Prices: combinedPrices });
    });

    const worksheet = xlsx.utils.json_to_sheet(rows);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Bus Prices');
    xlsx.writeFile(workbook, outputFile);
    console.log(`Data successfully saved to ${outputFile}`);
}


(async () => {
    try {
        // Launch Puppeteer
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        // Set user agent to mimic a real browser
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36'
        );

        // Generate list of dates
        const dates = getDateRange(CONFIG.startDate, CONFIG.daysToScrape);
        const allResults = [];

        for (const date of dates) {
            const url = constructURL(date);

            // Handle invalid dates explicitly
            if (date === 'Invalid Date') {
                console.error(`Invalid date encountered: ${date}. Skipping this date.`);
                continue;
            }

            const result = await scrapePrices(page, url, date);
            allResults.push(result);

            // Delay to respect rate limiting
            console.log(`Waiting for ${CONFIG.delayBetweenRequests / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, CONFIG.delayBetweenRequests));
        }

        // Close Puppeteer
        await browser.close();

        // Save data to Excel file
        saveToExcel(allResults, CONFIG.outputFile);
    } catch (error) {
        console.error(`Unexpected error: ${error.message}`);
    }
})();
