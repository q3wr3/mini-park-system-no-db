class Parking {
	
	constructor(size){
		this.size = size;
		this.slots = this.initSlots({},size); //init the slots 
	}

	park(car){
		if (isNaN(car)) return({Error:`Only car ID (numbers) are acceptable.`}); //check if the input is not a number and send error message if it is
		let free = this.freeSlot(); //get the first empty slot if has any
		if (!this.getSlotByCar(car)){ 
			if (free){ // if the same carID is not present in the parkinglot
				this.slots[free] = car; //park the car
				return({Info:`Car number ${car} is parked at slot ${free}`});
			}else{
				return({Error:`Sorry no more free slots for parking.`});
			}
			
		}else{
			return({Error:`Car is already parked.`});
		}
		
	}

	unpark(slot){
		if (isNaN(slot)) return({Error:`Only slot ID (number) is acceptable.`}); //check if the input is not a number and send error message if it is
		if (this.slots[slot] != null){ //check if given slot ID is populated
			this.slots[slot] = null	//free up the parking slot
			return({Info:`Parking spot ${slot} is free`}); 
		}else{
			if (parseInt(slot) > parseInt(this.size)){ //check if requested spot is higher than the parking limit
				return({Error:`The parking size is ${this.size} slots`});
			}else{
				return({Error:`Parking spot has no parked car`});
			}
		}
	}


	info(slot,car){
		let ID = slot || car || false //Gets the ID of car/slot or false if none provided
		if (isNaN(ID)) return({Error:`Only slot ID or car ID are acceptable.`});
		if (ID) {
			let key = slot ? "slot" : "car"; //sets the key for further filtering of the results 
			if (this.getSlotByCar(ID) && key=="car"){ //comparing if the car is parked in a spot 
				return({Info:`The car with ID ${ID} is parked at slot ID ${this.getSlotByCar(ID)}`})
			}else if (this.slots[ID]  && key=="slot"){//comparing if the spot is occupied by a car
				return({Info:`The car with ID ${this.slots[ID]} is parked at slot ID ${ID}`}) 
			}else{ //if there is no such car/spot relationship or if requested spot is higher than the parking limit
				
				let slotMessage = key == "slot" && (parseInt(ID) > parseInt(this.size)) ? `The parking size is ${this.size} slots` : `The parking slot ${ID} is empty`
				this.message = key === "slot" ? slotMessage : `There is no car with ID ${ID} at the parking lot`;
				return ({Info:this.message});
			}
		}else{
			return({Error:{Code:301,Message:'Use slot:number or car:nubmer to get info'}})
		}
	}
	


	getSlotByCar(car){ //finds the slot ID by searching for the car ID
		return Object.keys(this.slots).find(key => this.slots[key] === car);
	}

	initSlots(obj,max){ //Creates the slots object with all free slots
		for (let i = 1; i <= max;i++){
			obj[i] = null;
		}
		return obj;
	}

	freeSlot(){ //Gets the first free slot in the parking
		return Object.keys(this.slots).find(key => this.slots[key] === null);
	}

	get allSlots(){
		return this.slots;
	}

}


module.exports = Parking;