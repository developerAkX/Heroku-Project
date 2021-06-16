const requests = require("requests");
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const axios = require('axios');

const app = express();
const port = process.env.PORT || 8000;
const apiKey = `51ddb5900aa0c587290765cefd31ff38`;


// Defining Paths
const staticPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../layout/views");
const partialsPath = path.join(__dirname, "../layout/components");


// Setting-up app
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);


// Setting-up middleware
app.use(express.static(staticPath));


// Setting-up routes
app.get("/", (req, res) => {
  const getWeatherReport = async (city) => {
    try {
      const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=51ddb5900aa0c587290765cefd31ff38`);
      const WeatherReport = response.data;
      res.render("index", {
        tempVal: `${Math.round(WeatherReport.main.temp - 273.15)} °C`,
        tempMin: `${Math.round(WeatherReport.main.temp_min - 273.15)} °C`,
        tempMax: `${Math.round(WeatherReport.main.temp_max - 273.15)} °C`,
        location: WeatherReport.name,
        country: WeatherReport.sys.country,
        tempStatus: WeatherReport.weather[0].main,
      })
    } catch (error) {
      console.log(404, "render");
      res.render("404start", {
        city: city
      })
      console.log(error);
      return error;
    }
  }
  if (req.query.city)
    getWeatherReport(req.query.city);
  else {
    console.log(404, "render");
    res.render("404start", { city: req.query.city })
  }
});


app.get('*', (req, res) => {
  res.render("404", {
    error: "Page not found"
  });
});


// listening server
app.listen(port, () => {
  console.log(`Server started on ${port}`);
});