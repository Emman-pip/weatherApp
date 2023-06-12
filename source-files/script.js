async function weatherData(location) {
  const data = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=31c3bfca6ae74f2bacb123625230806&q=${location}`,
    {
      mode: "cors",
    }
  );
  const jsn = await data.json();
  const condition = jsn.current.condition.text;
  console.log(condition);
  return condition;
}

weatherData("sahara dessert");
