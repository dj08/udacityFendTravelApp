// This file does a lot of unconventional stuff -- invoke undefined
// Client library (defined later by webpack), import CSS, etc. All
// this can make eslint uncomfortable. Hence disabling.
import { getLocationCoordinates,
         getDateInput,
         getWeatherForecast} from './js/app.js';

// Need this to get async/await working with babel translation
import 'regenerator-runtime/runtime';

/* eslint-disable */
// import css
import './styles/style.scss';

// Need to install event handlers here, since they would not be
// visibile elsewhere due to webpack scoping. We use DOMContentLoaded
// to do this after the page has loaded, irrespective of how webpack
// handles js insertion in our HTML view.
document.addEventListener('DOMContentLoaded', () => {
    /* Here is how the app is expected to work:
       1. At start: only city & date fields are active.
          - 'Save Trip' button is inactive
       2. User enters the city.
       3. User enters the date. Reactions:
          - 'Save Trip' button is now active. Possibly some animation.
       4. User clicks the 'Save Trip' button. Reaction:
          - Coordinates query API fires off. It is slowest.
          - Image search shows loading sign.
	  - Image fetcher API fires and updates image.
          - Weather div updates to show that it is fetching weather
	  - Weather API fires off after coordinates are available.
	  - Save Trip API fires off to save trip to backend.
       4. All frontend data is reset when city changes.
    */
    const cityField = document.getElementById('travel-to-city');
    const dateField = document.getElementById('new-travel-date');
    const saveTripButton = document.getElementById('save-trip-button');
    
    saveTripButton.addEventListener('click', Client.getLocationCoordinates);

    dateInput.addEventListener('input', Client.getDateInput);
});
/* eslint-enable */

export {
    getLocationCoordinates,
    getDateInput,
    getWeatherForecast
};
