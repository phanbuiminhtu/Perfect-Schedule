/*
scheduler.js
contains all the functions required for creating the scheduling automatically
v3.3 ; 6/5/2020

Author: Stefan Wagner
Dependencies: database.js
*/


const database = require('./database');

global.preferences = {"work":[["11:00", "14:00"], ["15:00", "17:00"]],"study":[["10:00", "12:00"], ["16:00", "20:00"]], "exercise":[["08:00", "10:00"], ["13:00", "19:00"]], "other":[["16:00", "24:00"]]};

// gets schedule from database
database.getSchedule().then(response => {
    global.schedule = response;
  });;


// function that deletes task from schedule
// start_time needs to be a string in military time and date must be in the form of YEAR-MONTH-DAY
// example input: start_time="08:00", date="2020-06-05" 
// returns schedule
function deleteTask(start_time, date) {
	global.schedule
	for (const i in schedule[date]) {
		if (schedule[date][i][1] == start_time) {
			schedule[date].splice(i,1)
		}
	}
	return schedule
}


// saves Input from the add window as a global variable
// task_name=str, task_duration=int
// task_type is either "work", "exercise", "study" or "other"
// task_date is YEAR-MONTH-DAY
// task_location=str
// task_coordinates = array(int, int)
// period_start, period_end = dateString, example: "09:00"; "13:00"
function saveInput(task_name, task_duration, task_type, task_date, task_location, task_coordinates, period_start, period_end) {
	var name = task_name;
	var duration = parseFloat(task_duration);
  	var type = task_type;
  	var changeable = true; // true means that this is not a fixed task
  	var period_start = period_start; // string in the format of "8:00" or "19:00"
  	var period_end = period_end;

  	if (period_start!="" && period_end!="") { // if user assigns a preferred timeslot it is saved inside the task array
  		if (period_end == "0:00") {period_end = "24:00";}
  		if (period_start.length == 4) {period_start = "0" + period_start;} // timestrings need to be formated as "09:00" instead of "9:00"
  		if (period_end.length == 4) {period_end = "0" + period_end;}
  		
  		global.task = ([name, duration, type, changeable, [[period_start, period_end]], task_location, task_coordinates]) // example task: ["math prep", 3, "study", true, [["09:00", "12:00"], ["15:00", "20:00"]]]
  	}
  	else {
 		global.task = ([name, duration, type, changeable, "na", task_location, task_coordinates]) // if no preferred timeslot is ipputted or an invalid one the field gets replaced with "na"	
  	}
}


// saves input from fixedSchedule as a global variable
// nameField=str
// taskStart, taskEnd = dateString, example: "09:00"; "13:00"
// taskLocation=str, taskCoordinates=array(int,int)
// taskFrequency, taskWeekdays, taskFixedDays are lists of days, example: ["2020-03-06", "2020-03-08", "2020-03-09"]
function saveFixed(nameField, taskStart, taskEnd, taskLocation, taskCoordinates, taskFrequency, taskWeekdays, taskFixedDays) {
	var name = nameField;
	var start = taskStart; // string in the format of "8:00" or "19:00"
	var end = taskEnd;
	var location = taskLocation;
	var coordinates = taskCoordinates;
	var freq = taskFrequency;
	var weekdays = taskWeekdays;
	var fixedDays = taskFixedDays;
	global.task = ([name, start, end, "na", false, "na", location, coordinates]) 
}


// creates schedule
// dates = array(datestrings), example: ["2020-04-24", "2020-05-04"]
// returns an updated schedule and prints it in the console
function autoSchedule(dates) {
	for (const i in dates) {
		var [toDo, scheduled] = getSchedule(global.schedule, dates[i]) // splits already assigned tasks of specific day into fixed and changeable tasks
		if (task[3]==true) { // index 3 is indicator for whether or not task is changeable
			toDo.push(task)
			
		}
		else {
			scheduled.push(task)
		}
	  	schedule[dates[i]] = Scheduling(toDo, scheduled, preferences);
	  	schedule[dates[i]].unshift(["sleep", "00:00", "08:00", "sleep", true, "na", "na", "na"])
	  	if (schedule.hasOwnProperty(moveDate(dates[i], 1))==false) {
	  		schedule[moveDate(dates[i], 1)] = [["sleep", "00:00", "08:00", "sleep", true, "na", "na", "na"]]
	  	}
	  	schedule = sortDict(schedule)
	}
	console.log("---------------------")
	console.log("---------------------")
	console.log(schedule)
	console.log("---------------------")
	console.log("---------------------")

	return schedule;
}


