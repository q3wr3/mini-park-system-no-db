const express = require('express');
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const port = 3000;

const PARKING = process.env.SIZE
let parkingSpots = {};

console.log(`Parking size set to ${PARKING}`)

app.get('/', (req, res) => {
    res.send('<h1>Parking API</h1>');
});

app.get('/park', (req, res) => {
    
});

app.get('/unpark', (req, res) => {
    
});

app.get('/info', (req, res) => {
    
});

app.listen(port, () => console.log(`Server on ${port}!`))