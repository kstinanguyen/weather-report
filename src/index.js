"use strict";

const loadControls = () => {
  const increaseTempControl = document.getElementById('increaseTempControl');
  const decreaseTempControl = document.getElementById('decreaseTempControl');
  const tempValue = document.getElementById('tempValue');
  const landscape = document.getElementById('landscape');
  const currentTempButton = document.getElementById('currentTempButton');
}

const updateTemp = (increment) => {
  let currentTemp = parseInt(tempValue.textContent);
  tempValue.textContent = currentTemp + increment;

  tempValue.classList.remove('red','orange','yellow','green','turqoise');
  if (currentTemp >= 79) {
    tempValue.classList.add('red');
  } else if (currentTemp >= 69) {
    tempValue.classList.add('orange');
  } else if (currentTemp >= 59) {
    tempValue.classList.add('yellow');
  } else if (currentTemp >= 49) {
    tempValue.classList.add('green');
  } else {
    tempValue.classList.add('turqoise');
  }
}

const updateLandscape = () => {
  let currentTemp = parseInt(tempValue.textContent);
  if (currentTemp >= 79) {
    landscape.textContent = '🌵__🐍_🦂_🌵🌵__🐍_🏜_🦂';
  } else if (currentTemp >= 69) {
    landscape.textContent = '🌸🌿🌼__🌷🌻🌿_☘️🌱_🌻🌷';
  } else if (currentTemp >= 59) {
    landscape.textContent = '🌾🌾_🍃_🪨__🛤_🌾🌾🌾_🍃';
  } else {
    landscape.textContent = '🌲🌲⛄️🌲⛄️🍂🌲🍁🌲🌲⛄️🍂🌲';
  }
}

const updateCityName = () => {
  const cityNameInput = document.getElementById('cityNameInput');
  const headerCityName = document.getElementById('headerCityName');

  cityNameInput.addEventListener("input", updateValue);

  function updateValue(e) {
    headerCityName.textContent = e.target.value;
  }
}

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

    return await findWeather(latitude, longitude);
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


const registerEventHandlers = (event) => {
  loadControls();
  increaseTempControl.addEventListener('click', () => {
    updateTemp(1);
    updateLandscape();
  });
  decreaseTempControl.addEventListener('click', () => {
    updateTemp(-1);
    updateLandscape();
  });
  currentTempButton.addEventListener('click', async () => {
    const query = headerCityName.textContent;
    const temp = await findLatitudeAndLongitude(query);
    let realTimeTemp = Math.round(temp);
    
    if (realTimeTemp !== null) {
      tempValue.textContent = realTimeTemp; 
    } else {
      tempValue.textContent = 'cannot find temperature'; 
    }
  });

  updateCityName();
}


document.addEventListener('DOMContentLoaded', registerEventHandlers);


