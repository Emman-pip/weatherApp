// date

function disableNews() {
  const newsFeed = document.querySelector(".newsfeed");
  const newsPanel = document.querySelector(".newsPanel");
  newsPanel.classList.add("fit");
  newsFeed.classList.add("none");
}
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
    const dataForecast = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=31c3bfca6ae74f2bacb123625230806&q=${location}`,
      {
        mode: "cors",
      }
    );

    const jsn = await dataForecast.json();
    console.log(jsn);
    return jsn;
  } catch (error) {
    alert(error + "\nAPIS ARE NOT AVAILABLE/AT FULL CAPACITY");
    disableNews();
  }
}

//forecast
async function forecastData(location) {
  try {
    const data = await APIdata(location);
    return data;
  } catch (err) {
    // window.close()
    console.log(err);
  }
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

async function perhour(time) {
  const data = await forecastData(location);
  const clock = parseInt(time);

  const temp = data.forecast.forecastday[0].hour[clock].temp_c;
  return temp;
}

async function hourlyConditionPic(time, image) {
  try {
    const request = new Request(
      "https://www.weatherapi.com/docs/conditions.json"
    );
    const data = await fetch(request);
    // const image = document.querySelector(".hourlyCondition");
    const jsn = await data.json();
    if (parseInt(time) < 6 || parseInt(time) > 18) {
      image.src = `./media/weather/weather/64x64/night/${jsn[time].icon}.png`;
    } else {
      image.src = `./media/weather/weather/64x64/day/${jsn[time].icon}.png`;
    }
  } catch (err) {
    console.log(err);
    //alert(err + "\nSEEMS LIKE I'M NOT UP");
    //window.close();
  }
}

function InsertImageElement(src, parent) {
  const mother = document.querySelector(`${parent}`);
  const image = document.createElement("img");
  image.classList.add("thermo");
  image.src = src;
  mother.appendChild(image);
}

async function useWeatherData(location = "Philippines") {
  try {
    const loc = document.querySelector(".location");
    const condition = document.querySelector(".condition");
    const temperature = document.querySelector(".temperature");
    const date = document.querySelector(".date");
    date.innerHTML = "";
    temperature.innerHTML = "";
    //weatherAPI
    const weatherData = await forecastData(location);
    const city = weatherData.location.name;
    const nation = weatherData.location.country;
    const conditionText = weatherData.current.condition.text;

    loc.textContent = `${city}, ${nation}`;
    condition.textContent = `${conditionText}`;
    const image = document.querySelector(".conditionImage");
    image.src = weatherData.current.condition.icon;

    InsertImageElement("./media/Thermometer_icon.png", ".temperature");
    const hour = weatherData.current.last_updated;
    const realHour = hour.slice(-5, -3);
    perhour(realHour).then((res) => {
      const p = document.createElement("p");
      p.classList.add("temperatureText");
      p.textContent = ` ${res}°C`;
      temperature.appendChild(p);
    });
    const COR = weatherData.forecast.forecastday[0].day.daily_chance_of_rain;
    const dateText = document.createElement("p");

    dateText.classList.add("dateText");
    dateText.textContent = COR + "% chance of rain";
    date.appendChild(dateText);
  } catch (err) {
    console.log(err + "\nSEEMS LIKE I'M NOT UP");
  }
}

// async function useNewsData(subject = "Philippines") {
//   try {
//     const data = await newsData(subject);
//     const newsfeed = document.querySelector(".newsfeed");
//     newsfeed.innerHTML = "";
//     for (let i = 0; i < data[0].length; i++) {
//       const container = document.createElement("div");
//       container.classList.add("newsContainer");

//       const title = document.createElement("h3");
//       title.classList.add("newsTitle");
//       title.textContent = data[0][i];
//       const description = document.createElement("p");
//       title.classList.add("newsDescription");
//       description.textContent = data[1][i];

//       title.onclick = () => {
//         window.open(data[2][i]);
//       };

//       container.appendChild(title);
//       container.appendChild(description);
//       newsfeed.appendChild(container);
//     }
//   } catch (err) {
//     alert("NEWS SECTION IS NOT AVAILABLE");
//     disableNews();
//   }
// }
///////////////////////////////

async function newsData(subject = "London") {
  try {
    const data = await fetch(
      `https://newsdata.io/api/1/news?apikey=pub_2463770f5e029adaefc2921baa9e82dcc1115&q=${subject}`
    );
    const news = await data.json();
    return news;
  } catch (error) {
    alert(error + "\nNO NEWS DATA AVAILABLE");
    const newsWindow = document.querySelector(".news");
    newsWindow.classList.add("none");
  }
}

