function formatDate(timestamp) {
  let date = new Date(timestamp);
  let currentDate = date.getDate();
  let year = date.getFullYear();

  let monthIndex = date.getMonth();
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[monthIndex];

  return `${formatDay(
    timestamp
  )} ${currentDate} ${month} ${year} | ${formatHours(timestamp)}`;
}

function displayWeatherConditions(response) {
  document.querySelector("#city-display").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#sunrise").innerHTML = formatHours(
    response.data.sys.sunrise * 1000
  );
  document.querySelector("#sunset").innerHTML = formatHours(
    response.data.sys.sunset * 1000
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;
  document.querySelector("#date").innerHTML = formatDate(
    response.data.dt * 1000
  );
  document
    .querySelector("#icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document
    .querySelector("#icon")
    .setAttribute("alt", response.data.weather[0].main);

  celsiusTemperature = response.data.main.temp;
}

function searchLocation(position) {
  let apiKey = "7078ca8e45a8e54ad9b485826d119586";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherConditions);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayDailyForecast);
}

function formatDay(timestamp) {
  let date = new Date(timestamp);
  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[dayIndex];
  return `${day}`;
}

function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];
    forecastElement.innerHTML += `
  <div class="col-2">
                <h3>${formatHours(forecast.dt * 1000)}</h3>
                <img src="http://openweathermap.org/img/wn/${
                  forecast.weather[0].icon
                }@2x.png" alt="" class="hourly-icon"/>
                <div>
                <span class="temp-max">
                ${Math.round(
                  forecast.main.temp_max
                )}</span>° <span class="temp-min">${Math.round(
      forecast.main.temp_min
    )}</span>°</div>
              </div>`;
  }
}

function displayDailyForecast(response) {
  let dailyForecastElement = document.querySelector("#dailyForecast");
  dailyForecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < response.data.list.length; index++) {
    forecast = response.data.list[index];
    if (
      index === 1 ||
      index === 9 ||
      index === 17 ||
      index === 25 ||
      index === 33 ||
      index === 39
    ) {
      let date = new Date(forecast.dt * 1000);
      let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      let dayOfTheWeek = days[date.getDay()];
      dailyForecastElement.innerHTML += `
    <div class="col-2">
        <h3 class="day">${dayOfTheWeek}</h3>
        <img
          src="http://openweathermap.org/img/wn/${
            forecast.weather[0].icon
          }@2x.png"
          alt=""
          class="weekly-temp-icon"
        />
        <h3> <span class="temp-max">${Math.round(
          forecast.main.temp_max
        )}</span>° <span class="temp-min">${Math.round(
        forecast.main.temp_min
      )}</span>°</h3>
      </div>`;
    }
  }
  displayForecast(response);
}

function searchCity(city) {
  let apiKey = "7078ca8e45a8e54ad9b485826d119586";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherConditions);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayDailyForecast);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-text-input").value;
  searchCity(city);
}

function getLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

function convertToFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = Math.round((celsiusTemperature * 9) / 5 + 32);
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);

  let maxElement = document.querySelectorAll(".temp-max");
  let minElement = document.querySelectorAll(".temp-min");
  maxElement.forEach(function (max) {
    let currentTemp = max.innerHTML;
    max.innerHTML = `${Math.round((currentTemp * 9) / 5 + 32)}`;
  });
  minElement.forEach(function (min) {
    let currentTemp = min.innerHTML;
    min.innerHTML = `${Math.round((currentTemp * 9) / 5 + 32)}`;
  });

  fahrenheitLink.removeEventListener("click", convertToFahrenheit);
  celsiusLink.addEventListener("click", convertToCelsius);
}

function convertToCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);

  let maxElement = document.querySelectorAll(".temp-max");
  let minElement = document.querySelectorAll(".temp-min");
  maxElement.forEach(function (max) {
    let currentTemp = max.innerHTML;
    max.innerHTML = `${Math.round(((currentTemp - 32) * 5) / 9)}`;
  });
  minElement.forEach(function (min) {
    let currentTemp = min.innerHTML;
    min.innerHTML = `${Math.round(((currentTemp - 32) * 5) / 9)}`;
  });

  fahrenheitLink.addEventListener("click", convertToFahrenheit);
  celsiusLink.removeEventListener("click", convertToCelsius);
}

let celsiusTemperature = null;

let searchNewCity = document.querySelector("#search-city");
searchNewCity.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", convertToCelsius);

searchCity("London");

let currentLocationButton = document.querySelector("#location-button");
currentLocationButton.addEventListener("click", getLocation);
