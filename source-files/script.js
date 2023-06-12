// date
function oneMonthAgo() {
  const date = new Date();
  const day = () => {
    if (date.getDate().toString().length == 1) {
      return `0${date.getDate()}`;
    } else {
      return date.getDate();
    }
  };
  const month = () => {
    if (date.getMonth().toString().length == 1) {
      return `0${date.getMonth()}`;
    } else {
      return date.getMonth();
    }
  };
  const year = date.getFullYear();

  return `${year}-${month()}-${day()}`;
}

//fetching shit
//weather apikey1: 9f959711daae4cbd94d132137231206 apikey2:31c3bfca6ae74f2bacb123625230806
//news apikey1: 79abc5ecbae5402a80a772a198b41908 apikey2:b2950f13dd814fa19bd4a6e883ef3217
async function APIdata(location) {
  try {
    const data = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=9f959711daae4cbd94d132137231206&q=${location}`,
      {
        mode: "cors",
      }
    );

    const [dataNews, dataForecast] = await Promise.all([
      fetch(
        `https://newsapi.org/v2/everything?q=weather-${location}&from=${oneMonthAgo()}&sortBy=popularity&apiKey=79abc5ecbae5402a80a772a198b41908`,
        {
          mode: "cors",
        }
      ),
      fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=31c3bfca6ae74f2bacb123625230806&q=${location}`,
        {
          mode: "cors",
        }
      ),
    ]);

    const jsn = await Promise.all([dataNews.json(), dataForecast.json()]);
    return jsn;
  } catch (error) {
    console.log(error);
  }
}

//forecast
async function forecastData(location) {
  const data = await APIdata(location);
  return data[1];
  //   //location
  //   const city = data.location.name;
  //   const country = data.location.country;
  //   //date of forecast
  //   const date = data.forecast.forecastday[0].date;
  //   //per hour
  //   const forecast = data.forecast.forecastday[0].hour;
  //   const at_1am = data.forecast.forecastday[0].hour[1].temp_c;
  //   const at_3am = data.forecast.forecastday[0].hour[1].temp_c;
  //   const at_6am = data.forecast.forecastday[0].hour[1].temp_c;
  //   const at_9am = data.forecast.forecastday[0].hour[1].temp_c;
  //   const at_12am = data.forecast.forecastday[0].hour[1].temp_c;
  //   const at_1pm = data.forecast.forecastday[0].hour[1].temp_c;
  //   const at_3pm = data.forecast.forecastday[0].hour[1].temp_c;
  //   const at_6pm = data.forecast.forecastday[0].hour[1].temp_c;
  //   const at_9pm = data.forecast.forecastday[0].hour[1].temp_c;
  //   const at_12pm = data.forecast.forecastday[0].hour[1].temp_c;
  //   //condition
  //   const condition = data.current.condition.text;
  //   console.log(data[1]);
  //   console.log(at_12am);
}
forecastData("Batangas");

//news
function keyWords(subject) {
  const list = [
    subject,
    "weather",
    "rain",
    "cloud",
    "rainbow",
    "temperature",
    "pressure",
    "overcast",
    "shower",
    "sunrise",
    "dry",
    "tornado",
    "sunset",
    "humidity",
    "cold",
    "heat",
    "wind",
    "cloudy",
    "heat wave",
    "cyclone",
    "typhoon",
  ];
  return list;
}

function toAppend(data, list1, list2, list3) {
  //title
  for (let i = 0; i < data[0].articles.length; i++) {
    const titles = data[0].articles[i].title;
    list2.push(titles);
    //description
    const preDescriptions = data[0].articles[i].description;
    list1.push(preDescriptions);

    //url
    const urls = data[0].articles[i].url;
    list3.push(urls);
  }
}

//for news
// TODO: capitalize the 1st letter[of "subject"] and lowercase the remaining
async function newsData(subject) {
  const data = await APIdata(subject);
  const articleTitle = [];
  const articleDescription = [];
  const articleUrl = [];

  const descriptions = [];
  const titles = [];
  const urls = [];
  toAppend(data, descriptions, titles, urls);

  const filter = keyWords(subject);
  for (let i = 0; i < filter.length; i++) {
    titles.forEach((word) => {
      if (word.includes(filter[i])) {
        const index = titles.indexOf(word);
        articleTitle.push(titles[index]);
        articleDescription.push(descriptions[index]);
        articleUrl.push(urls[index]);
      }
    });
  }

  return [articleTitle, articleDescription, articleUrl];
}

// async function weather(country) {
//   const data = await forecastData(country);
//   const city = data.location.name;
//   const nation = data.location.country;
//   const condition = data.current.condition.text;
//   console.log(
//     `WEATHER:\nlocation: ${city}, ${nation}\ncondition: ${condition}`
//   );
//   console.log(data);
// }

// weather("Tanauan city, batangas");

// newsData("Philippines").then((res) => {
//   console.log(res);
// });

// news api key:b2950f13dd814fa19bd4a6e883ef3217
// url format `https://newsapi.org/v2/everything?q=weather-${location}&from=2023-06-1&sortBy=popularity&apiKey=b2950f13dd814fa19bd4a6e883ef3217`
// `https://newsapi.org/v2/everything?q=weather-${location}&from=2023-06-1&sortBy=popularity&apiKey=b2950f13dd814fa19bd4a6e883ef3217`;

// function search(){
//     const searchButton = document.querySelector(".onlyButton");

// }
//MALI ANG CELSIUS SA PROGRAM!!!
async function perhour(time) {
  const data = await forecastData(location);
  const temp = data.forecast.forecastday[0].hour[parseInt(time) - 1].temp_c;
  return temp;
}

async function useWeatherData(location = "Philippines") {
  const loc = document.querySelector(".location");
  const condition = document.querySelector(".condition");
  const temperature = document.querySelector(".temperature");
  const date = document.querySelector(".date");
  //weatherAPI
  const weatherData = await forecastData(location);
  const city = weatherData.location.name;
  const nation = weatherData.location.country;
  const conditionText = weatherData.current.condition.text;

  loc.textContent = `${city}, ${nation}`;
  condition.textContent = `${conditionText}`;

  const hour = weatherData.current.last_updated;
  const realHour = hour.slice(-5, -3);
  console.log(realHour);

  perhour(realHour).then((res) => {
    temperature.textContent = ` ${res}°C`;
  });

  date.textContent = hour.slice(0, 10);
}

async function useNewsData(subject = "Philippines") {
  const data = await newsData(subject);
  const newsfeed = document.querySelector(".newsfeed");
  newsfeed.innerHTML = "";
  for (let i = 0; i < data[0].length; i++) {
    const container = document.createElement("div");
    container.classList.add("newsContainer");

    const title = document.createElement("h3");
    title.classList.add("newsTitle");
    title.textContent = data[0][i];
    const description = document.createElement("p");
    title.classList.add("newsDescription");
    description.textContent = data[1][i];

    title.onclick = () => {
      window.open(data[2][i]);
    };

    container.appendChild(title);
    container.appendChild(description);
    newsfeed.appendChild(container);
  }
}

async function futureWeather(loc) {
  try {
    const container = document.querySelector(".future");
    container.innerHTML = "";
    const data = await forecastData(loc);
    console.log(data);
    const hourlyData = data.forecast.forecastday[0].hour;
    console.log("running...");
    for (let i = 0; i < 24; i++) {
      console.log("creating...");
      const time = hourlyData[i].time;
      const timeofDay = time.split(-5);
      const temp = hourlyData[i].temp_c;

      const fcontainer = document.createElement("div");
      fcontainer.classList.add("hourlyContainer");
      container.appendChild(fcontainer);

      const timeDisplay = document.createElement("p");
      timeDisplay.textContent = timeofDay;
      fcontainer.appendChild(timeDisplay);

      const tempDisplay = document.createElement("p");
      tempDisplay.textContent = temp + "°C";
      fcontainer.appendChild(tempDisplay);
    }
  } catch (error) {
    console.log(error);
  }
}

function call(value = "Philippines") {
  useWeatherData(value);
  useNewsData(value);
  futureWeather(value);
}

(function searchFunction() {
  call();

  const searchBox = document.querySelector(".search");
  const button = document.querySelector(".onlyButton");
  button.addEventListener("click", () => {
    call(searchBox.value);
  });
  searchBox.addEventListener("keyup", (event) => {
    console.log(event);
    if (event.code == "Enter") {
      call(searchBox.value);
    }
  });
})();
