/*
fixedSchedule.js
control the fixed schedule page
v2.1 ; 5/5/2020

Author: Tu Phan
Dependency: electron, main.js
*/



const electron = require("electron")
const {ipcRenderer} = electron;

window.addEventListener('load',init);
//open the window
function init(){
	const form = document.querySelector('form');
	form.addEventListener('submit',handleSubmit2);
	
}
//submit user's input to the main.js
function handleSubmit2(e){
	e.preventDefault();
	var WeekDays = [];
	const nameField = document.querySelector("#taskName");
	const taskStart = document.querySelector("#taskStart");
	const taskEnd = document.querySelector("#taskEnd");
	const taskLocation = document.querySelector("#taskLocation");
	const taskFrequency = document.querySelector("#taskFrequency");
	const taskFixedDates = document.querySelector("#datePicker");
	var Monday = document.querySelector("#monday");
	if (Monday.checked){
		WeekDays.push(Monday.value);
	}
	var Tuesday = document.querySelector("#tuesday");
	if (Tuesday.checked){
			WeekDays.push(Tuesday.value);
		}
	var Wednesday = document.querySelector("#wednesday");
	if (Wednesday.checked){
			WeekDays.push(Wednesday.value);
		}
	var Thursday = document.querySelector("#thursday");
	if (Thursday.checked){
			WeekDays.push(Thursday.value);
		}
	var Friday = document.querySelector("#friday");
	if (Friday.checked){
			WeekDays.push(Friday.value);
		}
	var Saturday = document.querySelector("#saturday");
	if (Saturday.checked){
			WeekDays.push(Saturday.value);
		}
	var Sunday = document.querySelector("#sunday");
	if (Sunday.checked){
			WeekDays.push(Sunday.value);
		}
			
	
	ipcRenderer.send('addFixedTask',nameField.value,taskStart.value,taskEnd.value,taskLocation.value,taskFrequency.value,WeekDays,taskFixedDates.value);
}





