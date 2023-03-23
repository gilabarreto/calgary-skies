import './App.css';
import Map from './components/Map';
import UnsplashImg from './components/Unsplash';
import { FiSunrise, FiSunset } from 'react-icons/fi'
import { useEffect, useState, useCallback } from 'react';
import { formattedDate, gradientBg } from './helpers/selectors';
import OpenWeather from './components/OpenWeather';

function App() {
  const { temperature, weatherIcon, minTemp, maxTemp, feelsLike, sunrise, sunset } = OpenWeather();

  const [date, setDate] = useState(formattedDate());
  const [userCoords, setUserCoords] = useState(null);
  const [closestBench, setClosestBench] = useState(null);
  const [closestBenchAddress, setClosestBenchAddress] = useState(null);

  const background = gradientBg();

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

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDate(formattedDate());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{ background }}>
      <h1>#CalgarySkies</h1>
      <h1>{temperature} {weatherIcon}</h1>
      <h2>Hi: {maxTemp} / Lo: {minTemp} {`(feels like ${feelsLike})`}</h2>
      <h2>{date}</h2>
      <h2><FiSunrise /> Sunrise: {sunrise} <FiSunset /> Sunset: {sunset}</h2>
      {userCoords ? <h2>Closest bench to watch the sunset is at {closestBenchAddress}</h2> : <h2 onClick={getUserCoords}>Click here to get closest bench to watch the sunset.</h2>}
      <Map userCoords={userCoords} closestBench={closestBench} setUserCoords={setUserCoords} setClosestBench={setClosestBench} closestBenchAddress={closestBenchAddress} setClosestBenchAddress={setClosestBenchAddress} />
      <UnsplashImg />
      <UnsplashImg />
      <UnsplashImg />
    </div>
  );
}

export default App;
