# Weather-Journal App Project
Developed as a course requirement for Udacity's Frontend Developer Nanodegree Program.

## Overview
The project goal is to create an asynchronous web app that uses Web
API and user data to dynamically update the UI. The targeted API here
is OpenWeatherMap. The UI update element is to dynamically show
weather at a given zip code.

The full rubric for the project is available [here](https://review.udacity.com/#!/rubrics/2655/view "Link to Udacity's Rubric for the project").

Here is what I boiled down from the rubric:
+ [X] Install a backend server using Node/Express.
  + [X] Echo server feedback on command line.
  + [X] Use the OpenWeatherMap API
+ [ ] Server code has:
  + [ ] `projectData` object. This acts as API endpoint.
  + [ ] OpenWeatherMap API key
 + [ ] `GET` route
 + [ ] `POST` route
+ [ ] Client side has:
  + [ ] `async` function/`Promise` to fetch endpoint from server
  + [ ] `async` function/`Promise` to post data to server
+ [ ] UI Code:
  + [ ] Follows the [template HTML from Udacity's repository](https://raw.githubusercontent.com/udacity/fend/refresh-2019/projects/weather-journal-app/website/index.html)
  + [ ] Adds event listeners to initiate API request and dynamically
        update UI.

## Usage:
+ Start server using node: `node server.js`
+ Visit https://localhost:8080 on a web-browser
+ Enter Zip code of the place you want to get weather information for
+ Enter how you are feeling in the following box
+ Click "Generate" button to get weather information
+ Your most recent entry would be echoed in the field at the bottom of
  the page.
