/*
GeocodeMapAPI.js
return coordinate of location and time travel
v1.2 ; 5/20/2020

Author: Tu Phan
Dependency: node-fetch, main.js

*/

const fetch = require("node-fetch");
let url_link = "http://dev.virtualearth.net/REST/V1/Routes?wp.0=37.779160067439079,-122.42004945874214&wp.1=32.715685218572617,-117.16172486543655&key=Ajoo8irnvrdi7sneolgQKkiUn-mjCIq4LykD4mRTry01qFycgQlY2smIEsaf0HdY"
/*
Create the url link as the following format (the example is above):

http://dev.virtualearth.net/REST/V1/Routes?wp.0=FIRST_LOCATION_LATITUDE,FIRST_LOCATION_LONGTITUDE&wp.1=SECOND_LOCATION_LATITUDE,SECOND_LOCATION_LONGTITUDE&key=Ajoo8irnvrdi7sneolgQKkiUn-mjCIq4LykD4mRTry01qFycgQlY2smIEsaf0HdY

This url_link is for CalculateTimeTravel function.

*/

// this will return the latitude and longtitude of the task's location
async function GeocodeAPIshow(url_link){
	const response = await fetch(url_link);
	const data = await response.json();
	var longlat = data.results[0].geometry.location;
	return longlat; 
}

// it will return time travel in second
async function CalculateTimeTravel(url_link){
	const response = await fetch(url_link);
	const data = await response.json();
	var travelTime = data.resourceSets[0].resources[0].travelDurationTraffic;
	return travelTime; 
}


module.exports = {
	GeocodeAPIshow,
	CalculateTimeTravel
}
