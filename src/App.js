import './App.css';
import Map from './components/Map';
import FlickrImg from './components/Flickr'
import OpenWeather from './components/OpenWeather';
import YouTube from 'react-youtube';
import { FiSunrise, FiSunset, FiArrowLeft } from 'react-icons/fi'
import { useEffect, useState, useCallback } from 'react';
import { formattedTime, gradientBg } from './helpers/selectors';

function App() {
  const root = document.documentElement;
  root.style.setProperty('--bg-color', gradientBg());

  const { temperature, weatherIcon, minTemp, maxTemp, feelsLike, sunrise, sunset } = OpenWeather();

  const [currentTime, setCurrentTime] = useState(formattedTime());
  const [userCoords, setUserCoords] = useState(null);
  const [closestBench, setClosestBench] = useState(null);
  const [closestBenchAddress, setClosestBenchAddress] = useState(null);
  const [about, setAbout] = useState(false);
  const [help, setHelp] = useState(false)

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
      setCurrentTime(formattedTime(date.getTime() / 1000));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const date = new Date();
  let currentDay = date.getUTCDate();
  let currentWeekday = weekday[date.getUTCDay() - 1];
  let currentMonth = month[date.getUTCMonth()];

  return (
    <div>
      <div className='navbar'>
        <span onClick={() => {
          setHelp(false)
          setAbout(false)
        }}>#CalgarySkies</span>
        <span onClick={() => {
          setHelp(false)
          setAbout(true)
        }}>#About </span>
        <span onClick={() => {
          setHelp(true)
          setAbout(false)
        }}>#Help</span>
      </div>
      <div className='pound'>
        <div className='pound-top'>
          <div className='pound-top-left'>
            <span>{currentWeekday}</span>
            <span>{currentMonth} {currentDay}</span>
            <span>{currentTime}</span>
          </div>
          <div className='pound-top-center'>
            <h1>{temperature}</h1> <span> {weatherIcon}</span>
          </div>
          <div className='pound-top-right'>
            <span>High: {maxTemp}</span>
            <br />
            <span>Low: {minTemp} </span>
            <br />
            <span>{`Feels like ${feelsLike}`}</span>
          </div>
        </div>
        <div className='pound-center'>
          <div className='pound-center-left'>
            <span><FiSunrise title={"Sunrise"} /> {sunrise} </span>
            <br />
            <span><FiSunset title={"Sunset"} /> {sunset}</span>
          </div>
          <div className='pound-center-center'>
            {help && !about ? (
              <div style={{ background: "#000" }}><YouTube
                videoId='KQetemT1sWc'
                title='Youtube video player'
                opts={{
                  height: '315px',
                  width: '400px',
                  playerVars: {
                    autoplay: 1,
                  }
                }}
              /></div>
            ) : !help && about ? (
              <h5>
                This weather app was inspired by Calgary skies,
                <br />
                one of the sunniest places in Canada.
                <br />
                Victor Barreto is Web Developer and nature lover.
                <br />
                Click here to learn more about him and his projects.
              </h5>
            ) : !help && !about ? (
              <Map
                userCoords={userCoords}
                closestBench={closestBench}
                setUserCoords={setUserCoords}
                setClosestBench={setClosestBench}
                closestBenchAddress={closestBenchAddress}
                setClosestBenchAddress={setClosestBenchAddress}
              />
            ) : null}
          </div>
          <div className='pound-center-right'>
            <span className='benches-to-watch-the-sunset'><FiArrowLeft /> Benches to watch the sunset in Calgary</span>

            {userCoords ? <><h5>Closest bench to you is at</h5><h5> {closestBenchAddress}</h5></> : <h5 onClick={getUserCoords}>Click here to get closest bench to watch the sunset.</h5>}

          </div>
        </div>
        <div className='pound-bottom'>
          <div className='pound-bottom-left'>
            <FlickrImg />
          </div>
          <div className='pound-bottom-center'>
            <FlickrImg />
          </div>
          <div className='pound-bottom-right'>
            <FlickrImg />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
