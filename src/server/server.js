// Server side code for Travel App. Owing to strict CORS requirements
// in the Dark-Sky API, it does considerably more than the minimal
// function of saving past user data. Geonames API handling is done
// through frontend code as per rubric requirement, rest are done
// here.

// My project constants
// Backend port is noted as a global constant to share the setting
// with webpack. This enables proxying requests during development.
const servePort = require('../../CONSTANTS').BACKEND_PORT;

// Read .env file for API keys
const dotenv = require('dotenv').config();

// Install express server and sisters
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const os = require('os');
const fetch = require('node-fetch');

// Error checking for dotenv config
if (!(('DARK_SKY_KEY' in process.env) &&
      ('PIXABAY_KEY' in process.env))) {
    throw "ERROR: Could not find API Keys." +
        ' Is the .env file correctly placed?'
}

// Dark Sky API setup -- this code actually does the hard work
const darkSky = require('./darkSkyApi.js');
const darkSkyKey = process.env.DARK_SKY_KEY;

// Pixbay API setup
const pixabay = require('./pixabayApi.js');
const pixabayKey = process.env.PIXABAY_KEY;

// Express server setup
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Server static webpage from website folder
app.use(express.static('./dist'));

const server = app.listen(servePort, _ => {
    console.log(`Server started on ${os.hostname().toLowerCase()}.local:${servePort}`);
});

app.post('/getPlaceDetails', async (req, res) => {
    const weatherData =
          await darkSky.queryWeather(req.body, darkSkyKey);

    const imageUrl =
          await pixabay.getImage(req.body.placeName, pixabayKey);

    res.send({
        summary: weatherData.summary,
        tempHigh: weatherData.temperatureHigh,
        tempLow: weatherData.temperatureLow,
        image: imageUrl
    });
});

app.get('/getData', (req, res) => {
    console.log(`Sending data: `, projectData);
    res.send(projectData);
});

app.post('/saveData', (req, res) => {
    projectData = req.body;
    console.log(`Saved data: `, projectData);
});
