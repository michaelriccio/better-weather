const weatherJournal = []; // Setup empty JS object to act as endpoint for '/all' route

const express = require('express');// Express to run server and routes
const app = express();// Start up an instance of app

const bodyParser = require('body-parser');/* Dependencies */
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const cors = require('cors');/* Middleware*/
app.use(cors());

app.use(express.static('public'));// Initialize the main project folder

// Callback to debug

// Initialize all route with a callback function
// Callback function to complete GET '/all'
app.get('/all', (request, response) => {
    response.send(weatherJournal);
});

// Post Route
app.post('/post', (request, response) => {
    console.log(request.body);
    let data = request.body;
    weatherJournal.push(data);
    response.json({status: 'post is successful'});
});

// Spin up the server
const port = 3000;
app.listen(port, () => {console.log(`using localhost:${port}`);});