// returns the fixed tasks and non-fixed tasks of a specific day from the schedule
// schedule = schedule dictionary created by previous calls of autoschedule
// day = YEAR-MONTH-DAY, example: "2020-02-21"
function getSchedule(schedule, day) {
	var task_list = [];
	var fixed_list = [];
	if (schedule.hasOwnProperty(day)) {
		for (const i in schedule[day]) {
			if (schedule[day][i][3]!="sleep") {
				if (schedule[day][i][4]==true) { // checks if task is changeable or not
					if (schedule[day][i][5]!="na") {
						task_list_info = [schedule[day][i][0],timeToDecimal(schedule[day][i][2])-timeToDecimal(schedule[day][i][1]),schedule[day][i][3],schedule[day][i][4],[schedule[day][i][5]], schedule[day][i][6], schedule[day][i][7]]
						// turns assigned format of ["math prep", "09:00", "12:00", "study", true, [["09:00", "12:00"]], location, coordinates] back into ["math prep", 3, "study", true, [["09:00", "12:00"]], location, coordinates]
					}
					else {
						task_list_info = [schedule[day][i][0],timeToDecimal(schedule[day][i][2])-timeToDecimal(schedule[day][i][1]),schedule[day][i][3],schedule[day][i][4],schedule[day][i][5], schedule[day][i][6], schedule[day][i][7]]
					}
					task_list.push(task_list_info) // pushes the changed format to new array
				}
				else {
					fixed_list.push(schedule[day][i])
				}
			}
		}
		
	}
	schedule[day] = [] // if no tasks have been scheduled for that day before, an empty array is created for the tasks
	
	return [task_list, fixed_list]
}


// returns timeintervals where Y doesn't overlap with X
// example input: (X=[["12:00", "14:00"], ["17:00", "20:00"]], Y=[["18:00","19:00"]], available=[], X_count=0, X_ind=0, y_count=0, y_ind=0)
// output from example: [["12:00", "14:00"], ["17:00", "18:00"], ["19:00", "20:00"]]
// available should always be [] and X_count, x_ind, y_count, y_ind should always be set to zero, they are only used for recursion
// available stores all the slots that don't overlap
// X_count and y_count indicate what index is being tested
// X_ind and y_ind indicate whether start or end time is used for comparisons
function not_overlapping(X, y, available, X_count, X_ind, y_count, y_ind) {

	// base case
	if (X.length == X_count) {
		return available.slice()
	}
	
	if (y.length == y_count) {
		if (X_ind == 1) {
			var ending_time = X[X_count][1];
			available[available.length-1].push(ending_time);
			var X_ind = 0;
		}
		else {
			available.push(X[X_count]);
		}
		X_count += 1;
		return not_overlapping(X, y, available, X_count, X_ind, y_count, y_ind)
	}
	if (X_ind == 0) {
		var X_time = timeToDecimal(X[X_count][0]);
		if (y_ind == 0) {
			var y_time = timeToDecimal(y[y_count][0]);
			if (X_time < y_time) {
				available.push([decimalToTime(X_time)]);
				var X_ind = 1;
				var y_ind = 0;
			}
			else {
				var X_ind = 0;
				var y_ind = 1;
			}
		}
		else {
			var y_time = timeToDecimal(y[y_count][1]);
			if (X_time < y_time) {
				var X_ind = 1;
			}
			else {
				y_count += 1;
				var y_ind = 0;
			}
		}
	}

	else {
		var X_time = timeToDecimal(X[X_count][1]);
		if (y_ind == 0) {
			var y_time = timeToDecimal(y[y_count][0]);
			if (X_time < y_time) {
				available[available.length-1].push(decimalToTime(X_time));
				X_count += 1;
				var X_ind = 0;
			}
			else {
				available[available.length-1].push(decimalToTime(y_time));
				var y_ind = 1;
			}
		}
		else {
			var y_time = timeToDecimal(y[y_count][1]);
			if (X_time < y_time) {
				X_count += 1;
				var X_ind = 0;
			}
			else {
				available.push([decimalToTime(y_time)]);
				y_count += 1;
				var y_ind = 0;
			}
		}
	}
	return not_overlapping(X, y, available, X_count, X_ind, y_count, y_ind)
}


