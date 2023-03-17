import './App.css';

import axios from 'axios';

import { useEffect, useState } from 'react';

function App() {

  const [weather, setWeather] = useState([]);

  const openWeather = `https://api.openweathermap.org/data/2.5/weather?q=calgary&appid=${process.env.REACT_APP_WEATHER_KEY}&units=metric`;

  const fetchData = async () => {
    try {
      const res = await axios.get(openWeather);
      setWeather(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [])

  const formattedDate = () => {
    const currentDate = new Date()
    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return currentDate.toLocaleDateString('en-US', dateOptions).replace(' PM', 'pm').replace('at','@');
  }

  const formattedTime = (time) => {
    const currentTime = new Date(time * 1000);
    const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true }
    return currentTime.toLocaleTimeString('en-US', timeOptions).replace(' PM', 'pm');
  }

  return (
    <>
      <h1>#Calgar-Skies</h1>
      <h1>{weather?.main?.temp}</h1>
      <h2>{weather?.main?.temp_min} / {weather?.main?.temp_max} {`(feels like ${weather?.main?.feels_like})`}</h2>
      <h2>{formattedDate()}</h2>
      <h2>Sunrise: {formattedTime(weather?.sys?.sunrise)}</h2>
      <h2>Sunset: {formattedTime(weather?.sys?.sunset)}</h2>
    </>
  );
}

export default App;
