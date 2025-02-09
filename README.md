# Calendar-Weather
It is used to display a calendar with events according to Indian calendar. It also allows creation of events and display of weather. I will be removing this in 2 months, because I am learning node.js and do not know how to remove API keys.
This web application displays a calendar with the following features:

Displays the current month and year.
Allows navigation between months.
Shows the current date highlighted.
Allows the user to view and add events for each day.
Fetches weather data and event information (from Eventbrite and Calendarific) for each day.
Displays detailed weather information in a modal.
Features
Calendar Navigation: Users can navigate through months and view days.
Events: Add and view events for each day.
Weather: View weather details for any selected day.
Responsive Design: Optimized for both desktop and mobile devices.
Technologies Used
HTML5
CSS3
JavaScript
OpenWeatherMap API (for weather data)
Eventbrite API (for events)
Calendarific API (for public holidays)
Setup
Clone this repository to your local machine.
Open the index.html file in a web browser.
API Keys
Weather API: You need an API key from OpenWeatherMap.
Eventbrite API: You need an API key from Eventbrite.
Calendarific API: You need an API key from Calendarific.
Replace the placeholder API keys in script.js with your own.

How It Works
The calendar will display the current month with days marked.
Click on a day to view events and fetch weather data for that date.
You can add events by clicking the "Add Event" button.
Notes
Events are stored locally in the browser's localStorage.
The modal displays weather details like temperature, description, humidity, and wind speed.
The app fetches events from Eventbrite and holidays from Calendarific to display them for the corresponding dates.
