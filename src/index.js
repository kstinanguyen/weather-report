"use strict";

const loadControls = () => {
  const increaseTempControl = document.getElementById('increaseTempControl');
  const decreaseTempControl = document.getElementById('decreaseTempControl');
  const tempValue = document.getElementById('tempValue');
  const landscape = document.getElementById('landscape');
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
  updateCityName();
}


document.addEventListener('DOMContentLoaded', registerEventHandlers);


