import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { formattedSunsetSunriseTime } from './../helpers/selectors'

const OpenWeather = () => {
  const [weather, setWeather] = useState(null);

  const openWeather = `https://api.openweathermap.org/data/2.5/weather?q=Calgary&appid=a33de441ff78dada819b7ac1588b6968&units=metric`;

  const fetchWeather = useCallback(() => {
    axios
      .get(openWeather)
      .then((response) => {
        console.log(response)
        setWeather(response.data);
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
  const weatherIcon = (<img src={`https://openweathermap.org/img/wn/${weather?.weather[0]?.icon}@2x.png`} title={weather?.weather[0]?.description} alt="weather icon" style={{ width: "6rem", height: "auto", filter: "drop-shadow(1px 1px 1px #666)" }}/> );
  const minTemp = `${Math.floor(weather?.main?.temp_min)}°`;
  const maxTemp = `${Math.floor(weather?.main?.temp_max)}°`;
  const feelsLike = `${Math.floor(weather?.main?.feels_like)}°`;
  const sunrise = formattedSunsetSunriseTime(weather?.sys?.sunrise);
  const sunset = formattedSunsetSunriseTime(weather?.sys?.sunset);

  return { temperature, weatherIcon, minTemp, maxTemp, feelsLike, sunrise, sunset };
};

export default OpenWeather;
