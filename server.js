const express = require('express');
const app = express();
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10 // limit each IP to 10 requests per windowMs
});


app.use(express.urlencoded({ extended: false }))
.use(express.json()).use(limiter);


dotenv.config();
const port = 3000;

const PARKING = process.env.SIZE
let parkingSlots = {};

for (i = 1; i <= PARKING;i++){
	parkingSlots[i] = null;
}

console.log(`Parking size set to ${PARKING}`)

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}


function park(carID) {
	let notParked = true;
	/*check if inputed value is not a number*/
	if (isNaN(carID)) return({Error:{ErrorCode:101,Message:"Car ID must be a number value"}})
	
	/*check if carID already exist in object*/
	var exists = getKeyByValue(parkingSlots,carID)
	console.log(`isParked: ${exists}`)
	
	if (exists) {
		return({Info:`The car is parked on parking position ${exists}`})
		notParked = false;
	}
	/*get first free parking slot to park the car*/
	let firstFreeSlot = getKeyByValue(parkingSlots,null);

	console.log(`first available slot:`+firstFreeSlot);

	/*check if there are any free space in parkinglot*/
	if (firstFreeSlot != undefined) {
		parkingSlots[firstFreeSlot] = carID /*add the car to a slot*/
		return ({carID:carID, parkSpot:firstFreeSlot}); /*return the carID and the slot its in*/
	}else{
		return({Error:{ErrorCode:102,Message:"Sorry, no more free parking spots"}})/*returns an error message for no more space in parkinglot*/
	}
}

function unpark(parkSlot) {
	if (parkingSlots[parkSlot] != null){
		parkingSlots[parkSlot] = null;
		return({Info:{slot:parkSlot,status:"free"}})
	}else{
		return({Error:{ErrorCode:201,Message:"Parking slot was clear already"}})
	}
	
	
}


function fetchInfo(slot,carID){
	
	if (slot){
		if (parkingSlots[slot] != null){
			return({Info:{ParkingSlot:slot,Car:parkingSlots[slot]}})
		}else{
			return({Info:"The selected parking slot is empty"})
		}
	}else if(carID){
		let carSlot = getKeyByValue(parkingSlots,carID)
		if (carSlot){
			return({Info:{ParkingSlot:carSlot,Car:carID}})
		}else{
			return({Info:"The selected car is not parked here"})
		}
	}else{
		return({Error:{Code:301,Message:'Use slot:number or car:nubmer to get info'}})
	}
    	
}

app.get('/', (req, res) => {
    res.send('<h1>Parking API</h1>');
});

app.post('/park', (req, res) => {
   	let carID = req.body.car
   	let carPark = park(carID)
   	if ("Error" in carPark){
   		res.status(403).send(carPark.Error)
   	}else{
   		console.log(JSON.stringify(carPark))
   		res.status(200).send(carPark);
   	}
});

app.post('/unpark', (req, res) => {
	let parkSlot = req.body.slot
	let carUnpark = unpark(parkSlot)
	if ("Error" in carUnpark){
   		res.status(403).send(carUnpark.Error)
   	}else{
   		console.log(JSON.stringify(carUnpark))
   		res.status(200).send(carUnpark);
   	}
    
});

app.get('/info', (req, res) => {
	console.log(req.body.slot)
	console.log(req.body.car)
	let getInfo = fetchInfo(req.body.slot,req.body.car)

	if ("Error" in getInfo){
   		res.status(403).send(getInfo.Error)
   	}else{
   		console.log(JSON.stringify(getInfo))
   		res.status(200).send(getInfo);
   	}


});

app.listen(port, () => console.log(`Server on ${port}!`))