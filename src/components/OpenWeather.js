import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { formattedDate, formattedTime } from './../helpers/selectors'

const OpenWeather = () => {
  const [weather, setWeather] = useState(null);

  const openWeather = `https://api.openweathermap.org/data/2.5/weather?q=calgary&appid=${process.env.REACT_APP_WEATHER_KEY}&units=metric`;

  const fetchWeather = useCallback(() => {
    axios
      .get(openWeather)
      .then((res) => {
        setWeather(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [openWeather]);

  useEffect(() => {
    if (!weather) {
      fetchWeather();
    }
  }, [fetchWeather, weather]);

  const temperature = `${Math.floor(weather?.main?.temp)}°`;
  const weatherIcon = (<img src={`https://openweathermap.org/img/wn/${weather?.weather[0]?.icon}@2x.png`} title={weather?.weather[0]?.description} alt="weather icon" />);
  const minTemp = `${Math.floor(weather?.main?.temp_min)}°`;
  const maxTemp = `${Math.floor(weather?.main?.temp_max)}°`;
  const feelsLike = `${Math.floor(weather?.main?.feels_like)}°`;
  const sunrise = formattedTime(weather?.sys?.sunrise);
  const sunset = formattedTime(weather?.sys?.sunset);
  const date = formattedDate();

  return { temperature, weatherIcon, minTemp, maxTemp, feelsLike, sunrise, sunset, date };
};

export default OpenWeather;
