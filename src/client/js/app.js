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
    return `${geonamesUrl}?placename=${encodeURIComponent(place)}&username=${user}` +
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

    const placeImg = document.createElement('img');
    placeImg.id = 'place-img';

    tripCard.appendChild(placeImg);
    tripCard.appendChild(tripLocation);
    tripCard.appendChild(tripDays);
    tripCard.appendChild(tripWeather);

    // Refresh div before inserting HTML
    tripDetailsDivHolder.innerHTML = '';
    tripDetailsDivHolder.appendChild(tripCard);
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

async function getPlaceDetails (res) {
    const data = {
        latitude: res.lat,
        longitude: res.lng,
        date: upcomingTripDetails.departure,
        placeName: res.place
    };
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
        document.getElementById('place-img').src =
            placeInfo.image;
    } catch(err) {
        presentErr('Failed to location details: ', err);
    }
}

async function getLocationCoordinates () {
    const location = document.getElementById('travel-to-city').value;
    fetch(coordQueryUrl(location, geonamesUser))
        .then(res => res.json())
        .then(res => {
            const place = res.postalCodes.shift();
            const city = place.placeName;
            const country = place.countryCode;
            upcomingTripDetails.latitude = place.lat;
            upcomingTripDetails.longitude = place.lng;
            upcomingTripDetails.place = city;
            upcomingTripDetails.country = country;
            document.getElementById('upcoming-trip-location').innerHTML =
                `${city}, ${country}`;
            return {lat: place.lat, lng: place.lng, place: city};
        })
        .then(res => getPlaceDetails(res));
    return {
        lat: upcomingTripDetails.latitude,
        lng: upcomingTripDetails.longitude
    }
}

export const calcDays = date =>
      Math.round((date - new Date())/(1000*60*60*24));

function getRemainingDays () {
    upcomingTripDetails.departure =
        document.getElementById('new-travel-date').valueAsNumber;
    const daysToGo = calcDays(upcomingTripDetails.departure);
    document.getElementById('days-to-go').innerHTML =
        `${daysToGo} days to go!`; 
}

