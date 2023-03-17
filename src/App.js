import './App.css';

import axios from 'axios';

import { useEffect } from 'react';

function App() {

  const openWeather = `https://api.openweathermap.org/data/2.5/weather?q=calgary&appid=${process.env.REACT_APP_WEATHER_KEY}&units=metric`;

  const fetchData = () => {
    axios.get(openWeather).then((res) => {
      console.log(res.data);
    })
  }

  useEffect(() => {
    fetchData();
  })

  return (
    <>
      <h1>Hello world!</h1>
    </>
  );
}

export default App;
