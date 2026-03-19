import React, { useState } from 'react';
import { IoSearch, IoWaterOutline, IoSwapVerticalOutline } from "react-icons/io5"; // Cleaner icons
import { FaSpinner } from "react-icons/fa";

const API_KEY = "e9f94e2ef793121099314c4d3bfd5ed1";
const API_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const ICON_MAP = {
  "01d": "fas fa-sun", "01n": "fas fa-moon",
  "02d": "fas fa-cloud-sun", "02n": "fas fa-cloud-moon",
  "03d": "fas fa-cloud", "03n": "fas fa-cloud",
  "04d": "fas fa-cloud-meatball", "04n": "fas fa-cloud-meatball",
  "09d": "fas fa-cloud-showers-heavy", "09n": "fas fa-cloud-showers-heavy",
  "10d": "fas fa-cloud-sun-rain", "10n": "fas fa-cloud-moon-rain",
  "11d": "fas fa-bolt", "11n": "fas fa-bolt",
  "13d": "fas fa-snowflake", "13n": "fas fa-snowflake",
  "50d": "fas fa-smog", "50n": "fas fa-smog",
};

export default function WeatherDisplay() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    const trimmedCity = city.trim();
    if (!trimmedCity) {
      setError("Please enter a city name.");
      setWeather(null);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}?units=metric&q=${trimmedCity}&appid=${API_KEY}`);
      if (!response.ok) throw new Error(response.status === 404 ? "City not found." : "Something went wrong.");
      const data = await response.json();
      
      setWeather({
        name: data.name,
        temp: Math.round(data.main.temp),
        desc: data.weather[0].description,
        icon: ICON_MAP[data.weather[0].icon] || "fas fa-question-circle",
        humidity: data.main.humidity,
        wind: Math.round(data.wind.speed),
      });
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-black/30 border border-neutral-100 p-8 rounded-[2.5rem] shadow-sm transition-all">
        
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold  tracking-tight">Weather App</h1>
          <p className=" text-sm font-light mt-1">Check local conditions anywhere</p>
        </header>

        {/* Search Bar */}
        <div className="relative group mb-6">
          <input
            type="text"
            className="w-full bg-white border border-neutral-200 py-4 pl-6 pr-14 rounded-2xl text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900/5 focus:border-neutral-900 transition-all placeholder:text-neutral-400"
            placeholder="Search city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
          />
          <button 
            onClick={fetchWeather}
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <IoSearch size={20} />}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-medium rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Weather Results */}
        {weather && !loading && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col items-center text-center">
              <i className={`${weather.icon} text-6xl text-neutral-800 mb-4`}></i>
              <h2 className="text-3xl font-bold text-neutral-900">{weather.name}</h2>
              <p className="text-6xl font-black text-neutral-900 my-4 tracking-tighter">
                {weather.temp}<span className="text-3xl font-light">°C</span>
              </p>
              <p className="text-neutral-500 uppercase tracking-widest text-[10px] font-bold mb-8 italic">
                {weather.desc}
              </p>
            </div>

            {/* Details Grid - Responsive 2 Columns */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-neutral-100 p-5 rounded-3xl flex flex-col items-center gap-2 shadow-sm">
                <IoWaterOutline className="text-neutral-400 text-xl" />
                <span className="text-lg font-bold text-neutral-900">{weather.humidity}%</span>
                <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Humidity</span>
              </div>
              <div className="bg-white border border-neutral-100 p-5 rounded-3xl flex flex-col items-center gap-2 shadow-sm">
                <IoSwapVerticalOutline className="text-neutral-400 text-xl" />
                <span className="text-lg font-bold text-neutral-900">{weather.wind} <span className="text-xs">m/s</span></span>
                <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Wind Speed</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}