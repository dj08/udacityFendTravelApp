// Module to handle Pixabay API requests
const fetch = require('node-fetch');

const pixabayUrl = 'https://pixabay.com/api/?category=places&key=';
const pixabayQueryUrl = (term, key) =>
      `${pixabayUrl}${key}&q=${encodeURIComponent(term)}` +
      '&image_type=photo';

const getImage = async (placeName, key) => {
    const pixabayResponse =
	  await fetch(pixabayQueryUrl(placeName, key))
	  .then(res => res.json())
	  .catch(err => {
	      console.log('Error in getting location image: ', err);
	  });

    return pixabayResponse.hits[0].previewURL;
}

module.exports = { getImage };