newsData().then((res) => {
  console.log(res);
});

async function useNewsData(subject, parent) {
  const Newscontainer = document.createElement("div");
  //   Newscontainer.innerHTML = "";
  parent.appendChild(Newscontainer);
  Newscontainer.classList.add("news");

  //   const iconContainer = document.createElement("div");
  //   Newscontainer.appendChild(iconContainer);
  const infoContainer = document.createElement("div");
  Newscontainer.appendChild(infoContainer);
  infoContainer.classList.add("gap");

  const data = await newsData(subject);
  const dataList = data.results;
  for (let x in dataList) {
    const articleContainer = document.createElement("div");
    infoContainer.appendChild(articleContainer);

    const title = document.createElement("div");
    title.style.cursor = "pointer";
    title.classList.add("title");
    title.textContent = dataList[x].title;
    articleContainer.appendChild(title);

    const description = document.createElement("div");
    description.classList.add("desc");

    description.textContent = dataList[x].description;
    articleContainer.appendChild(description);

    // const icon = new Image();
    // icon.src = dataList[x].image_url;
    // iconContainer.appendChild(icon);

    title.onclick = () => {
      window.open(dataList[x].link);
    };
  }
}

///////////////////////////////

async function futureWeather(loc) {
  try {
    const container = document.querySelector(".future");
    container.innerHTML = "";
    const data = await forecastData(loc);

    const hourlyData = data.forecast.forecastday[0].hour;
    for (let i = 0; i < 24; i++) {
      const time = hourlyData[i].time;
      const timeofDay = time.split(-5);
      const temp = hourlyData[i].temp_c;

      const fcontainer = document.createElement("div");
      fcontainer.classList.add("hourlyContainer");
      container.appendChild(fcontainer);

      const picture = document.createElement("img");
      picture.classList.add("hourlyCondition");
      fcontainer.appendChild(picture);

      const hour = parseInt(timeofDay[0].slice(-5, -3));
      hourlyConditionPic(hour, picture);

      const timeDisplay = document.createElement("p");
      timeDisplay.textContent = timeofDay[0].slice(-5);
      fcontainer.appendChild(timeDisplay);

      const tempDisplay = document.createElement("p");
      tempDisplay.textContent = temp + "°C";
      fcontainer.appendChild(tempDisplay);
    }
  } catch (error) {
    console.log(err);
  }
}

function call(value = "Philippines") {
  const parent = document.querySelector(".newsfeed");
  useWeatherData(value);
  useNewsData(value, parent);
  futureWeather(value);
}
function loadingScreen() {
  const screen = document.querySelector(".loadingBlur");
  screen.classList.toggle("none");
  setTimeout(() => {
    screen.classList.toggle("none");
  }, 3000);
}
(function searchFunction() {
  call();

  const searchBox = document.querySelector(".search");
  const button = document.querySelector(".onlyButton");
  button.addEventListener("click", () => {
    loadingScreen();
    call(searchBox.value);
  });
  searchBox.addEventListener("keyup", (event) => {
    if (event.code == "Enter") {
      loadingScreen();
      call(searchBox.value);
    }
  });
})();
