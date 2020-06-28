/*
crimeAPI.js
calculate crime score
v1.2 ; 5/20/2020

Author: Tu Phan
Dependency: node-fetch, main.js

*/


const fetch = require("node-fetch");
let url_link = "https://phl.carto.com/api/v2/sql?q=SELECT%20*%20FROM%20incidents_part1_part2%20WHERE%20dispatch_date_time%20%3E=%20%272020-02-02%27%20AND%20dispatch_date_time%20%3C%20%272020-05-01%27";


//create list of object containing crime data
async function CrimeAPIshow(lon,lat){
	const response = await fetch(url_link);
	const data = await response.json();
	var Row = data.rows;
	var crimeDict1 = Row.filter((item) => getDistanceFromLatLonInKm(lat,lon,item.point_y,item.point_x)<=0.5);
	return crimeDict1;
}
// calculate radius (distance of affective area)
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2-lat1);  // deg2rad below
	var dLon = deg2rad(lon2-lon1); 
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; // Distance in km
	return d;
}
//convert degree to radian
function deg2rad(deg) {
	return deg * (Math.PI/180)
}

//give hour a total score based on type of crimes happened
async function RankHour(lon,lat) {
	var crimeDict2 = await CrimeAPIshow(lon,lat);
	var crimeDict3 = new Map();
	var crimeDict4 = new Map();
	
	for (var i in crimeDict2){
		crimeDict3.set(crimeDict2[i].dispatch_time.substr(0,2),[])
	}
	for (var i in crimeDict2){
		crimeDict4.set(crimeDict2[i].dispatch_time.substr(0,2),[])
	}
	for (var i in crimeDict2){
		if (crimeDict3.has(crimeDict2[i].dispatch_time.substr(0,2))){
			var x = crimeDict2[i].dispatch_time.substr(0,2);
			crimeDict3.get(x).push(crimeDict2[i]);
			
		}
	}
	for (var i of crimeDict3.keys()){
		var score = 0;
		for (var y in crimeDict3.get(i)){
			//TO DO: put crime score in crimeDict4

			if (crimeDict3.get(i)[y].text_general_code.includes("Drug Law")){
				score +=3;
			}
			else if (crimeDict3.get(i)[y].text_general_code.includes("Aggravated Assault")){
				score +=6;
			}
			else if (crimeDict3.get(i)[y].text_general_code.includes("Rape")){
				score +=3;
			}
			else if (crimeDict3.get(i)[y].text_general_code.includes("Homicide")){
				score +=10;
			}
			else if (crimeDict3.get(i)[y].text_general_code.includes("Burglary")){
				score +=4;
			}
			else if (crimeDict3.get(i)[y].text_general_code.includes("Robbery")){
				score +=6;
			}
			else if (crimeDict3.get(i)[y].text_general_code.includes("Arson")){
				score +=3;
			}
			else if (crimeDict3.get(i)[y].text_general_code.includes("Theft")){
				score +=2;
			}
			else if (crimeDict3.get(i)[y].text_general_code.includes("Vandalism")){
				score +=4;
			}
			else if (crimeDict3.get(i)[y].text_general_code.includes("Sex Offense")){
				score +=3;
			}
			else if (crimeDict3.get(i)[y].text_general_code.includes("Weapon Violations")){
				score +=7;
			}
			else if (crimeDict3.get(i)[y].text_general_code.includes("counterfeiting")){
				score +=2;
			}
			else if (crimeDict3.get(i)[y].text_general_code.includes("Other Assault")){
				score +=3;
			}
			else if (crimeDict3.get(i)[y].text_general_code.includes("All Other Offenses")){
				score +=2;
			}
			if (crimeDict3.get(i)[y].text_general_code.includes("Firearm") && crimeDict3.get(i)[y].text_general_code.includes("No Firearm")==false){
				score +=3;
			}
		}
		crimeDict4.set(i,score)
	}
	return crimeDict4;
}



module.exports = {
	RankHour
}









