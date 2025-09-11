import  React, { useEffect, useState } from 'react'
import './style.css'
export default function WeatherDisplay(){

   const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const apiKey = "e9f94e2ef793121099314c4d3bfd5ed1";
  const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

  const iconMap = {
    "01d": "fas fa-sun",
    "01n": "fas fa-moon",
    "02d": "fas fa-cloud-sun",
    "02n": "fas fa-cloud-moon",
    "03d": "fas fa-cloud",
    "03n": "fas fa-cloud",
    "04d": "fas fa-cloud-meatball",
    "04n": "fas fa-cloud-meatball",
    "09d": "fas fa-cloud-showers-heavy",
    "09n": "fas fa-cloud-showers-heavy",
    "10d": "fas fa-cloud-sun-rain",
    "10n": "fas fa-cloud-moon-rain",
    "11d": "fas fa-bolt",
    "11n": "fas fa-bolt",
    "13d": "fas fa-snowflake",
    "13n": "fas fa-snowflake",
    "50d": "fas fa-smog",
    "50n": "fas fa-smog",
  };

  const getWeatherIcon = (code) => iconMap[code] || "fas fa-question-circle";

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      setWeather(null);
      return;
    }

    try {
      const res = await fetch(`${apiUrl}${city}&appid=${apiKey}`);
      if (!res.ok) throw new Error("City not found. Please try again.");
      const data = await res.json();
      setWeather({
        name: data.name,
        temp: Math.round(data.main.temp),
        desc: data.weather[0].description,
        icon: getWeatherIcon(data.weather[0].icon),
        humidity: data.main.humidity,
        wind: Math.round(data.wind.speed),
      });
      setError("");
    } catch (err) {
      setError(err.message);
      setWeather(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") fetchWeather();
  };

  const handleInputChange = (e) => {
    const newCity = e.target.value;
    setCity(newCity);
    if (newCity === "") {
      setWeather(null);
      setError("");
    }
  };

  return (
    <div className="container">
      <h1>What's the Weather Today?</h1>

      <div className="searchbar">
        <input
          type="text"
          placeholder="looking for a city?"
          value={city}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button type="submit" onClick={fetchWeather}>
          <i className="fas fa-search" title="Search"></i>
        </button>
      </div>

      {weather && (
        <div className="weather-results">
          <i className={`weather-icon ${weather.icon}`}></i>
          <div className="city-name-temp">
            <h2>{weather.name}</h2>
            <p>{weather.temp}°C</p>
          </div>
          <div className="description-humidity-wind">
            <p>{weather.desc}</p>
            <div className="details">
              <div className="humidity-container">
                <i className="fas fa-water"></i>
                <p>{weather.humidity}%</p>
                <p>Humidity</p>
              </div>
              <div className="wind-container">
                <i className="fas fa-wind"></i>
                <p>{weather.wind} m/s</p>
                <p>Wind Speed</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="error-message visible">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}