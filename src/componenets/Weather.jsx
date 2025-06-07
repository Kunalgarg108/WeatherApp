import React, { useState, useEffect } from 'react';
import { IoMdSearch } from "react-icons/io";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { TiWeatherWindyCloudy } from "react-icons/ti";
import { WiHumidity } from "react-icons/wi";
import { FaTemperatureLow } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Weather() {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
const API_key = "";

   useEffect(() => {
    getUserLocation();
  }, []);
  useEffect(() => {
    if (city.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_key}`)
        .then(res => res.json())
        .then(data => {
          setSuggestions(data);
        })
        .catch(() => toast.error("Error fetching city suggestions"));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [city]);

  const selectCity = (name, lat, lon) => {
    setCity(name);
    setSuggestions([]);
    getWeatherDetails(lat, lon, name);
  };

  // Fetch weather by coordinates
  const getWeatherDetails = (lat, lon, name) => {
    const weather_api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`;
    fetch(weather_api)
      .then(res => res.json())
      .then(data => {
        setWeather({
          city: name,
          temperature: data.main.temp,
          wind: data.wind.speed,
          humidity: data.main.humidity,
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        });
      })
      .catch(() => toast.error("Error fetching weather data."));
  };

  // Fetch weather by city name (fallback if user clicks search without selecting suggestion)
  const getWeatherByCity = () => {
    if (!city.trim()) {
      alert("Please enter a city name.");
      return;
    }

    const city_api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`;
    fetch(city_api)
      .then(res => res.json())
      .then(data => {
        if (data.cod === 200) {
          getWeatherDetails(data.coord.lat, data.coord.lon, data.name);
          setSuggestions([]);
        } else {
          alert(data.message);
        }
      })
      .catch(() => toast.error("Error fetching weather for city."));
  };

  // Get user location & reverse geocode
  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const reverse_geocoding = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_key}`;
        fetch(reverse_geocoding)
          .then(res => res.json())
          .then(data => {
            if (data.length > 0) {
              const { name, lat, lon } = data[0];
              getWeatherDetails(lat, lon, name);
            } else {
              toast.error("Unable to find location details.");
            }
          })
          .catch(() => {
            toast.error("An error occurred while fetching location details.");
          });
      },
      error => {
        console.log(error);
        toast.error("Unable to retrieve your location.");
      }
    );
  };

  return (
    <>
      <div className='w-[50%] p-10 rounded-[10px] bg-gradient-to-br from-[#2f4680] to-[#500ae4] flex flex-col items-center self-center'>
        <div className='flex items-center gap-2 h-12 w-[70%]'>

          <div className='relative w-[90%] max-w-[600px] ml-[15px]'>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder='Search'
              className='w-full h-10 outline-none rounded-[10px] pl-5 text-[#626262] bg-[#ebfffc] text-[16px]'
            />
            {suggestions.length > 0 && (
              <ul className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-b-md max-h-32 overflow-y-auto z-10">
                {suggestions.map((s, index) => (
                  <li
                    key={index}
                    className="p-2 cursor-pointer hover:bg-blue-100"
                    onClick={() => selectCity(`${s.name}${s.state ? ", " + s.state : ""}, ${s.country}`, s.lat, s.lon)}
                  >
                    {s.name}{s.state ? `, ${s.state}` : ''}, {s.country}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center gap-5">
            <div
              className="w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center cursor-pointer"
              onClick={getWeatherByCity}
              title="Search Weather"
            >
              <IoMdSearch className="text-[24px] text-black" />
            </div>
            <p className="text-[30px] ml-14 text-white">or</p>
            <div
              onClick={getUserLocation}
              className="w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center ml-8 cursor-pointer"
              title="Get Weather for Current Location"
            >
              <FaLocationCrosshairs className="text-[24px] text-black" />
            </div>
          </div>
        </div>

        <br />

        <div className="px-20 py-5 flex text-white justify-between rounded-[10px]">
          <div>
            <h2 className='text-[40px] text-center'>{weather ? `${weather.city}` : '__________'}</h2>
            <div className="flex justify-center">
              <img
                src={weather ? weather.icon : "https://c8.alamy.com/comp/2GRERRE/a-sunny-weather-condition-2GRERRE.jpg"}
                alt="weather"
                className='w-[90px] h-[90px] my-2'
              />
            </div>
            <div className='flex gap-1'>
              <FaTemperatureLow className='text-[28px]' />
              <p className='text-[24px]'>Temperature: {weather ? `${weather.temperature}°C` : '___ °C'}</p>
            </div>
            <div className='flex gap-1'>
              <TiWeatherWindyCloudy className='text-[30px]' />
              <p className='text-[24px]'>Wind Speed: {weather ? `${weather.wind} m/s` : '___ m/s'}</p>
            </div>
            <div className='flex gap-1'>
              <WiHumidity className='text-[30px]' />
              <p className='text-[24px]'>Humidity: {weather ? `${weather.humidity}%` : '___%'}</p>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default Weather;