// combines arrays of fixed and non-fixed tasks into one schedule array
// tasklist is array of non-fixed tasks
// fixed is array of fixed tasks
// preferences is dictionary of preferred timeslots based on tasktype
// returns the schedule for one specific day
function Scheduling(tasklist, fixed, preferences) {
	for (const i in tasklist) {
		if (tasklist[i][4] != "na") {
			tasklist[i].push("c");
			// if task has manually assinged preferred timeslots, "c" is pushed to array as an indicator
		}
		else {
			for (var key in preferences) {
				if (tasklist[i][2] == key) {
					tasklist[i][4] = preferences[key];
					tasklist[i].push("s"); // else the standard preferred timeslots are used from preferences dictionary and "s" is used as an indicator
				}
			}
		}
	}
	var splitted_tasks = split(tasklist);
	// orders tasks by tasktype and afterwards orders them by custom or preferred timeslots
	// meaning all tasks with custom timeslots are scheduled prior to the ones without, and assignment order is determined by task type

	for (i = 0; splitted_tasks.length != 0; i++) {
		var fixed = comparing(splitted_tasks[0], splitted_tasks, fixed); // assigns one task after another and creates schedule for day
		splitted_tasks.shift();
	}
	return fixed
}


// cycles through all the preference times of tasks that have yet to be assigned a time an checks what timeslot would be ideal
// task is one task array, like global.task in the save input function
// list is the list of tasks that have yet to be assigned a time
// scheduled is array of tasks that have already been scheduled
// schedules all tasks and returns it as one array together with tasks that have been scheduled previously
function comparing(task, list, scheduled) {

	var x = [["00:00", "08:00"]];
	for (const i in scheduled) {
		x.push([scheduled[i][1], scheduled[i][2]]);
	}
	x.sort();
	var y = not_overlapping([["00:00", "24:00"]], x, [], 0, 0, 0 ,0);

	if (inside(task, y) == false) {
		return scheduled
	}
	var y = not_overlapping(task[4], x, [], 0, 0, 0, 0);

	if (inside(task, y) == false) {
		var x = not_overlapping([["00:00", "24:00"]], x, [], 0, 0, 0, 0);
	}
	else {
		var x = y;
	}
	for (i in list.slice(1)) {
		var y = not_overlapping(x, list[i][4], [], 0, 0, 0, 0);
		var temp = inside(task, y);
		if (temp != false) {
			var x = temp;
		}
	}
	scheduled.push(assign(task, x));
	return scheduled
}


// assigns task inside a given timeinterval
// task = taskarray
// pos = array of possible timeslots, example: [["08:00", "11:00"], ["14:00", "22:00"]]
// returns scheduled task
function assign(task, pos) {
	var preferred_avg = (timeToDecimal(task[4][0][1]) - timeToDecimal(task[4][0][0]))/2;
	var pref_slot = pos[0];

	var pref_slot_avg = (timeToDecimal(pref_slot[1]) - timeToDecimal(pref_slot[0]))/2;
	var minimum = pref_slot_avg - preferred_avg;
	pos.shift();

	for (const i in pos) {
		var slot_avg = (timeToDecimal(pos[i][1]) - timeToDecimal(pos[i][0]))/2;
		var x = slot_avg - preferred_avg;
		if (Math.abs(x) < Math.abs(minimum)) {
			var pref_slot = pos[i];
			var minimum = x;
		}
	}
	if (minimum < 0) {
		var taskend = pref_slot[1];
		var taskstart = timeToDecimal(taskend) - task[1];
		var taskstart = decimalToTime(taskstart);
	}
	else {
		var taskstart = pref_slot[0];
		var taskend = timeToDecimal(taskstart) + task[1];
		var taskend = decimalToTime(taskend)
	}
	if (task[7] == "s") {
		return [task[0], taskstart, taskend, task[2], task[3], "na", task[5], task[6]]
	}
	else {
		return [task[0], taskstart, taskend, task[2], task[3], task[4][0], task[5], task[6]]
	}
}


// check if task could fit inside given timeslots
// task = taskarray
// slots = array of timeslots
// returns array of possible timslots, or false if none are possible
function inside(task, slots) {
	var pos = [];
	for (const i in slots) {
		if (task[1] <= timeToDecimal(slots[i][1]) - timeToDecimal(slots[i][0])) { // checks if duration of task is smaller than the time interval of the timeslot
			pos.push(slots[i])
		}
	}
	if (pos.length == 0) {
		return false
	}
	else {
		var x = pos.slice();
		x.sort();
		return x
	}
}


