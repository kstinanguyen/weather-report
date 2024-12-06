"use strict";

// GLOBAL VARIABLES
const increaseTempControl = document.getElementById('increaseTempControl');
const decreaseTempControl = document.getElementById('decreaseTempControl');
const tempValue = document.getElementById('tempValue');
const landscape = document.getElementById('landscape');
const currentTempButton = document.getElementById('currentTempButton');
const cityNameInput = document.getElementById('cityNameInput');
const headerCityName = document.getElementById('headerCityName');
const skySelect = document.getElementById('skySelect');
const sky = document.getElementById('sky')
const gardenSection = document.getElementById('gardenSection');
const cityNameReset = document.getElementById('cityNameReset');
const horizonColor = document.getElementById('horizonColor');

horizonColor.classList.add('sky-gradient-00');

const defaultTemp = () => {
  const defaultTemperature = 70;
  tempValue.textContent = defaultTemperature;
  updateTempColor(defaultTemperature);
  updateLandscape();
}

// WAVE 2
const updateTemp = (increment) => {
  let currentTemp = parseInt(tempValue.textContent);
  let newTemp = currentTemp + increment;

  tempValue.textContent = newTemp;

  updateTempColor(newTemp);
}

const updateTempColor = (temperature) => {
  tempValue.classList.remove('red','orange','yellow','green','turqoise');

  const tempClass = temperature > 79 ? 'red' :
  temperature > 69 ? 'orange' :
  temperature > 59 ? 'yellow' :
  temperature > 49 ? 'green' : 'turqoise';

  tempValue.classList.add(tempClass);

  updateLandscape();
}

const updateLandscape = () => {
  let currentTemp = parseInt(tempValue.textContent);

  const landscapes = {
    "hot": '🌵__🐍_🦂_🌵🌵__🐍_🏜_🦂',
    "warm": '🌸🌿🌼__🌷🌻🌿_☘️🌱_🌻🌷',
    "moderate": '🌾🌾_🍃_🪨__🛤_🌾🌾🌾_🍃',
    "cold": '🌲🌲⛄️🌲⛄️🍂🌲🍁🌲🌲⛄️🍂🌲'
  };

  if (currentTemp >= 79) {
    landscape.textContent = landscapes.hot;
  } else if (currentTemp >= 69) {
    landscape.textContent = landscapes.warm;
  } else if (currentTemp >= 59) {
    landscape.textContent = landscapes.moderate;
  } else {
    landscape.textContent = landscapes.cold;
  }
}

// WAVE 3
const updateCityName = () => {
  cityNameInput.addEventListener("input", updateValue);

  function updateValue(e) {
    headerCityName.textContent = e.target.value;
  }
}

// WAVE 4
const findLatitudeAndLongitude = async (query) => {
  try {
    const response = await axios
      .get('http://127.0.0.1:5000/location', {
        params: {
          q: query,
          format: 'json'
        }
      });

    const latitude = response.data[0].lat;
    const longitude = response.data[0].lon;
    console.log('success in findLatitudeAndLongitude!', 'latitude:', latitude, 'longitude:', longitude);

    return await findWeatherAndTime(latitude, longitude);
  } catch (error) {
    console.log(error);
    return null;
  }
}

const findWeather = async (lat, lon) => {
  try {
    const response = await axios
      .get('http://127.0.0.1:5000/weather', {
        params: {
          format: 'json',
          lat: lat,
          lon: lon,
        }
      });

    console.log('success in findWeather!', response.data);
    return response.data.main.temp;
  } catch (error) {
    console.log('error in findWeather!');
    return null;
  }
}

//optional enhancements//
const getLocalTime = async (lat, lon) => {
  try {
    const response = await axios
      .get('http://127.0.0.1:5000/timezone', {
        params: {
          format: 'json',
          lat: lat,
          lng: lon,
        }
      });
    
    console.log('success in getLocalTime!', response.data);
    const formattedTime = response.data.formatted;
    updateBodyBackground(formattedTime);
    return extractTime(formattedTime);
  } catch (error) {
    console.log(error);
    return null;
  }
}

const extractTime = (formattedTime) => {
  if (formattedTime) {
    const timeString = formattedTime.split(' ')[1];  // Get time part (HH:MM:SS)
    return timeString;
  }
  return null;
}

const findWeatherAndTime = async (lat, lon) => {
  try {
    const weatherData = await findWeather(lat, lon);
    console.log('Weather data:', weatherData);

    const localTime = await getLocalTime(lat, lon);
    console.log('Local Time:', localTime);

    return { weather: weatherData, localTime };
  } catch (error) {
    console.log('Error in findWeatherAndTime:', error);
    return null;
  }
}

const updateBodyBackground = (localTime) => {
  const hour = new Date(localTime).getHours();
  horizonColor.className = ''; // Clear all classes
  horizonColor.classList.add(`sky-gradient-${hour < 10 ? '0' : ''}${hour}`); // Adds correct class based on hour
}

// WAVE 5
const changeSky = () => {
  skySelect.addEventListener('change', () => {
    gardenSection.classList.remove('sunny','cloudy','rainy','snowy');

    if (skySelect.value == 'default') {
      sky.textContent = '';
    } else if (skySelect.value == 'sunny') {
      sky.textContent = `☁️ ☁️ ☁️ ☀️ ☁️ ☁️`;
      gardenSection.classList.add('sunny');
    } else if (skySelect.value == 'cloudy') {
      sky.textContent =`☁️☁️ ☁️ ☁️☁️ ☁️ 🌤 ☁️ ☁️☁️`;
      gardenSection.classList.add('cloudy');
    } else if (skySelect.value == 'rainy') {
      sky.textContent = `🌧🌈⛈🌧🌧💧⛈🌧🌦🌧💧🌧🌧`;
      gardenSection.classList.add('rainy');
    } else if (skySelect.value == 'snowy') {
      sky.textContent = `🌨❄️🌨🌨❄️❄️🌨❄️🌨❄️❄️🌨🌨`;
        gardenSection.classList.add('snowy');
    }
  });
}

// WAVE 6
const resetCityName = () => {
  cityNameReset.addEventListener('click', () => {
    cityNameInput.value = '';
    headerCityName.textContent = '';
  });
}


// Registering event handlers
const registerEventHandlers = (event) => {
  increaseTempControl.addEventListener('click', () => {
    updateTemp(1);
  });

  decreaseTempControl.addEventListener('click', () => {
    updateTemp(-1);
  });
  
  currentTempButton.addEventListener('click', async () => {
    const query = headerCityName.textContent;
    const { weather, localTime } = await findLatitudeAndLongitude(query);
    let realTimeTemp = Math.round(weather);
    
    if (realTimeTemp !== null) {
      tempValue.textContent = realTimeTemp; 
      updateTempColor(realTimeTemp);
    } else {
      tempValue.textContent = 'cannot find temperature'; 
    }
  });

  updateCityName();
  changeSky();
  resetCityName();
}

document.addEventListener('DOMContentLoaded', () => {
  registerEventHandlers();
  defaultTemp();
});


