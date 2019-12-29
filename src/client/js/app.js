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

// This function creates the travel card for the latest input
function createUiNewTravelCard () {
    const tripDetailsDiv = document.createElement('div');
    tripDetailsDiv.class = 'upcoming-trip-details';

    // Insert new card here
    const tripDetailsDivHolder = document.getElementById('upcoming-trip-holder');
    
    const tripCard = document.createElement('div');
    // tripCard.id = 'upcoming-trip-details';

    const tripLocation = document.createElement('h2');
    tripLocation.id = 'upcoming-trip-location';
    tripLocation.innerHTML = 'Fetching Destination Coordinates...';

    const tripDays = document.createElement('h2');
    tripDays.id = 'days-to-go';

    const tripWeather = document.createElement('h3');
    tripWeather.id = 'weather';
    tripWeather.innerHTML = 'Fetching Weather at Destination...';

    tripCard.appendChild(tripLocation);
    tripCard.appendChild(tripDays);
    tripCard.appendChild(tripWeather);

    // Refresh div before inserting HTML
    tripDetailsDivHolder.innerHTML = '';
    tripDetailsDivHolder.appendChild(tripCard);
    /*
    const travelCardTemplate = `
    	<div class="holder upcoming-trip-details">
	<h2>My trip to: <div id="upcoming-trip-location"></div></h2>
	<h2>Days To Go: <div id="days-to-go"></div></h2>
	<h3>Weather: <div id="weather"></div></h3>
	</div>`;
    document.getElementById('upcoming-trip').innerHTML =
	travelCardTemplate;
    */
}

export async function saveTripAndQuery (ev) {
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
    */
    createUiNewTravelCard();
    getRemainingDays();
    // The following calls the rest of the APIs in chain
    getLocationCoordinates();
    
    // Depending on the API responses, set tool tip messages
    if (success) {
        updateEntryHelp('Trip Saved. Please enter next destination.')
    } else {
        updateEntryHelp('Sorry -- something went wrong. Please try again.')
    }
}

async function getPlaceDetails () {
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
        const placeInfo = await apiResponse.json();
        document.getElementById('weather').innerHTML = `
Forecast: ${placeInfo.summary}
L: ${placeInfo.tempLow} F, H: ${placeInfo.tempHigh} F
        `;
    } catch(err) {
        presentErr('Failed to get weather: ', err);
    }
}

async function getLocationCoordinates () {
    const location = document.getElementById('travel-to-city').value;
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
            getPlaceDetails();
        });
    return {
        lat: upcomingTripDetails.latitude,
        lng: upcomingTripDetails.longitude
    }
}

function getRemainingDays () {
    upcomingTripDetails.departure =
        document.getElementById('new-travel-date').valueAsNumber;
    console.log('Entered date: ', upcomingTripDetails.departure);
    const daysToGo =
          Math.round((upcomingTripDetails.departure - new Date())/(1000*60*60*24));
    document.getElementById('days-to-go').innerHTML =
	`${daysToGo} days to go!`; 
}

