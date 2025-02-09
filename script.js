let currentDate = new Date();
let events = {}; 

const weatherApiKey = '8eb1d9c42f2b968bdb0b6bf1120f4aa1'; // OpenWeatherMap API key
const weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall"; // OpenWeather API URL
const eventbriteApiKey = 'O44ADIL3VA3GM24G76OD';  // Eventbrite API key
const eventbriteApiUrl = "https://www.eventbriteapi.com/v3/events/search/"; // Eventbrite API URL
const calendarificApiKey = 'Uw0Q2paodoSGZGUPEhrbSV29rFEwTw1t';  // Calendarific API key
const calendarificApiUrl = `https://calendarific.com/api/v2/holidays?api_key=${calendarificApiKey}&country=IN&year=${currentDate.getFullYear()}`;

const lat = 12.9716;
const lon = 77.5946;

if (localStorage.getItem('events')) {
    events = JSON.parse(localStorage.getItem('events'));
}

function saveEvents() {
    localStorage.setItem('events', JSON.stringify(events));
}

function renderCalendar() {
    const monthYear = document.getElementById("month-year");
    const calendarBody = document.getElementById("calendar-body");

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentDay = currentDate.getDate(); 
    monthYear.textContent = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDay.getDate();

    calendarBody.innerHTML = '';

    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyCell = document.createElement("div");
        emptyCell.classList.add("day", "empty");
        calendarBody.appendChild(emptyCell);
    }

    for (let day = 1; day <= totalDays; day++) {
        const dayCell = document.createElement("div");
        dayCell.classList.add("day", "current-month");
        if (day === currentDay) {
            dayCell.classList.add("today");
        }

        dayCell.textContent = day;

        dayCell.addEventListener("click", () => {
            showEvents(day);
            fetchWeather(day);
        });

        calendarBody.appendChild(dayCell);
    }
}

function showEvents(day) {
    // Remove any existing event container if present
    let existingContainer = document.getElementById("event-container");
    if (existingContainer) {
        existingContainer.remove();
    }

    const eventContainer = document.createElement("div");
    eventContainer.id = "event-container";
    const dayString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const dayEvents = events[dayString] || [];

    eventContainer.innerHTML = `
        <h3>Events for ${dayString}</h3>
        <ul id="event-list"></ul>
        <button id="add-event">Add Event</button>
    `;

    const eventList = eventContainer.querySelector("#event-list");
    dayEvents.forEach(event => {
        const listItem = document.createElement("li");
        listItem.textContent = `${event.title} (${event.time}): ${event.description}`;
        eventList.appendChild(listItem);
    });

    const addEventButton = eventContainer.querySelector("#add-event");
    addEventButton.addEventListener("click", () => {
        const title = prompt("Enter event title:");
        const time = prompt("Enter event time (e.g., 10:00 AM):");
        const description = prompt("Enter event description:");

        if (title && time && description) {
            const newEvent = { title, time, description };
            if (!events[dayString]) {
                events[dayString] = [];
            }
            events[dayString].push(newEvent);
            saveEvents(); 
            renderCalendar(); 
            alert("Event added!");
        }
    });

    document.body.appendChild(eventContainer);
}

function fetchWeather(day) {
    const dayString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const timestamp = selectedDate.getTime() / 1000;

    const url = `${weatherApiUrl}?lat=${lat}&lon=${lon}&dt=${timestamp}&appid=${weatherApiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const weather = data.current;
            const weatherDetails = `
                <p>Temperature: ${weather.temp}°C</p>
                <p>Weather: ${weather.weather[0].description}</p>
                <p>Humidity: ${weather.humidity}%</p>
                <p>Wind Speed: ${weather.wind_speed} m/s</p>
            `;
            document.getElementById("weather-day").textContent = dayString;
            document.getElementById("weather-details").innerHTML = weatherDetails;

            document.getElementById("weather-modal").style.display = "block";
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

document.getElementById("close-modal").addEventListener("click", () => {
    document.getElementById("weather-modal").style.display = "none";
});

document.getElementById("prev-month").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById("next-month").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

function fetchEvents() {
    const eventbriteUrl = `${eventbriteApiUrl}?location.latitude=${lat}&location.longitude=${lon}&token=${eventbriteApiKey}`;
    
    fetch(eventbriteUrl)
        .then(response => response.json())
        .then(data => {
            data.events.forEach(event => {
                const eventDate = event.start.local.split('T')[0];
                if (!events[eventDate]) {
                    events[eventDate] = [];
                }
                const eventDetails = {
                    title: event.name.text,
                    time: new Date(event.start.local).toLocaleTimeString(),
                    description: event.description.text || "No description",
                };
                events[eventDate].push(eventDetails);
            });
            saveEvents();
            renderCalendar();
        })
        .catch(error => console.error('Error fetching events from Eventbrite:', error));

    fetch(calendarificApiUrl)
        .then(response => response.json())
        .then(data => {
            data.response.holidays.forEach(holiday => {
                const eventDate = holiday.date.iso.split('T')[0];
                if (!events[eventDate]) {
                    events[eventDate] = [];
                }
                const eventDetails = {
                    title: holiday.name,
                    time: "All day",
                    description: holiday.description || "No description",
                };
                events[eventDate].push(eventDetails);
            });
            saveEvents();
            renderCalendar();
        })
        .catch(error => console.error('Error fetching events from Calendarific:', error));
}

fetchEvents();
renderCalendar();
