// date
function oneMonthAgo() {
  const date = new Date();
  const day = () => {
    console.log(date.getDate().toString().length);
    if (date.getDate().toString.length == 1) {
      return `0${date.getDate()}`;
    } else {
      return date.getMonth();
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

  return `${year}-${month() - 1}-${day()}`;
}
//fetching shit
async function APIdata(location) {
  try {
    const data = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=31c3bfca6ae74f2bacb123625230806&q=${location}`,
      {
        mode: "cors",
      }
    );

    const [dataWeather, dataNews] = await Promise.all([
      fetch(
        `https://api.weatherapi.com/v1/current.json?key=31c3bfca6ae74f2bacb123625230806&q=${location}`,
        {
          mode: "cors",
        }
      ),
      fetch(
        `https://newsapi.org/v2/everything?q=weather-${location}&from=${oneMonthAgo()}&sortBy=popularity&apiKey=b2950f13dd814fa19bd4a6e883ef3217`,
        {
          mode: "cors",
        }
      ),
    ]);

    const jsn = await Promise.all([dataWeather.json(), dataNews.json()]);
    return jsn;
  } catch (error) {
    console.log(error);
  }
}

//weather api
async function weatherData(location) {
  const data = await APIdata(location);
  const condition = data[0].current.condition.text;
  const countryCity = `${data[0].location.name}, ${data[0].location.country}`;
  return [countryCity, condition];
}
async function weather(country) {
  const lol = await weatherData(country);
  console.log(`WEATHER:\nlocation: ${lol[0]}\ncondition:${lol[1]}`);
}

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
  for (let i = 0; i < data[1].articles.length; i++) {
    const titles = data[1].articles[i].title;
    list2.push(titles);
    //description
    const preDescriptions = data[1].articles[i].description;
    list1.push(preDescriptions);

    //url
    const urls = data[1].articles[i].url;
    list3.push(urls);
  }
}

//for news
// TODO: capitalize the 1st letter[of "subject"] and lowercase the remaining
async function newsData(subject) {
  console.log(subject);
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
newsData("Philippines").then((res) => {
  console.log(res);
});

// news api key:b2950f13dd814fa19bd4a6e883ef3217
// url format `https://newsapi.org/v2/everything?q=weather-${location}&from=2023-06-1&sortBy=popularity&apiKey=b2950f13dd814fa19bd4a6e883ef3217`
// `https://newsapi.org/v2/everything?q=weather-${location}&from=2023-06-1&sortBy=popularity&apiKey=b2950f13dd814fa19bd4a6e883ef3217`;
