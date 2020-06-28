/*
database.js
communicates with the firebase databse
v2.3 ; 6/4/2020

Authors: Giorgi Imnaishvili
Dependencies: firebase-admin
*/


const firebase = require("firebase-admin");
var serviceAccount = require("./perfect-schedule-7f39d-firebase-adminsdk-31uhs-4749819df4.json");

//initializes the firabase api
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://perfect-schedule-7f39d.firebaseio.com"
});


var db = firebase.firestore();

//This function is responsible for adding tasks in the database
//It requires a schedule as an input
//schedule must be an object that contains every task in the schedule
//returns nothing
function addNewTask(schedule){
  //this is an array that will contain every task that we will add
  var dataToAdd = []

  //This loop is responsible for reading the schedule and formatting the data in a way that is easy to add to the databse
  //each task represents a day
  for (task in schedule){
    var tasks = {}
    tasks[task] = [];
    for (index = 0; index < schedule[task].length; index++){
      //checks if the coordinates and time slots are defined in the schedule
      if(schedule[task][index][5]==undefined || schedule[task][index][7]==undefined){
        continue;
      }  
      
      //each tasks[task] is an array that contains task data
      //this piece of code converts the array to an object
      tasks[task].push({
          task_name : schedule[task][index][0],
          start_time : schedule[task][index][1],
          end_time : schedule[task][index][2],
          task_type : schedule[task][index][3],
          isFixed : schedule[task][index][4],
          time_slot : schedule[task][index][5],
          location : schedule[task][index][6],
          coordinates : schedule[task][index][7],
        });

        
        //checks if time slots were specified by the user
        if(schedule[task][index][5]!="na" ){
          tasks[task][tasks[task].length-1].time_slot =  schedule[task][index][5][0];
        }

        //checks if location was provided by the user
        if(schedule[task][index][7]!="na" ){
          tasks[task][tasks[task].length-1].coordinates = {lng: schedule[task][index][7].lng, lat:schedule[task][index][7].lat};
        }

        

    }
    //adds the taks to an array that will be added to the databse
    dataToAdd.push(tasks);
  }

  //loops over the dates and adds the tasks to the databse one by one 
  for (index = 0; index < dataToAdd.length; index++){
    for(date in dataToAdd[index]){
      for(i=0; i<dataToAdd[index][date].length;i++){
        db.collection("users").doc("user1").collection(date).doc("task"+i).set(dataToAdd[index][date][i]);
      }

    }
  }

}

//This function retreives the whole schedule from the database and returns it
function getSchedule(){
  let schedule = {};
  
  //when this promise is done executing it will return the schedule
  return new Promise(function (resolve, reject){
    db.collection("users").doc("user1").listCollections().then(collections => {
      //Each collection represents a day
      collections.forEach(collection => {
        schedule[collection.id] = [];
        let index=0;
        collection.get().then(snapshot => {
          //each snapshot represents a task
          snapshot.forEach(doc => {
            schedule[collection.id][index]=[];
            schedule[collection.id][index].push(doc.data().task_name);
            schedule[collection.id][index].push(doc.data().start_time);
            schedule[collection.id][index].push(doc.data().end_time);
            schedule[collection.id][index].push(doc.data().task_type);
            schedule[collection.id][index].push(doc.data().isFixed);
            schedule[collection.id][index].push(doc.data().time_slot);
            schedule[collection.id][index].push(doc.data().location);
            schedule[collection.id][index].push(doc.data().coordinates);
            index++;
          });
        });
      });
    });
    //Wait for the client to retreive the whole schedule
    setTimeout(() => resolve(schedule), 8000)
  });
}


//This function is responsible for deleting tasks from the databse. 
//start_time is the time when the task is scheduled to start and date is the date of the task
// start_time needs to be a string in military time and date must be in the form of YEAR-MONTH-DAY
// example input: start_time="13:30", date="2020-04-09"
//this function returns nothing
function deleteTask(start_time, date){
  db.collection("users").doc("user1").collection(date).where("start_time","==",start_time).delete().then(data => {
    console.log("task deleted");
  });
}

//Exposing the database API
module.exports = {
  addNewTask,
  getSchedule,
  deleteTask
}
