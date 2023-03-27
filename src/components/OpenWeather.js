import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { formattedSunsetSunriseTime } from './../helpers/selectors'

const OpenWeather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const openWeather = `https://api.openweathermap.org/data/2.5/weather?q=Calgary&appid=a33de441ff78dada819b7ac1588b6968&units=metric`;

  const fetchWeather = useCallback(() => {
    axios
      .get(openWeather)
      .then((response) => {
        setWeather(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [openWeather]);

  useEffect(() => {
    if (!weather) {
      fetchWeather();
    }
  }, [fetchWeather, weather]);

  let temperature, weatherIcon, minTemp, maxTemp, feelsLike, sunrise, sunset;

  if (loading) {
    temperature = "...";
    weatherIcon = "...";
    minTemp = "...";
    maxTemp = "...";
    feelsLike = "...";
    sunrise = "...";
    sunset = "...";
  } else {
    temperature = `${Math.floor(weather?.main?.temp)}°`;
    weatherIcon = (<img src={`https://openweathermap.org/img/wn/${weather?.weather[0]?.icon}@2x.png`} title={weather?.weather[0]?.description} alt="weather icon" style={{ width: "6rem", height: "auto", filter: "drop-shadow(1px 1px 1px #666)", }} />);
    minTemp = `${Math.floor(weather?.main?.temp_min)}°`;
    maxTemp = `${Math.floor(weather?.main?.temp_max)}°`;
    feelsLike = `${Math.floor(weather?.main?.feels_like)}°`;
    sunrise = formattedSunsetSunriseTime(weather?.sys?.sunrise);
    sunset = formattedSunsetSunriseTime(weather?.sys?.sunset);
  }

  return { temperature, weatherIcon, minTemp, maxTemp, feelsLike, sunrise, sunset };
};

export default OpenWeather;