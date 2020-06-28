/*
calculateCalendarCopy.js
create the Calendar for user to pick
v1.1 ; 4/24/2020

Author: Tu Phan
Dependency: none
*/

var y, yc, m, mc, cc, lyc, d, row, colum, n, ndm;
y=2020;
m=1
// controll the previus button
function prevMonth(){
	m = m - 1;
	if (m<1){
		m=12;
		y=y-1;
	}
	document.getElementById("month").innerHTML = MonthYear(m);
	document.getElementById("year").innerHTML = y;
	day();
}
//control the next button
function nextMonth(){
	console.log("next month");
	m = m + 1;
	if (m>12){
		m=1;
		y=y+1;
	}
	document.getElementById("month").innerHTML = MonthYear(m);
	document.getElementById("year").innerHTML = y;
	day();
}
//turn integer to Months
function MonthYear(m){
	if (m==1){
		return "January";
	}
	else if (m==2){
		return "February";
	}
	else if (m==3){
		return "March";
	}
	else if (m==4){
		return "April";
	}
	else if (m==5){
		return "May";
	}
	else if (m==6){
		return "June";
	}
	else if (m==7){
		return "July";
	}
	else if (m==8){
		return "August";
	}
	else if (m==9){
		return "September";
	}
	else if (m==10){
		return "October";
	}
	else if (m==11){
		return "November";
	}
	else if (m==12){
		return "December";
	}
}
//calculate year code
function year(y) {
	yc = ((Math.floor((y % 100) / 4) + (y % 100)) % 7);	
	console.log("year code",yc)
	return yc;
}
//assign month code
function month(m) {
	if (m == 1 || m == 10) {
		mc = 0;
	}
	else if (m == 2||m == 3||m == 11) {
		mc = 3;
	}
	else if (m == 4|| m == 7) {
		mc = 6;
	}
	else if (m == 5) {
		mc = 1;
	}
	else if (m == 6) {
		mc = 4;
	}
	else if (m == 8) {
		mc = 2;
	}
	else if (m == 9||m == 12) {
		mc = 5;
	}
	return mc;
}
//calculate century code
function century(m,y) {
	if (y < 1753 && m < 3) {
		cc = ((18 - (y / 100)) % 7)
	}
	else {
		if (Math.floor(y / 100) % 4 == 1) {
			cc = 4;
		}
		else if (Math.floor(y / 100) % 4 == 2) {
			cc = 2;
		}
		else if (Math.floor(y / 100) % 4 == 3) {
			cc = 0;
		}
		else if (Math.floor(y / 100) % 4 == 0) {
			cc = 6;
		}
	}
	console.log("century code",cc)
	return cc;
}
// calculate leap year code. Check for leap year
function LeapYear(m,y) {
	if (y < 1753 && m < 3) {
		if ((y % 4) == 0) {
			lyc = 1;
		}
	}
	else {
		if ((y % 400) == 0) {
			lyc = 1;
		}
		else if ((y % 4) == 0 && (y != 100)) {
			lyc = 1;
		}
		else {
			lyc = 0;
		}
	}
	return lyc;
}
//calculate what day in a week of the first day of the month 
function day() {
	var firstday = 0;
	var x = document.getElementById("days").querySelectorAll("button");
	for (var i = 0; i < x.length; i++){
		x[i].innerHTML="";
	}
	yc = year(y);
	mc = month(m);
	cc = century(m,y);
	lyc = LeapYear(m,y);
	if (m==2){
		d = ((yc + mc + cc + 1 - lyc) % 7);
	}else{
		d = ((yc + mc + cc + 1) % 7);
	}
	console.log('d value', yc, mc, cc, lyc, d); 
	console.log('value of x', x.length); 
	if (d == 0) {
		firstday = 6;
		console.log('Innher html 0', x[firstday]);
		x[firstday].innerHTML="1";
	}
	else if (d == 1) {
		firstday = 0;
		console.log('Innher html 0', x[firstday]);
		x[firstday].innerHTML="1";
		}
	else if (d == 2) {
		firstday = 1;
		console.log('Innher html 0', x[firstday]);
		x[firstday].innerHTML="1";
		}
	else if (d == 3) {
		firstday = 2;
		console.log('Innher html 0', x[firstday]);
		x[firstday].innerHTML="1";
		}
	else if (d == 4) {
		firstday = 3;
		console.log('Innher html 0', x[firstday]);
		x[firstday].innerHTML="1";
			}
	else if (d == 5) {
		firstday = 4;
		console.log('Innher html 0', x[firstday]);
		x[firstday].innerHTML="1";
		}
	else if (d == 6) {
		firstday = 5;
		console.log('Innher html 0', x[firstday]);
		x[firstday].innerHTML="1";
	} 
	calendar();
		//fill the rest of the day in the calendar 
		function calendar() {
		if (lyc == 1 && m == 2) {
			ndm = 29;
			console.log("number of day",ndm)
		}
		else if (lyc == 0 && m == 2) {
			ndm = 28;
			console.log("number of day",ndm)
		}
		else if (m == 1||m == 3||m == 5||m == 7||m == 8||m == 10||m == 12) {
			ndm = 31;
			console.log("number of day",ndm)
		}
		else if (m == 4||m == 6||m == 9||m == 11) {
			ndm = 30;
			console.log("number of day",ndm)
		}
		var n = 0;
		var date = 1
		while (true){
			n=n+1;
			date = date + 1
			var nextDay = firstday + n
			if (date>ndm){
				break
			}
			x[nextDay].innerHTML = date;
			
		}
	}
}
