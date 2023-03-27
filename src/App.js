import './App.css';
import Map from './components/Map';
import FlickrImg from './components/Flickr'
import OpenWeather from './components/OpenWeather';
import YouTube from 'react-youtube';
import { FiSunrise, FiSunset, FiArrowLeft, FiInfo, FiHelpCircle } from 'react-icons/fi'
import { useEffect, useState, useCallback, useMemo } from 'react';
import { formattedClockTime, gradientBg } from './helpers/selectors';

function App() {
  const root = document.documentElement;
  root.style.setProperty('--bg-color', gradientBg());

  const { temperature, weatherIcon, minTemp, maxTemp, feelsLike, sunrise, sunset } = OpenWeather();

  const [currentTime, setCurrentTime] = useState(null);
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

  const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const memoizedDate = useMemo(() => new Date(), []);

  let currentDay = memoizedDate.getUTCDate();
  let currentWeekday = weekday[memoizedDate.getUTCDay() % 7];
  let currentMonth = month[memoizedDate.getUTCMonth()];

  useEffect(() => {
    const intervalId = setInterval(() => {
      const date = new Date();
      setCurrentTime(formattedClockTime(date.getTime() / 1000));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <div className='navbar'>
        <div className='navbar-left'>
          <span className='navbar-links' onClick={() => {
            setHelp(false)
            setAbout(false)
          }}>#CalgarySkies</span>
        </div>
        <div className='navbar-right'>
          <span className='navbar-links' onClick={() => {
            setHelp(false)
            setAbout(true)
          }}><FiInfo style={{ width: "2.5rem", height: "auto", filter: "drop-shadow(1px 1px 1px #666)" }} />&nbsp;About&ensp;</span>
          <span className='navbar-links' onClick={() => {
            setHelp(true)
            setAbout(false)
          }}><FiHelpCircle style={{ width: "2.5rem", height: "auto", filter: "drop-shadow(1px 1px 1px #666)" }} />&nbsp;Help&nbsp;</span>
        </div>
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
            <span><FiSunrise title={"Sunrise"} style={{ width: "3.5rem", height: "auto", filter: "drop-shadow(1px 1px 1px #666)" }} /> {sunrise} </span>
            <br />
            <span><FiSunset title={"Sunset"} style={{ width: "3.5rem", height: "auto", filter: "drop-shadow(1px 1px 1px #666)" }} /> {sunset}</span>
          </div>
          <div className='pound-center-center'>
            {help && !about ? (
              <div><YouTube
                videoId='KQetemT1sWc'
                title='Youtube video player'
                opts={{
                  height: '317px',
                  width: '400px',
                  playerVars: {
                    autoplay: 1,
                  }
                }}
              /></div>
            ) : !help && about ? (
              <>
                <div className='about-text'>
                  <h5>
                    People always talk about how cold Calgary is, but they forget to look up and enjoy its beautiful skies. Believe it or not, Calgary is one of the sunniest places in Canada. Sure, winter is coming, but don't forget that the future looks bright!
                  </h5>
                </div>
                <div className='about-text'>
                  <h5>
                    <p>
                      Victor Barreto is a Web Developer and nature lover. Click <a href="https://github.com/gilabarreto" target="_blank" rel="noreferrer">here</a> to learn more about him and his projects.
                    </p>
                  </h5>
                </div>
              </>
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
            {help && !about ? (
              <div className='help-info'>
                <span><FiArrowLeft style={{ width: "3.5rem", height: "auto", filter: "drop-shadow(1px 1px 1px #666)" }} />&nbsp;Help</span>
                <h2>
                  <p>
                    I know it's not "Help", but "Here comes the sun" sounds more appropriate
                  </p>
                </h2>
              </div>
            ) : !help && about ? (
              <div className='about-info'>
                <span><FiArrowLeft style={{ width: "3.5rem", height: "auto", filter: "drop-shadow(1px 1px 1px #666)" }} />&nbsp;About</span>
                <h5>
                  <p>
                    Information about the App and the Author
                  </p>
                </h5>
              </div>
            ) : !help && !about ? (
              <>
                <span className='benches-to-watch-the-sunset'><FiArrowLeft style={{ width: "3.5rem", height: "auto", filter: "drop-shadow(1px 1px 1px #666)" }} />Benches to watch the sunset in Calgary</span>
                {userCoords ? <><h5>Closest bench to you is at {closestBenchAddress}</h5></> : <h5 onClick={getUserCoords}>Click here to get closest bench to watch the sunset.</h5>}
              </>
            ) : null}
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
