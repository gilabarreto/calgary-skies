import './App.css';

import axios from 'axios';

import Map from './components/Map';

import { FiSunrise, FiSunset } from 'react-icons/fi'

import { useEffect, useState, useCallback } from 'react';

import { formattedDate, formattedTime, gradientBg } from './helpers/selectors';

function App() {

  const [date, setDate] = useState(formattedDate());
  const [photos, setPhotos] = useState(null);
  const [weather, setWeather] = useState(null);
  const [userCoords, setUserCoords] = useState(null);
  const [closestBench, setClosestBench] = useState(null);
  const [closestBenchAddress, setClosestBenchAddress] = useState(null);

  const background = gradientBg();

  const randomPage = Math.floor(Math.random() * 100) + 1;

  const openWeather = `https://api.openweathermap.org/data/2.5/weather?q=calgary&appid=${process.env.REACT_APP_WEATHER_KEY}&units=metric`;
  const unsplash = `https://api.unsplash.com/search/photos?query=calgary,sky&page=${randomPage}&per_page=30&orientation=squarish&client_id=${process.env.REACT_APP_UNSPLASH_KEY}`;

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
      const photosArray = res.data.results.map((photo) => photo.urls?.small);
      setPhotos(photosArray);
    }).catch((error) => {
      console.log(error);
    })
  }, [unsplash]);

  useEffect(() => {
    if (!photos) {
      fetchPhotos();
    }
  }, [fetchPhotos, photos]);

  const fetchWeather = useCallback(() => {
    axios.get(openWeather).then((res) => {
      setWeather(res.data);
    }).catch((error) => {
      console.log(error);
    })
  }, [openWeather]);

  useEffect(() => {
    if (!weather) {
      fetchWeather();
    }
  }, [fetchWeather, weather])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDate(formattedDate());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const temperature = `${Math.floor(weather?.main?.temp)}°`;
  const weatherIcon = (<img src={`https://openweathermap.org/img/wn/${weather?.weather[0]?.icon}@2x.png`} title={weather?.weather[0]?.description} alt="weather icon" />);
  const minTemp = `${Math.floor(weather?.main?.temp_min)}°`;
  const maxTemp = `${Math.floor(weather?.main?.temp_max)}°`;
  const feelsLike = `${Math.floor(weather?.main?.feels_like)}°`;
  const sunrise = formattedTime(weather?.sys?.sunrise);
  const sunset = formattedTime(weather?.sys?.sunset);

  return (
    <div style={{ background }}>
      <h1>#CalgarySkies</h1>
      <h1>{temperature} {weatherIcon}</h1>
      <h2>Hi: {maxTemp} / Lo: {minTemp} {`(feels like ${feelsLike})`}</h2>
      <h2>{date}</h2>
      <h2><FiSunrise /> Sunrise: {sunrise} <FiSunset /> Sunset: {sunset}</h2>
      {userCoords ? <h2>Closest bench to watch the sunset is at {closestBenchAddress}</h2> : <h2 onClick={getUserCoords}>Click here to get closest bench to watch the sunset.</h2>}
      <Map userCoords={userCoords} closestBench={closestBench} setUserCoords={setUserCoords} setClosestBench={setClosestBench} closestBenchAddress={closestBenchAddress} setClosestBenchAddress={setClosestBenchAddress} />
      {photos ? <img src={photos[Math.floor(Math.random() * photos.length) + 1]} alt={photos?.alt_description} /> : null}
      {photos ? <img src={photos[Math.floor(Math.random() * photos.length) + 1]} alt={photos?.alt_description} /> : null}
      {photos ? <img src={photos[Math.floor(Math.random() * photos.length) + 1]} alt={photos?.alt_description} /> : null}
    </div>
  );
}

export default App;
