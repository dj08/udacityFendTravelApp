// Server side code for Travel App. It has a minimal function of
// saving past user data. API handling is done through frontend code
// as per rubric requirement.

// My project constants
// Backend port is noted as a global constant to share the setting
// with webpack. This enables proxying requests during development
const servePort = require('../../CONSTANTS').BACKEND_PORT;
let projectData = {}; // Object to hold API endpoint data

// Read .env file for API keys
const dotenv = require('dotenv').config();

// Set up express server and sisters
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const os = require('os');
const request = require('request');

// TODO: Enable error checking for dotenv config here

// Dark Sky API setup -- this code actually does the hard work
const darkSkyUrl = 'https://api.darksky.net/forecast/';
const darkSkyKey = process.env.DARK_SKY_KEY;
const weatherQueryUrl = (lat, lgt, tdate) => {
    return `${darkSkyUrl}${darkSkyKey}/${lat},${lgt},${tdate}` +
	'?exclude=currently,hourly,minutely,flags';
};

// Pixbay API setup
const pixabayUrl = 'https://pixabay.com/api/?category=places&key=';
const pixabayKey = process.env.PIXABAY_KEY;
const pixabayQueryUrl = term =>
      `${pixabayUrl}${pixabayKey}&q=${term}&image_type=photo`;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Server static webpage from website folder
app.use(express.static('./dist'));

const server = app.listen(servePort, _ => {
    console.log(`Running on ${os.hostname().toLowerCase()}.local:${servePort}`);
});

app.post('/getWeather', (req, res) => {
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const placeName = req.body.placeName;
    // JS returns date in ms, but dark sky needs it in seconds.
    const date = req.body.date/1000;

    // JS object to hold API query results. Eventually to be sent to
    // frontend code.
    const locationDetails = {};
    
    console.log('Querying for: ', latitude, longitude, date);
    console.log(weatherQueryUrl(latitude, longitude, date));

    // Dark Sky query
    request(
	{ url: weatherQueryUrl(latitude, longitude, date) },
	(err, {body}) => {
	    if (err) {
		return res.status(500).json({
		    type: 'error', message: err.error
		});
	    }
	    console.log(JSON.parse(body));

	    const weather = JSON.parse(body).daily.data[0];

	    console.log("Weather data: ", weather);
	    const locationDetails.summary = weather.summary;
	    const locationDetails.tempHigh = weather.temperatureHigh;
	    const tempLow = weather.temperatureLow;
	});

    // Pixabay Query
    request(
	{ url: pixabayQueryUrl(placeName) },
	(err, {body}) => {
	    if (err) {
		return res.status(500).json({
		    type: 'error', message: err.error
		});
	    }
	    console.log(JSON.parse(body));
	}
    )
    res.send(locationDetails);
});


app.get('/getData', (req, res) => {
    console.log(`Sending data: `, projectData);
    res.send(projectData);
});

app.post('/saveData', (req, res) => {
    projectData = req.body;
    console.log(`Saved data: `, projectData);
});
