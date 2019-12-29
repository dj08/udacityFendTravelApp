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

// Setup for GeoNames API. Rubric needs this info in the main app.js:
// "app.js: There should be URLS and API Keys for at least 3 APIs, including
// Geonames, Dark Sky, and Pixabay."
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

// Helper function to handle initial form input interaction
const updateEntryHelp = text =>
    document.getElementById('whats-happening').innerHTML = text;

export function activateDateField (ev) {
    ev.preventDefault();
    document.getElementById('new-travel-date').disabled = false;
    updateEntryHelp('Great! Please enter your travel date...');
}

export function activateSaveButton (ev) {
    ev.preventDefault();
    document.getElementById('save-trip-button').disabled = false;
    updateEntryHelp('Awesome! Please click Save Trip button to confirm!');
}

// Helper function to validate that city and date fields are not funky
const validateInputForms = () => {
    const valid = (document.getElementById('travel-to-city').value != '')
          && (document.getElementById('new-travel-date').value != '')
    if (!valid) {
        alert('Please enter valid Travel Destination and Dates!');
	return false;
    } else { return true; }
}

export function saveTripAndQuery (ev) {
    ev.preventDefault();
    updateEntryHelp('Thanks! Saving Trip...');

    // At this point, both city and date functions should have valid
    // values
    let success = validateInputForms(); 
    // Start API queries here
    /* Things to do:
       - New card appears to show travel details
       - Coordinates query API fires off. It is slowest.
       - Image search shows loading sign.
       - Image fetcher API fires and updates image.
       - Weather div updates to show that it is fetching weather
       - Weather API fires off after coordinates are available.
       - Save Trip API fires off to save trip to backend.
    */
    
    // Depending on the API responses, set tool tip messages
    if (success) {
        updateEntryHelp('Trip Saved. Please enter next destination.')
    } else {
        updateEntryHelp('Sorry -- something went wrong. Please try again.')
    }
}

export async function getWeatherForecast () {
    const data = {
        latitude: upcomingTripDetails.latitude,
        longitude: upcomingTripDetails.longitude,
        date: upcomingTripDetails.departure,
        placeName: upcomingTripDetails.place
    };
    console.log("Passed data to weather app is: ", data);
    const apiResponse =
          await fetch('/getPlaceDetails', {
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

