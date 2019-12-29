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
    const submitButton = document.getElementById('submit');
    submitButton.addEventListener('click', Client.getLocationCoordinates);

    const dateInput = document.getElementById('new-travel-date');
    dateInput.addEventListener('input', Client.getDateInput);
});

export {
    getLocationCoordinates,
    getDateInput,
    getWeatherForecast
};
/* eslint-enable */
