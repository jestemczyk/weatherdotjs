const wrapper = document.querySelector(".wrapper");
const current = document.querySelector(".current");
const after = document.querySelector(".after");
const form = document.querySelector("header form");
const input = document.querySelector("header form input");
const geolocationButton = document.querySelector(".use-geolocation-button");

function toCelsies(kelvins) {
  return kelvins - 273.15;
}

function forTime(value) {
  if (Array.from(String(value)).length < 2) {
    const newValue = `0${value}`;
    return newValue;
  } else {
    return value;
  }
}

function messageToUser(value) {
  after.innerHTML = '';
  current.innerHTML = `<h2>${value}</h2>`;
  current.style.backgroundColor = "#ff0000";
  wrapper.style.border = "none";
}

function cancelMessage() {
  current.style.backgroundColor = "rgb(49, 49, 49, 0.8)";
  wrapper.style.border = "2px solid rgb(49, 49, 49)";
  wrapper.style.borderTopLeftRadius = "10px";
  wrapper.style.borderTopRightRadius = "10px";
}

function currentWeather(data) {
  cancelMessage();
  let date = new Date();
  let time = `${forTime(date.getHours())}:${forTime(date.getMinutes())}`;

  const inner = `
         <div>
          <p>${data.city.name}</p>
          <p>${time}</p>
        </div>
        <div class="curr-weather">
          <img src="https://openweathermap.org/img/wn/${
            data.list[0].weather[0].icon
          }.png" alt="weather icon" />
          <p>${data.list[0].weather[0].description}</p>
          <p>${Math.round(toCelsies(data.list[0].main.temp))}°C</p>
        </div>

        <div class="curr-wind">
          <p>Wind speed</p>
          <p>${data.list[0].wind.speed} m/s</p>
        </div>

    
    `;

  current.innerHTML = inner;
}

function nextWeather(data) {
  after.innerHTML = '';
  for (let i = 1; i < 14; i++) {
    let inner = `
        <div class="weather-block">
          <div class ="next-date">
            <p>${data.list[i].dt_txt}</p>
          </div>
          <div>
            <img src="https://openweathermap.org/img/wn/${
              data.list[i].weather[0].icon
            }.png" alt="weather image" />
          </div>
          <div>
            <p>${Math.round(toCelsies(data.list[i].main.temp))}°C</p>
          </div>
        </div>
    
        `;
    after.innerHTML += inner;
  }
}

async function getByLocation(lat, lon) {
  if (navigator.geolocation) {
    try {
      const appId = "a94d0a5ac08570add4b47b8da933f247";
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${appId}`
      );
      if (!response.ok) {
        throw new error("something went wrong with the server response");
      }
      const data = await response.json();
      currentWeather(data);
      nextWeather(data);
    } catch (error) {
      console.error(error.message);
    }
  }else{
    messageToUser('Cannot to take your geolocation');
  }
}

async function getByCityName(city) {
  try {
    const appId = "a94d0a5ac08570add4b47b8da933f247";
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${appId}`
    );
    if (!response.ok) {
      throw new error("something went wrong with the server response");
    }
    const data = await response.json();
    currentWeather(data);
    nextWeather(data);
  } catch (error) {
    console.error(error.message);
    messageToUser(
      "Please, check if the name of the city is written correctly!"
    );
  }
}

geolocationButton.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (location) => {
        getByLocation(location.coords.latitude, location.coords.longitude);
        console.log(
          `lat: ${location.coords.latitude} lon:${location.coords.longitude}`
        );
      },
      (error) => console.error(error.message)
    );
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  getByCityName(input.value);
});
