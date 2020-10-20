const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: false }))
.use(express.json());
const dotenv = require("dotenv");
dotenv.config();
const port = 3000;

const PARKING = process.env.SIZE
let parkingSpots = {};

for (i = 1; i <= PARKING;i++){
	parkingSpots[i] = null;
}

console.log(`Parking size set to ${PARKING}`)

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}


function park(carID) {
	let notParked = true;
	/*check if inputed value is not a number*/
	if (isNaN(carID)) return({Error:{Code:001,Message:"Car ID must be a number value"}})
	
	/*check if carID already exist in object*/
	var exists = getKeyByValue(parkingSpots,carID)
	console.log(`isParked: ${exists}`)
	
	if (exists) {
		return({Info:`The car is parked on parking position ${exists}`})
		notParked = false;
	}
	/*get first free parking slot to park the car*/
	let firstFreeSlot = getKeyByValue(parkingSpots,null);

	console.log(`first available slot:`+firstFreeSlot);

	/*check if there are any free space in parkinglot*/
	if (firstFreeSlot != undefined) {
		parkingSpots[firstFreeSlot] = carID /*add the car to a slot*/
		return ({carID:carID, parkSpot:firstFreeSlot}); /*return the carID and the slot its in*/
	}else{
		return({Error:{Code:002,Message:"Sorry, no more free parking spots"}})/*returns an error message for no more space in parkinglot*/
	}
}

app.get('/', (req, res) => {
    res.send('<h1>Parking API</h1>');
});

app.post('/park', (req, res) => {
   	let carID = req.body.car
   	let carPark = park(carID)
   	if (typeof carPark === "object" && "Error" in carPark){
   		res.status(403).send(carPark)
   	}else{
   		console.log(JSON.stringify(carPark))
   		res.status(200).send(carPark);
   	}
});

app.get('/unpark', (req, res) => {
    
});

app.get('/info', (req, res) => {
    
});

app.listen(port, () => console.log(`Server on ${port}!`))