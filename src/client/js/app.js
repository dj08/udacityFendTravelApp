// Frontend javascript for Travel app

// Top level JS object to hold latest trip details 
const upcomingTripDetails = {
    place: '',
    country: '',
    latitude: '',
    longitude: '',
    departure: ''
};

const presentErr = console.log; // Error presentation function

// Setup for GeoNames API. Rubric needs this info in the main app.js
const geonamesUrl = 'http://api.geonames.org/postalCodeSearchJSON';
const geonamesUser = 'deejay08';
const coordQueryUrl = (place, user) => {
    // Need to handle input like 'City, State' as well as 'City State'
    const placeWithoutSpaces = place.replace(/\s+/g, ',');
    console.log("fetching for ", placeWithoutSpaces);
    return `${geonamesUrl}?placename=${place}&username=${user}` +
        '&maxRows=2&style=short';
};

// Setup for Dark Sky & Pixabay APIs. The API communication actually
// happens through the backend. The following are here just to meet
// rubric requirements of these vars being defined in frontend
// app.js. The API communication cannot happen through frontend app.js
// owing to cross-origin restrictions in the dark sky API.
/* eslint-disable */
const darkSkyUrl = 'http://api.darksky.net/forecast/';
const darkSkyKey = 'bfa91238e8d40ed514ccc04024cdab19';

const pixabayUrl = 'https://pixabay.com/api/?category=places&key=';
const pixabayKey = '14764674-6073320ee678de9704f2a472c';
/* eslint-enable */

export async function getWeatherForecast () {
    const data = {
        latitude: upcomingTripDetails.latitude,
        longitude: upcomingTripDetails.longitude,
        date: upcomingTripDetails.departure,
        placeName: upcomingTripDetails.place
    };
    console.log("Passed data to weather app is: ", data);
    const apiResponse =
          await fetch('/getWeather', {
              method: 'POST',
              credentials: 'same-origin',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
          });
    try {
        const weatherInfo = await apiResponse.json();
        document.getElementById('weather').innerHTML = JSON.stringify(weatherInfo);
    } catch(err) {
        presentErr('Failed to get weather: ', err);
    }
}

export async function getLocationCoordinates (ev) {
    ev.preventDefault();
    const location = document.getElementById('city').value;
    fetch(coordQueryUrl(location, geonamesUser))
        .then(res => res.json())
        .then(res => {
            console.log("Received data: ", res);
            const place = res.postalCodes.shift();
            const city = place.placeName;
            const country = place.countryCode;
            upcomingTripDetails.latitude = place.lat;
            upcomingTripDetails.longitude = place.lng;
            upcomingTripDetails.place = city;
            upcomingTripDetails.country = country;
            document.getElementById('upcoming-trip-location').innerHTML =
                `${city}, ${country}`;
        })
        .then(res => {
            console.log(res);
            getWeatherForecast()
        });
    return {
        lat: upcomingTripDetails.latitude,
        lng: upcomingTripDetails.longitude
    }
}

export async function getDateInput (ev) {
    ev.preventDefault();
    upcomingTripDetails.departure =
        document.getElementById('new-travel-date').valueAsNumber;
    console.log('Entered date: ', upcomingTripDetails.departure);
    const daysToGo =
          Math.round((upcomingTripDetails.departure - new Date())/(1000*60*60*24));
    document.getElementById('days-to-go').innerHTML = daysToGo; 
}

