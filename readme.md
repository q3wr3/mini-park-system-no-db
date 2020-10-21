# Back-End Parking API

Test API for parking management created with nodejs + express
The requests are limited to 10 requests per 10 seconds

### 1. Install

	npm install

### 2. Endpoints

#### /park

Accepts json formated post requests

example request:

	{car:123}

This endpoint checks if there is a car with id 123, checks if there is a free slot in the parkinglot and parks if there is no duplicate id and there is space.

example response:

	{Info:{The car with ID 123 is parked at slot ID 1}}

#### /unpark

Accepts json formated post requests

example request:

	{slot:1}

This endpoint removes the carid from a ocupied slot
example response:

	{Info:{The slot with ID 1 is now clear}}

#### /info 

This endpoint presents data for car/slot depending on the data sent

example request:

	{car:231} 
or

	{slot:4}

example response:

	{Info:{`The car with ID 231 is parked at slot with ID 4`}}



TODO: List all errors and responses.