// Frontend javascript for Travel app

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

export async function getLocationCoordinates (ev) {
    const location = document.getElementById('city').value;
    fetch(coordQueryUrl(location, geonamesUser))
        .then(res => res.json())
        .then(res => {
            console.log("Received data: ", res);
            const place = res.postalCodes.shift();
            const city = place.placeName;
            const country = place.countryCode;
            document.getElementById('upcoming-trip-location').innerHTML =
                `${city}, ${country}`;
        });
}

// Create a new date instance dynamically with JS
const d = new Date();
const newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

const presentErr = console.log; // Error presentation function

// Method to post data to backend server
const postData = async (url = '', data = {}) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const newData = await response.json();
        console.log(newData);
        return newData
    } catch(error) {
        presentErr("Failed to save data: ", error);
        // appropriately handle the error
    } 
};

// Async GET function to query weather
const getWeather = async (owmUrl, zip, apiKey) => {
    const apiResponse = await fetch(owmUrl(zip, apiKey));
    try {
        const weather = await apiResponse.json();
        return weather;
    } catch (error) { presentErr(`Failed to get weather: ${error}`) }
};

// Need to update UI using vanilla JS as per rubric
const uiUpdateHelper = (id, data) =>
      document.getElementById(id).innerHTML = data; 

// Function to update UI after all else is done
const updateUi = async () => {
    const resp = await fetch('/getData');
    try {
        const savedData = await resp.json();
        uiUpdateHelper('date', savedData.date);
        uiUpdateHelper('temp', savedData.temperature);
        uiUpdateHelper('content', savedData.userFeelings);
    } catch (error) {
        presentErr(`Failed to update UI: ${error}`);
    }
};

// Event listener for the submit button
// export default enables us to import this in index.js without curly
// braces
export default function submitHandler (ev) {
    const zip = document.getElementById('zip').value;
    const feelings = document.getElementById('feelings').value;
    
    getWeather(owmApiUrl, zip, owmApiKey)
        .then(data => {
            postData('/saveData',
                     {zip: zip, userFeelings: feelings,
                      temperature: data.main.temp, date: newDate})
        })
        .then(res => updateUi()) // Apparently the res arg is needed
                                 // for requests to happen in right order.11
        .catch(error => presentErr(`Miscellaneous app error: ${error}`));   
}

