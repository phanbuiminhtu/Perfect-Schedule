/*
main.js
runs backend code for the main Window
v5.4 ; 6/5/2020

Authors: Tu Phan, Giorgi Imnaishvili, Stefan Wagner
Dependencies: scheduler.js, database.js, crimeAPI.js, Geocode.js, electron
*/


//Electron Variables and Dependencies
const electron = require('electron');
const url = require('url');
const path = require('path');
const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const scheduler = require('./scheduler');
const database = require('./database');
const crimeAPI = require('./crimeAPI');
const Geocode = require("./GeocodeMapAPI")

//Different Windows
let mainWindow;
let addTaskWindow;
let fixedScheduleWindow;

//Communication between the windows
ipcMain.on("addNewTask", addNewTask)
ipcMain.on("openAddWindow",openAddWindow)
ipcMain.on("openFixedScheduleWindow",openFixedScheduleWindow)
ipcMain.on("dateFormat",dateFormat)
ipcMain.on("taskDeleted",DeleteTaskFromMain)
ipcMain.on("addFixedTask",addNewFixed)
ipcMain.on("Test",Test)
ipcMain.on("test2",test2)

//fires when the application is ready to render pages
app.on('ready', () => {
  mainWindow = new BrowserWindow({
      height: 600,
      width: 800,
      webPreferences: {
        nodeIntegration: true,

    }
  });

  //renders the main window page
  mainWindow.loadURL('file://' + __dirname + '/views/mainWindow/mainWindow.html');


  //retrieves the schedule from the databse
  database.getSchedule().then(response => {
    let schedule = response;
  });
});


// prints date in the console when date on calendar is clicked
function dateFormat(e,dateFormat){
	console.log("Date",dateFormat)
}


// adds a fixed task to the schedule and sends information to mainWindow.html
// nameField = string
// taskStart, taskEnd = timeString, example: "08:00"; "14:25"
// taskLocation = string
// taskFrequency is either "everday", "weekDay", or "fixedDays"
// taskWeekdays = none, or list of days, example: ["Tuesday", "Friday", "Saturday"]
// taskFixedDays = none, or string of dates, example: "2020-01-04, 2020-01-06, 2020-01-13, "
async function addNewFixed(e,nameField,taskStart,taskEnd,taskLocation,taskFrequency,taskWeekdays,taskFixedDays){
  var ListTaskLocation = taskLocation.split(" ");
  ListTaskLocation.pop();
  var FormatTaskLocation = ListTaskLocation.join("+");
  console.log("Task name:",nameField)
  console.log("Task Start:",taskStart)
  console.log("Task End:",taskEnd)
  FormatTaskLocation = FormatTaskLocation.slice(0,FormatTaskLocation.length-1);
  var url_link = "https://maps.googleapis.com/maps/api/geocode/json?address="+FormatTaskLocation+"&key=AIzaSyBQ77kYrrGw_NeVsmN6hn4UzfXNryHqHh4";
  var taskCoodinates = await Geocode.GeocodeAPIshow(url_link);
  //var CrimeScore = await crimeAPI.RankHour(taskCoodinates.lng,taskCoodinates.lat);
  console.log("Task location:",FormatTaskLocation)
  console.log("Task coodinates",taskCoodinates)
  console.log("Task Frequency:",taskFrequency)
  console.log("Task Weekdays:",taskWeekdays) // this is an array
  console.log("Task Fixed Days:",taskFixedDays) //this is a string, use split to create array if you need to

  scheduler.saveFixed(nameField, taskStart, taskEnd, taskLocation, taskCoodinates, taskFrequency, taskWeekdays, taskFixedDays)
  if (taskFrequency == "everday") {
    var task_date = scheduler.findWeekdays(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"])
  }
  else if (taskFrequency == "weekDay") {
    var task_date = scheduler.findWeekdays(taskWeekdays)
  }
  else {
    var task_date = taskFixedDays.split(",")
    for (const i in task_date) {
      task_date[i] = task_date[i].trim()
    }
    task_date.pop() // removes empty array that is appended during split operation
  }
  schedule = scheduler.autoSchedule(task_date);

  //add the task to the database
  database.addNewTask(schedule);

  //communication with the main window
  mainWindow.webContents.send("info:newTask", schedule);
  mainWindow.webContents.send("NewSchedule",schedule);
}


//This function is called when you click "Add Task" in the add task window
// adds task to schedule and sends information to mainWindow.html
// task_name = str, task_duration = int
// task_type is either "work", "study", "exercise" or "other"
// task_date = dateString, example: "2019-11-23"
// task_location = str
// period_start, period_end = timeString, example: "09:30"; "22:00"
async function addNewTask(e, task_name, task_duration, task_type, task_date, task_location, period_start, period_end){
  var ListTaskLocation = task_location.split(" ");
  var FormatTaskLocation = ListTaskLocation.join("+");
  FormatTaskLocation = FormatTaskLocation.slice(0,FormatTaskLocation.length-1);
  var url_link = "https://maps.googleapis.com/maps/api/geocode/json?address="+FormatTaskLocation+"&key=AIzaSyBQ77kYrrGw_NeVsmN6hn4UzfXNryHqHh4";
  var task_coordinates = await Geocode.GeocodeAPIshow(url_link);

  scheduler.saveInput(task_name,task_duration,task_type,task_date, task_location, task_coordinates, period_start, period_end);
  schedule = scheduler.autoSchedule([task_date]);

  //add the task to the database
  database.addNewTask(schedule);

  //communication with the main window
  mainWindow.webContents.send("info:newTask", schedule);
  mainWindow.webContents.send("NewSchedule",schedule);

}

//this function will access deletetask function in scheduler.js
function DeleteTaskFromMain(start_time, Date) {
  schedule = scheduler.deleteTask(start_time, Date);
  database.deleteTask(start_time, Date);
}
//This function is called when you click "Add Task" from the main window
function openAddWindow(e){
  //creates a new window
  addTaskWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true,

  }
  });

  //renders the add task page
  addTaskWindow.loadURL(url.format({
    pathname: __dirname + '/views/addWindow/addTaskPage.html',
    protocol:'file',
    slashes:true
  }));
  addTaskWindow.show();
}

//This function is called when you click "Upload" from the main window
function openFixedScheduleWindow(e) {
	fixedScheduleWindow = new BrowserWindow({
		height: 600,
		width: 800,
		webPreferences: {
			nodeIntegration: true,

	}
});
	fixedScheduleWindow.loadURL(url.format({
		pathname: __dirname + '/views/fixedScheduleWindow/fixedSchedule.html',
		protocol:'file',
		slashes:true
}));
 fixedScheduleWindow.show();
}


//Saves the date when calendar is clicked
function selectDate(selected_date) {
	global.date = selected_date;
}


//test area below this line

function Test(e,taskName,hour,minuteStart,taskEnd, minuteEnd, numTask) {
  console.log("task name:",taskName);
  console.log("task start:",hour);
  console.log("minute start:",minuteStart);
  console.log("task end:",taskEnd);
  console.log("minute end:",minuteEnd);
  console.log("num task:",numTask);
}

function test2(e,taskStart,taskEnd,above,taskLength) {
  console.log("task start:",taskStart);
  console.log("task end:",taskEnd);
  console.log("above",above);
  console.log("task length:",taskLength);
}

//test area above this line

