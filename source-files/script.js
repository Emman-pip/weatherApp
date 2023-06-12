//weather api
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
        `https://newsapi.org/v2/everything?q=weather-${location}&from=2023-06-1&sortBy=popularity&apiKey=b2950f13dd814fa19bd4a6e883ef3217`,
        {
          mode: "cors",
        }
      ),
    ]);

    const jsn = await Promise.all([dataWeather.json(), dataNews.json()]);
    //    console.log(jsn);
    return jsn;
  } catch (error) {
    console.log(error);
  }
}

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
weather("london");

//for news
async function newsData(subject) {
  const data = await APIdata(subject);
  console.log(data);
  let num = 0;
  //title
  const articleTitle = data[1].articles[num].title;

  //description
  const articleDescription = [];
  const preDescription = data[1].articles.description;

  //url
  const articleUrl = data[1].articles.url;

  console.log(articleTitle);
}
newsData("london weather");

// return articleTitle;

// news api key:b2950f13dd814fa19bd4a6e883ef3217
// url format `https://newsapi.org/v2/everything?q=weather-${location}&from=2023-06-1&sortBy=popularity&apiKey=b2950f13dd814fa19bd4a6e883ef3217`
// `https://newsapi.org/v2/everything?q=weather-${location}&from=2023-06-1&sortBy=popularity&apiKey=b2950f13dd814fa19bd4a6e883ef3217`;

// const lol = "Philippines";
// weatherData(lol).then((res) => alert(res));
