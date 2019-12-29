// Functions to handle Dark Sky API requests
const fetch = require('node-fetch');

const darkSkyUrl = 'https://api.darksky.net/forecast/';

const weatherQueryUrl = (lat, lgt, tdate, key) =>
      `${darkSkyUrl}${key}/${lat},${lgt},${tdate}` +
      '?exclude=currently,hourly,minutely,flags';

const queryWeather = async (request, darkSkyKey) => {
    const latitude = request.latitude;
    const longitude = request.longitude;
    const placeName = request.placeName;
    // JS returns date in ms, but dark sky needs it in seconds.
    const date = request.date/1000;

    // Dark Sky query
    const weatherResponse =
	  await fetch(weatherQueryUrl(
	      latitude, longitude, date, darkSkyKey))
	  .then(res => res.json())
	  .catch(err => {
	      console.log('Error in getting weather Data: ', err);
	  });

    return weatherResponse.daily.data[0];
};

module.exports = { queryWeather };
