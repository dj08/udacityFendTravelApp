// Server side code for Weather Journal project.

// My project constants
const servePort = 8080;
let projectData = {}; // Object to hold API endpoint data

// Set up express server and sisters
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const os = require('os');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Server static webpage from website folder
app.use(express.static('../client'));

const server = app.listen(servePort, _ => {
    console.log(`Running on ${os.hostname().toLowerCase()}.local:${servePort}`);
});

app.get('/getData', (req, res) => {
    console.log(`Sending data: `, projectData);
    res.send(projectData);
});

app.post('/saveData', async (req, res) => {
    projectData = req.body;
    console.log(`Saved data: `, projectData);
});
