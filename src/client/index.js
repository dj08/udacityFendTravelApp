import submitHandler from './js/app.js';

// Need to install event handlers here, since they would not be
// visibile elsewhere due to webpack scoping. We use DOMContentLoaded
// to do this after the page has loaded, irrespective of how webpack
// handles js insertion in our HTML view.
document.addEventListener('DOMContentLoaded', _ => {
    const submitButton = document.getElementById('submit');
    submitButton.addEventListener('click', submitHandler);
});

