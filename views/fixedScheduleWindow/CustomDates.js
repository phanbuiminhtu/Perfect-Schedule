/*
CustomDates.js
create string containing date as user click on the calendar
v1.1 ; 4/30/2020

Author: Tu Phan
Dependency: none
*/
var daySchedule = document.querySelector('#day');
daySchedule.addEventListener("click", createDateInput,false);

var datePick = document.getElementById("datePicker").value;
var dateFormat;
function createDateInput(e){
	var mon2 = document.getElementById("month").innerHTML;
	var year3 = document.getElementById("year").innerHTML;
	function monthNum(mon2){
		if (mon2=="January"){
				return 1;
			}
			else if (mon2=="February"){
				return 2;
			}
			else if (mon2=="March"){
				return 3;
			}
			else if (mon2=="April"){
				return 4;
			}
			else if (mon2=="May"){
				return 5;
			}
			else if (mon2=="June"){
				return 6;
			}
			else if (mon2=="July"){
				return 7;
			}
			else if (mon2=="August"){
				return 8;
			}
			else if (mon2=="September"){
				return 9;
			}
			else if (mon2=="October"){
				return 10;
			}
			else if (mon2=="November"){
				return 11;
			}
			else if (mon2=="December"){
				return 12;
			}

	}
	var monNum = monthNum(mon2).toString();
	var yearNum = year3.toString();
	if (e.target !== e.currentTarget){
		if (monNum.length < 2){
			var day = e.target.innerHTML;
			if (day.length < 2){
				dateFormat = yearNum +'-'+"0"+monNum+'-'+"0"+ day;
			}
			else{
				dateFormat = yearNum +'-'+"0"+monNum+'-'+ day;
			}
		}else{
			if (day.length < 2){
				dateFormat = yearNum +'-'+monNum+'-'+"0"+day;
			}
			else{
				dateFormat = yearNum +'-'+monNum+'-'+ day;
		}}
		
		datePick += dateFormat + ", ";
		if (datePick.length > document.getElementById("datePicker").size){
			document.getElementById("datePicker").size += 12;
		}
		document.getElementById("datePicker").value = datePick;
		ipcRenderer.send("dateInput",datePick);
		
		return datePick;
	}
	e.stopPropagation();

}
