import { useState, useEffect } from 'react';
import weatherService from '../services/weather'

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState({});

  useEffect(() => {
    weatherService
      .getWeather(capital)
      .then(weather => setWeather(weather));
  }, []);

  if (weather.current) {
    return (
      <div>
        <p><strong>Temperature:</strong> {weather.current.temperature} Celsius</p>
        <img src={weather.current.weather_icons[0]} alt="weather icon" />
        <p><strong>Wind:</strong> {weather.current.wind_speed} mph direction {weather.current.wind_dir}</p>
      </div>
    )
  } else {
    return (
      <p>Loading weather...</p>
    )
  }
}

export default Weather;