const body = document.querySelector('body');
const form = document.querySelector('#searchForm');
const input = document.querySelector('#searchInput');
const weatherContainer = document.querySelector('#weatherContainer');
const weatherForecast = document.querySelector('#weatherForecast');
const button = document.querySelector('#theme');
const apiKey = 'edfbc4d4aea2bc664ade9c88aebc1b25';

button.addEventListener('click', changeTheme);

function changeTheme() { 
    const toggleDark = body.classList.toggle('dark');
    // if (button.textContent === 'Dark Theme') {
    //     button.textContent = 'Light Theme';
    // }
    // else {
    //     button.textContent = 'Dark Theme';
    // }
    button.textContent = toggleDark ? 'Light Theme' : 'Dark Theme';
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
          //console.log('reverse geolocating: ', name);
          const url = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${apiKey}&units=metric`;
   
          getWeather(url);
    })
      .catch(error => {
          weatherHTML = `<h5>No city or country with this name... </h5>`;
          weatherContainer.innerHTML = weatherHTML;
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
          console.log(data);
          const { name, main: { temp, humidity }, weather: [{ description, icon }] } = data;
          const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${name}&appid=${apiKey}&units=metric`;
          const forecast = function () {
              //console.log(name);
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
          //console.log('error ', error);
      });
}

function showForecast(url, name) {
    weatherContainer.innerHTML = `
    <h2>${name}</h2>
    <button class="w3-button dark" onclick="showToday()">Today</button>
    <p>5 days forecast</p>
    `;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            //console.log('data is: ', data);
            const days = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            let today = new Date().getDay();
            //console.log('today is: ', new Date().getDate());
            const currentDay = new Date().getDate();

                    const forecast5 = {};
                    let forecastTime = [];
                    let forecastDay = currentDay;
            
            for (const [index, details] of Object.entries(data)) {
                if (index === 'list') {
                    let daysCount = 0;
                   
                    for (const [i, detail] of details.entries()) {
                        console.log('detail : ', detail.dt_txt.slice(0, 10));
                        
                        let { main, description, icon } = detail.weather[0];
                        let temp = detail.main.temp;
                        //console.log(detail.main.temp);

                        if (detail.dt_txt.slice(8, 10) == forecastDay) {
                            //console.log(forecastDay);
                            forecastTime.push(`${detail.dt_txt.slice(-9)}:${temp}:${icon}`);
                            forecast5[detail.dt_txt.slice(0, 10)] = forecastTime;
                            //console.log(forecastTime);
                        } else {
                            forecast5[detail.dt_txt.slice(0, 10)] = forecastTime;
                            console.log(forecast5);
                            //console.log(forecastDay);
                            forecastDay++;
                            //console.log(forecastDay);
                            forecastTime = [];
                            forecastTime.push(`${detail.dt_txt.slice(-9)}:${temp}:${icon}`);
                            
                         }
                    }

                   
                    let forecast5Arr = Object.entries(forecast5);
                    forecast5Arr.pop();
                    
                    for (const [date, elements] of forecast5Arr) {
                        //console.log(forecast5);
                        console.log(date);
                        let dayIndex = (today + daysCount) < 7 ? (today + daysCount) : (today + daysCount) - 7;
                        let weatherHTML = `
                            <h3>${days[dayIndex]}</h3>
                            <h5>${date}</h5>
                            `;
                        let p = document.createElement('p');
                        p.classList.add(`head${date}`);
                        weatherForecast.append(p);
                        p.innerHTML = weatherHTML;
                        
                        for (let el of elements) {
                            let temperature = Math.round(Number(el.split(':')[3]));
                            let icon = el.split(':')[4];
                            //console.log(el);
                            let span = document.createElement("span");
                            span.innerHTML = `${el.slice(0,6)} ⌚ / <strong>${temperature}°C</strong><img src="http://openweathermap.org/img/w/${icon}.png" alt="desc">`;
                            document.querySelector(`.head${date}`).append(span);
                        }
                        daysCount++;
                    }
                    
                }
                
            }
        })
        .catch(error => console.log(error));
}

function showToday() {
    let searchTerm = document.querySelector('h2').textContent;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${apiKey}&units=metric`;
    getWeather(url);
    document.querySelector('#weatherForecast').innerHTML = '';
}
