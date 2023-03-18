import './App.css';

import Map from './components/Map';

import axios from 'axios';

import { useEffect, useState } from 'react';

function App() {

  const [weather, setWeather] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

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

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);

  console.log("userLocation", userLocation)

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

  console.log(weather)

  return (
    <>
      <h1>#CalgarySkies</h1>
      <h1>{Math.floor(weather?.main?.temp)}</h1>
      <h2>{Math.floor(weather?.main?.temp_min)} / {Math.floor(weather?.main?.temp_max)} {`(feels like ${Math.floor(weather?.main?.feels_like)})`}</h2>
      <h2>{formattedDate()}</h2>
      <h2>Sunrise: {formattedTime(weather?.sys?.sunrise)}</h2>
      <h2>Sunset: {formattedTime(weather?.sys?.sunset)}</h2>
      <Map />
    </>
  );
}

export default App;
