import './App.css';

import Map from './components/Map';

import axios from 'axios';

import { useEffect, useState } from 'react';

function App() {

  const [weather, setWeather] = useState([]);
  const [userCoords, setUserCoords] = useState(null);
  const [closestBench, setClosestBench] = useState(null);

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

  // console.log(weather)
  console.log(closestBench.lat, closestBench.lng,)

  return (
    <>
      <h1>#CalgarySkies</h1>
      <h1>{Math.floor(weather?.main?.temp)}</h1>
      <h2>{Math.floor(weather?.main?.temp_min)} / {Math.floor(weather?.main?.temp_max)} {`(feels like ${Math.floor(weather?.main?.feels_like)})`}</h2>
      <h2>{formattedDate()}</h2>
      <h2>Sunrise: {formattedTime(weather?.sys?.sunrise)}</h2>
      <h2>Sunset: {formattedTime(weather?.sys?.sunset)}</h2>
      <h2>Closest Bench to watch the Sunset is at {closestBench.lat} {closestBench.lng}</h2>
      <Map userCoords={userCoords} closestBench={closestBench} setUserCoords={setUserCoords} setClosestBench={setClosestBench} />
    </>
  );
}

export default App;
