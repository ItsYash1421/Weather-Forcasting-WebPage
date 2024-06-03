let sunIcon = document.getElementById('sun');
let moonIcon = document.getElementById('moon');
let body = document.body;

sunIcon.addEventListener('click', () => {
    body.classList.add('dark-mode');
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
});

moonIcon.addEventListener('click', () => {
    body.classList.remove('dark-mode');
    sunIcon.style.display = 'block';
    moonIcon.style.display = 'none';
});


let show = document.getElementById("show");
let search = document.getElementById("search");
let cityVal = document.getElementById("city");
let topCitiesContainer = document.getElementById("topCities");

let key = "2f745fa85d563da5adb87b6cd4b81caf";

let citiesToCheck = ["Nagpur", "Delhi","Haryana","Punjab","Rajasthan","Jodhpur","Badmer"];

let getWeather = (city = "Delhi") => {
  let cityValue = cityVal.value.trim() || city;
  if (cityValue.length == 0) {
    show.innerHTML = `<h3 class="error">Please enter a city name</h3>`;
  } else {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${key}&units=metric`;
    cityVal.value = "";
    fetch(url)
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("City not found");
        }
        return resp.json();
      })
      .then((data) => {
        show.innerHTML = `
          <h2>${data.name}, ${data.sys.country}</h2>
          <h4 class="weather">${data.weather[0].main}</h4>
          <h4 class="desc">${data.weather[0].description}</h4>
          <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">
          <h1>${data.main.temp} &#176;</h1>
          <div class="temp_container">
            <div>
              <h4 class="title">min</h4>
              <h4 class="temp">${data.main.temp_min}&#176;</h4>
            </div>
            <div>
              <h4 class="title">max</h4>
              <h4 class="temp">${data.main.temp_max}&#176;</h4>
            </div>   
          </div>
        `;
      })
      .catch((error) => {
        show.innerHTML = `<h3 class="error">${error.message}</h3>`;
      });
  }
};

let getTopCitiesWeather = () => {
  let promises = citiesToCheck.map(city => {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`;
    return fetch(url).then(resp => {
      if (!resp.ok) {
        throw new Error("City not found");
      }
      return resp.json();
    }).catch(error => {
      console.error(`Error fetching weather data for ${city}:`, error);
      return null;
    });
  });

  Promise.all(promises).then(results => {
    let validResults = results.filter(data => data !== null);
    validResults.sort((a, b) => b.main.temp - a.main.temp);
    let top3 = validResults.slice(0, 3);

    topCitiesContainer.innerHTML = "";
    top3.forEach(data => {
      let cityWeather = document.createElement("div");
      cityWeather.classList.add("city-weather");
      cityWeather.innerHTML = `
      <div class="sdiv">
        <h3>${data.name}, ${data.sys.country}</h3>
        <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">
        <h2>${data.main.temp} &#176;</h2>
        </div>
      `;
      topCitiesContainer.appendChild(cityWeather);
    });
  });
};

search.addEventListener("click", () => getWeather(cityVal.value));
window.addEventListener("load", () => {
  getWeather();
  getTopCitiesWeather();
});
