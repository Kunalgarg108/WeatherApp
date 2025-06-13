import React, { useEffect, useState } from 'react'

const FivedayForcast = ({ lat, lon }) => {
  const [forecast, setForecast] = useState([]);
  const API_key = import.meta.env.VITE_API_KEY;

useEffect(() => {
  if (lat && lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`)
      .then(res => res.json())
      .then(data => {
        const dailyForecast = data.list.filter(item => item.dt_txt.includes("12:00:00"));
        setForecast(dailyForecast);
      });
  }
}, [lat, lon]);
  return (
    <div className="w-[45%] p-10 rounded-[10px] bg-gradient-to-br from-[rgba(47,70,128,0.4)] to-[rgba(112, 51, 246, 0.4)] backdrop-blur shadow-lg flex flex-col items-center self-center">
      <h2 className="text-2xl text-white mb-4 text-center">4-Day Forecast</h2>
      <div className="grid grid-cols-2 grid-rows-2 gap-10 ">
        {forecast.slice(0, 4).map((day, index) => (
          <div
            key={index}
            className="bg-gray-700 text-white p-4 rounded-[10px] flex flex-col items-center w-[150px]"
          >
            <p className="font-semibold">{day.dt_txt.split(' ')[0]}</p>
            <img
              src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
              alt={day.weather[0].description}
              className="w-16 h-16"
            />
            <p className="text-lg font-bold">{day.main.temp}°C</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FivedayForcast;
