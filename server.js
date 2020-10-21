const express = require('express');
const app = express();
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const Parking = require("./controller/parking");
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // limit each IP to 10 requests per windowMs
});
app.use(express.urlencoded({ extended: false }))
.use(express.json()).use(limiter);

dotenv.config();
const port = 3000;
const SIZE = process.env.SIZE
const parking = new Parking(SIZE);
console.log(`Parking size set to ${SIZE}`)



app.get('/', (req, res) => {
    res.send('<h1>Parking API</h1>');
});

app.post('/park', (req, res) => {
   	let carPark = parking.park(req.body.car)
   	response(carPark,res);
});

app.post('/unpark', (req, res) => {
	let carUnpark = parking.unpark(req.body.slot)
	response(carUnpark,res);
    
});

app.get('/info', (req, res) => {
	let getInfo = parking.info(req.body.slot,req.body.car)
	response(getInfo,res);


});


app.get('/structureTest', (req, res) => {

	console.log("-Park car with id 10 ")
	console.log(parking.park(10));			/*		First 10 		*/
	console.log("-Park car with id 20 ")
	console.log(parking.park(20));			/*		First 10 		*/
	console.log("-Park car with id 30 ")
	console.log(parking.park(30));			/*		First 10 		*/
	console.log("-Park car with id 40 ")
	console.log(parking.park(40));			/*		First 10 		*/
	console.log("-Park car with id 50 ")
	console.log(parking.park(50));			/*		First 10 		*/
	console.log("-Park car with id 1 ")
	console.log(parking.park(1));			/*		First 10 		*/
	console.log("-Park car with id 1320 ")
	console.log(parking.park(1320));		/*		First 10 		*/
	console.log("-Park car with id 140 ")
	console.log(parking.park(140));			/*		First 10 		*/
	console.log("-Park car with id 110 ")
	console.log(parking.park(110));			/*		First 10 		*/
	console.log("-Park car with id 120 ")
	console.log(parking.park(120));			/*		First 10 		*/
	console.log("-Park car with id 20 (DOUBLE)")
	console.log(parking.park(20));			/*		Double 20 		*/
	console.log("-Park car with id 200 (11th car on 10 slots...)")
	console.log(parking.park(200));			/*		11th car  		*/
	console.log("-Park car with string number")
	console.log(parking.park("200"));		/*		string number 			*/
	console.log("-Park car with string NaN")
	console.log(parking.park("test"));		/*		string number 			*/
	console.log("-Unpark slot 1")
	console.log(parking.unpark(1));			/*		unpark slot 1 	*/
	console.log("-Unpark slot 5")
	console.log(parking.unpark(5));			/*		unpark slot 5	*/
	console.log("-Park car with id 200")
	console.log(parking.park(200));			/*		park at slot 1	*/
	console.log("-Park car with id 201")
	console.log(parking.park(201));			/*		park at slot 5	*/
	console.log("-Unpark non existant slot")
	console.log(parking.unpark(11));		/*		unpark non existant slot	*/
	console.log("-Unpark with string number")
	console.log(parking.unpark("11"));		/*		unpark string	*/
	console.log("-Info for slot 1")
	console.log(parking.info(1))				/*	get info for slot 1		*/
	console.log("-Info for car with ID 200")
	console.log(parking.info(undefined,200))	/*	get info for car 200		*/
	console.log("-Info for car with ID 20")
	console.log(parking.info(undefined,20))		/*	get info for car 20		*/
	console.log("-Info for non existant slot")
	console.log(parking.info(11))				/*	get info for non existant slot		*/
	console.log("-Info for non existant car")
	console.log(parking.info(undefined,2000))	/*	get info for non existant car 		*/
	console.log("-Info for non existant car")
	console.log(parking.info("10"))	/*	get info with string input 		*/




	response({structureTest:`look at server console for full test log`},res);


});


app.get('/test', (req, res) => {
	if (req.query.park){
		parking.park(req.query.park);
	}

	if (req.query.unpark){
		parking.unpark(req.query.unpark);
	}
	let info = "";
	if (req.query.info){
		if (req.query.car) {
			info = parking.info(undefined,req.query.info);
		}
		
		if (req.query.slot) {
			info = parking.info(req.query.info);
		}
		

	}

	let str = "";

	for (const [key, value] of Object.entries(parking.allSlots)) {
		str += `<tr><td><span>SLOT ${key}</span> <span>${value}</span></td></tr>`
	}

	res.status(200).send(`<form enctype='application/json'>
  <input name='park' value='' placeholder='park' >
  <button type="submit">Park Slot</button>
</form>

<form enctype='application/json'>
  <input name='unpark' value='' placeholder='park'>
  <button type="submit">Unpark Slot</button>
</form>

<form enctype='application/json'>
  <input name='info' value='' placeholder='park'>
  <button type="submit" name="car" value="car">Info by car</button>
  <button type="submit" name="slot" value="slot">Info by slot</button>
</form>

<div> Info: ${JSON.stringify(info)}</div>

<table>${str}</table>`)


});

function response(data,res) {
	if ("Error" in data){
		console.log(JSON.stringify(data))
   		res.status(403).send(data)
   	}else{
   		console.log(JSON.stringify(data))
   		res.status(200).send(data);
   	}
}


app.listen(port, () => console.log(`Server on ${port}!`))