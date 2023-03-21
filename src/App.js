import './App.css';

import axios from 'axios';

import Map from './components/Map';

import { gradientBg } from './helpers/gradient_bg.js';

import { FiSunrise, FiSunset } from 'react-icons/fi'

import { useEffect, useState, useCallback } from 'react';

function App() {

  const [photos, setPhotos] = useState(null);
  const [weather, setWeather] = useState(null);
  const [userCoords, setUserCoords] = useState(null);
  const [closestBench, setClosestBench] = useState(null);
  const [closestBenchAddress, setClosestBenchAddress] = useState(null);

  const background = gradientBg();

  const randomPage = Math.floor(Math.random() * 100) + 1;

  const openWeather = `https://api.openweathermap.org/data/2.5/weather?q=calgary&appid=${process.env.REACT_APP_WEATHER_KEY}&units=metric`;
  const unsplash = `https://api.unsplash.com/search/photos?query=calgary+sky&page=${randomPage}&per_page=30&client_id=${process.env.REACT_APP_UNSPLASH_KEY}`;

  const getUserCoords = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error(error);
      });
  }, [setUserCoords]);

  const fetchPhotos = useCallback(() => {
    axios.get(unsplash).then((res) => {
      const randomPhotos = res.data.results.sort(() => 0.5 - Math.random()).slice(0, 9);
      setPhotos(randomPhotos);
    }).catch((error) => {
      console.log(error);
    })
  }, [unsplash]);

  useEffect(() => {
    if (!photos) {
      fetchPhotos();
    }
  }, [fetchPhotos, photos]);

  const fetchData = useCallback(() => {
    axios.get(openWeather).then((res) => {
      setWeather(res.data);
    }).catch((error) => {
      console.log(error);
    })
  }, [openWeather]);

  useEffect(() => {
    if (!weather) {
      fetchData();
    }
  }, [fetchData, weather])

  const formattedDate = () => {
    const currentDate = new Date()
    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return currentDate.toLocaleDateString('en-US', dateOptions).replace(' AM', 'am').replace(' PM', 'pm').replace(' at', ' @');
  }

  const formattedTime = (time) => {
    const currentTime = new Date(time * 1000);
    const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true }
    return currentTime.toLocaleTimeString('en-US', timeOptions).replace(' AM', 'am').replace(' PM', 'pm');
  }

  const [date, setDate] = useState(formattedDate());
  useEffect(() => {
    const intervalId = setInterval(() => {
      setDate(formattedDate());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{ background }}>
      <h1>#CalgarySkies</h1>
      <h1>{Math.floor(weather?.main?.temp)}° <img src={`https://openweathermap.org/img/wn/${weather?.weather[0]?.icon}@2x.png`} title={weather?.weather[0]?.description} alt="weather icon" /></h1>
      <h2>Hi: {Math.floor(weather?.main?.temp_min)}° / Lo: {Math.floor(weather?.main?.temp_max)}° {`(feels like ${Math.floor(weather?.main?.feels_like)}°)`}</h2>
      <h2>{date}</h2>
      <h2><FiSunrise /> Sunrise: {formattedTime(weather?.sys?.sunrise)}                        <FiSunset /> Sunset: {formattedTime(weather?.sys?.sunset)}</h2>
      {userCoords ? <h2>Closest bench to watch the sunset is at {closestBenchAddress}</h2> : <h2 onClick={getUserCoords}>Click here to get closest bench to watch the sunset.</h2>}
      <Map userCoords={userCoords} closestBench={closestBench} setUserCoords={setUserCoords} setClosestBench={setClosestBench} closestBenchAddress={closestBenchAddress} setClosestBenchAddress={setClosestBenchAddress} />
      {photos ? photos.map((data) => (<img src={data?.urls?.small} alt={data?.alt_description} />)) : null}
    </div>
  );
}

export default App;
