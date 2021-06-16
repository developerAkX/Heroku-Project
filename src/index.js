const requests = require("requests");
const express = require("express");
const path = require("path");
const hbs = require("hbs");

const app = express();
const port = process.env.PORT || 8000;

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
  if (req.query.city) {
    requests(
      `http://api.openweathermap.org/data/2.5/weather?q=${req.query.city}&appid=51ddb5900aa0c587290765cefd31ff38`
    )
      // On data
      .on("data", (chunk) => {
        const data = JSON.parse(chunk);
        console.log(data);

        res.render("index", {
          tempVal: `${Math.round(data.main.temp - 273.15)} °C`,
          tempMin: `${Math.round(data.main.temp_min - 273.15)} °C`,
          tempMax: `${Math.round(data.main.temp_max - 273.15)} °C`,
          location: data.name,
          country: data.sys.country,
          tempStatus: data.weather[0].main,
        });
      })
      // On end
      .on("end", (err) => {
        err ? console.log("connection closed due to errors", err) : null;
      });
  } else {
    res.render("start");
  }
});

app.get('*', (req, res) => {
  res.render("404", {
    error: "Page not found"
  });
});
app.listen(port, () => {
  console.log(`Server started on http://localhost:8000/?city=hajipur`);
});