// sorts and splits the tasks based on task type and preference times
// tasks = array fo tasks
// returns fully ordered array of tasks 
function split(tasks) {
	var s = [];
	var w = [];
	var e = [];
	var o = [];
	for (i in tasks) { // it first splits tasks into different arrays based on task type
		if (tasks[i][2] == "study") {
			s.push(tasks[i]);
		}
		else if (tasks[i][2] == "work") {
			w.push(tasks[i]);
		}
		else if (tasks[i][2] == "exercise") {
			e.push(tasks[i]);
		}
		else if (tasks[i][2] == "other") {
			o.push(tasks[i]);
		}
	}
	var r = w.concat(s, e, o); // then concatenates them in order of importance
	return sort_tasks(r) // then moves all tasks with custom preference time to front of array
}


// sperates list of tasks based on preference time
// x = array of tasks
// returns tasks sorted based on preference times
function sort_tasks(x) {
	var custom = [];
	var assigned = [];
	for (const i in x) {
		if (x[i][7] == "c") { // checks if preference time is custom or not
			custom.push(x[i]);
		}
		else {
			assigned.push(x[i]);
		}
	}
	var sorted = custom.concat(assigned);
	return sorted
}


// sorts dictionary based on keys
// dict = dict
// returns sorted dictionary
function sortDict(dict) {
	var keys = Object.keys(dict)
	keys.sort()
	sorted_dict = {}
	for (const i in keys) {
		sorted_dict[keys[i]] = dict[keys[i]]
	}
	return sorted_dict
}


// moves date x number of days based on input dateString and days
// dateString = YEAR-MONTH-YEAR, example: "2020-09-11"
// days = int
// returns dateString of date that is x days away from input date
function moveDate(dateString, days) {
	var y = dateString.split("-")
	var year = parseInt(y[0])
	var month = parseInt(y[1]-1)
	var day = parseInt(y[2])
	var tomorrow = new Date(year,month,day)
	tomorrow.setDate(tomorrow.getDate()+ days)
	return tomorrow.toISOString().substr(0,10)
}


// finds dateStrings of all specific Weekdays for the next 4 weeks
// days = array of dayStrings, example: ["Monday", "Wednesday", "Thrusday"]
// returns array of dateStrings
function findWeekdays(days) {
	var tod_date = new Date()
	var tod_int = tod_date.getDay() // get numeric value of todays day
	var day_int = 0
	var dateStrings = []
	for (const i in days) {
		var a = tod_int
		if (days[i] == "Sunday") {
			day_int = 0
		}
		else if (days[i] == "Monday") {
			day_int = 1
		}
		else if (days[i] == "Tuesday") {
			day_int = 2
		}
		else if (days[i] == "Wednesday") {
			day_int = 3
		}
		else if (days[i] == "Thursday") {
			day_int = 4
		}
		else if (days[i] == "Friday") {
			day_int = 5
		}
		else if (days[i] == "Saturday") {
			day_int = 6
		}
		while (a%7 != day_int) { // check how many days the given days are away from todays date
			a += 1
		}
		var day = tod_date.toISOString().slice(0,10)
		var new_day = moveDate(day, a)
		for (k=0; k<4; k++) {
			dateStrings.push(moveDate(new_day, k*7)) // add day to list of dates for the next 4 weeks
		}
	}
	return dateStrings
}


// converts strings of time into decimals
// time_string = string of military time, example: "03:00"; "17:54"
// returns decimal value of timestring
function timeToDecimal(time_string) {
	var time = time_string.replace(":",""); //removes ":" and converts time to Int
	if (time.substring(0,1) == "0") {
		time = time.substring(1,4)
	}
	var hours_full = parseInt(time/100);
	var hours_decimal = (time%100)/60;
	var time = hours_full + hours_decimal;
	return time
}

//same as timeToDecimal, but vice versa
function decimalToTime(time_decimal) {
	var minutes = time_decimal*60;
	var hours = parseInt(minutes/60);
	var minutes = parseInt(minutes%60);
	if (hours < 10) {
		var hours = "0" + hours.toString() // adds 0 to front so that all timestrings have the same length
	}
	else {
		var hours = hours.toString()
	}
	if (minutes < 10) {
		var time_string = hours + ":" + "0" + minutes.toString();
	}
	else {
		var time_string = hours + ":" + minutes.toString();
	}
	return time_string
}


module.exports = {
    saveInput,
    saveFixed,
    autoSchedule,
	deleteTask,
	moveDate,
	findWeekdays
}
