const body = document.querySelector('body');
const form = document.querySelector('#searchForm');
const input = document.querySelector('#searchInput');
const weatherContainer = document.querySelector('#weatherContainer');
const weatherForecast = document.querySelector('#weatherForecast');
const button = document.querySelector('#theme');
const apiKey = 'edfbc4d4aea2bc664ade9c88aebc1b25';

button.addEventListener('click', changeTheme);

function changeTheme() { 
    body.classList.toggle('dark');
    if (button.textContent === 'Dark Theme') {
        button.textContent = 'Light Theme';
    }
    else {
        button.textContent = 'Dark Theme';
    }
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
} else { console.log('Geolocation is not supported by this browser.');}


function showPosition(position) {
    const { latitude, longitude } = position.coords;
    const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=5&appid=${apiKey}`;
  
  fetch(url)
    .then(response => response.json())
      .then(data => {
          const { name } = data[0];
          const url = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${apiKey}&units=metric`;
   
          getWeather(url);
    })
      .catch(error => {
          weatherHTML = `<h5>No city or country with this name... </h5>`;
          weatherContainer.innerHTML = weatherHTML;
          console.log('error: ', error);
      });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchTerm = input.value;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${apiKey}&units=metric`;
    weatherForecast.innerHTML = '';
    getWeather(url);
});

function getWeather(url) {
    fetch(url)
    .then(response => response.json())
      .then(data => {
          const { name, main: { temp, humidity }, weather: [{ description, icon }] } = data;
          const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${name}&appid=${apiKey}`;
          const forecast = function () {
              console.log(name);
              showForecast(urlForecast, name);
          };
      let weatherHTML = `
        <h2>${name}</h2>
        <button id="forecast" class="w3-button dark">Forecast</button>
        <img src="http://openweathermap.org/img/w/${icon}.png" alt="${description}">
        <p>${description}</p>
        <p>Temperature: ${temp}&#8451;</p>
        <p>Humidity: ${humidity}%</p>
      `;
          weatherContainer.innerHTML = weatherHTML;
          document.querySelector('#forecast').addEventListener('click', forecast);
          
    })
      .catch(error => {
          weatherHTML = `<h5>No city or country with this name... </h5>`;
          weatherContainer.innerHTML = weatherHTML;
          console.log('error ', error);
      });
}

function showForecast(url, name) {
    weatherContainer.innerHTML = `
    <h2>${name}</h2>
    <p>5 days forecast</p>
    `;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const days = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const today = new Date().getDay();
            
            for (const [index, details] of Object.entries(data)) {
            
                if (index === 'list') {
                    let daysCount = 0;

                    for (const [i, detail] of details.entries()) {
                        if (i < 5) {
                            let dayIndex = (today + daysCount) < 7 ? (today + daysCount) : (today + daysCount) - 7;
                            let { main, description, icon } = detail.weather[0];
                            let weatherHTML = `
                          
                            <h2>${days[dayIndex]}</h2>
                            <img src="http://openweathermap.org/img/w/${icon}.png" alt="${description}">
                            <p>${main}</p>
                            `;
                            let p = document.createElement("p");
                            weatherForecast.append(p);
                            p.innerHTML = weatherHTML;
                            daysCount++;
                        }
                    }
                }
                
            }
        })
        .catch(error => console.log(error));
}
