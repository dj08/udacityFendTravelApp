import { submitHandler, getLocationCoordinates } from './js/app.js';

// Need this to get async/await working with babel translation
import 'regenerator-runtime/runtime';

// import css
import './styles/style.scss';

// Need to install event handlers here, since they would not be
// visibile elsewhere due to webpack scoping. We use DOMContentLoaded
// to do this after the page has loaded, irrespective of how webpack
// handles js insertion in our HTML view.
document.addEventListener('DOMContentLoaded', _ => {
    const submitButton = document.getElementById('submit');
    submitButton.addEventListener('click', Client.getLocationCoordinates);
});

export {
    getLocationCoordinates
};
