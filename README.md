# Flixbus-Monthly-Price-Finder

# 🚍 FlixBus Price Scraper

![FlixBus Banner](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZzVjc2VuNmNtYTNoamg0dGQ5dHY4cmE0NTl6ZmVvNWkwcjd5MXN2ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/INUZdSHtQcFTnHPT98/giphy.webp "width=10%")

Welcome to the **FlixBus Price Scraper**! This Node.js script allows you to scrape bus prices from FlixBus and export them to an Excel file. 📈

## 🌟 Features

- Scrape bus prices between any two cities.
- Export data to an Excel file for easy analysis.
- Customize search parameters like dates, number of days, and delays between requests.

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/flixbus-price-scraper.git
Navigate to the project directory

bash
Copy code
cd flixbus-price-scraper
Install dependencies

```bash
npm install
```
## 🚀 Usage
Update Configuration

Open the index.js file and modify the CONFIG object according to your needs:

```javascript

const CONFIG = {

    departureCity: 'YOUR_DEPARTURE_CITY_ID', // 🚌 Departure City ID
    arrivalCity: 'YOUR_ARRIVAL_CITY_ID',     // 🚌 Arrival City ID
    route: 'DepartureCity-ArrivalCity',      // 🗺️ Route Name
    startDate: 'DD.MM.YYYY',                 // 📅 Starting Date
    daysToScrape: 30,                        // 📅 Number of Days to Scrape
    delayBetweenRequests: 1000,              // ⏳ Delay Between Requests (in ms)
    outputFile: 'flixbus_prices.xlsx'        // 💾 Output Excel File Name
};
```
### Departure City ID and Arrival City ID:
You need to replace these with the actual city IDs from FlixBus. See Finding City IDs for guidance.
Route Name: A friendly name for your route, e.g., 'Berlin-Munich'.
Starting Date: The date from which to start scraping prices, in DD.MM.YYYY format.
Run the Script

```bash
node index.js
```
The script will start scraping prices and save the data to the specified Excel file. 📊

### 🔍 Finding City IDs
To find the city IDs for your departure and arrival cities:

Go to the FlixBus website.
Open the developer console in your browser (usually F12 or Ctrl+Shift+I).
Start typing the city name in the search field.
Observe the network requests; look for requests that return city information.
Extract the id corresponding to your desired city.
Alternatively, you can hardcode the city names and adjust the script to search for them directly. 🏙️

## 🤝 Contributing
We welcome contributions! 🎉 If you have suggestions, improvements, or new features to add, feel free to open an issue or submit a pull request.


📋 License
This project is licensed under the MIT License.

📞 Contact
If you have any questions or need assistance, please contact us at ankitdx245@gmail.com.

Happy scraping! ✨