# Travel Planner App Project
This app implements a basic travel planner app. Given a destination to
travel to and a date, it shows a photograph of the place and the
weather forecast.

This was developed as a course requirement for Udacity's Frontend
Developer Nanodegree Program.

## Overview
The project goal is to create an asynchronous web app that uses
multiple Web Api chaining and user data to dynamically update the
UI.

The full rubric for the project is available [here](https://review.udacity.com/#!/rubrics/2669/view "Link to Udacity's Rubric for the project").

## Using the code
1. Start the app using the following command sequence:
```
git clone <repo link>
npm install
```
2. Register on Dark Sky and Pixabay for developer keys. Place them in
a .env file at the root of the project. **The app will not start if
this is not done.**
```
DARK_SKY_KEY=**********
PIXABAY_KEY=***-***-****
```
3. Depending on your need, start the app with one of the commands
   described in next section. The most basic command to start is `npm
   start`.
4. Visit https://localhost:3000 on a web-browser. This should load the
   app GUI.
5. Enter the destination you want to visit.
6. Enter the date you want to visit on.
7. Click 'Save Trip' button. It will show up the weather forecast and
a small image related to the destination. 

## Implementation Details
The app implements the full rubric. It uses:
1. Basic `express` server as a proxy for API requests.
2. `webpack-dev-server` and `nodemon` for development stage. Both can
   be invoked in parallel using `npm run start-dev`.
3. `webpack` with `node` for production build. The full build can be
   invoked using `npm start` command. It invokes the former utilities
   serially.
4. `jest` for testing. Both frontend `app.js` and backend `server.js`
   are tested in this. Tests can be invoked using `npm test` command. 

## Beyond Udacity's Basic Rubric
The code implements the following items beyond Udacity's basic rubric:
1. The entire code is follows `eslint:recommended` style. The linter
   is integrated into development webpack config (`webpack.dev.js`).
2. Implement `webpack-merge` to keep webpack configurations DRY.
3. `webpack-dev-server` is installed with proxy requests to `express
   js node` server. This helps by not having to hardcode full endpoint
   URLs in the frontend `fetch` requests. So,
   `fetch(http://localhost:3000/endPoint)` can simply be replaced with
   `fetch(/endPoint)`. This helps with more sustainable code. 

