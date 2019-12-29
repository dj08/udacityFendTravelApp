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
       1. At start: only city field is active. Date field is visibly inactive.
       2. User enters the city. Reaction: 
          - Weather div gets populated with request for dep date.
          - Date field is now available.
       3. User enters the date. Reaction:
          - Coordinates query API fires off. It is slowest.
          - Image search shows loading sign.
	  - Image fetcher API fires and updates image.
          - Weather div updates to show that it is fetching weather
	  - Weather API fires off after ensuring that coordinates are
       available.
       4. All data is reset when city changes
    */
    const cityField = document.getElementById('city');
    const dateField = document.getElementById('new-travel-date');
    
    submitButton.addEventListener('click', Client.getLocationCoordinates);

    const dateInput = 
    dateInput.addEventListener('input', Client.getDateInput);
});
/* eslint-enable */

export {
    getLocationCoordinates,
    getDateInput,
    getWeatherForecast
};
