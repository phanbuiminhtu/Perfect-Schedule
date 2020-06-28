/*
mainWindow.js
backend code for the main Window
v4.5 ; 6/4/2020

Authors: Tu Phan, Giorgi Imnaishvili, Stefan Wagner
Dependencies: electron, main.js
*/


const electron = require("electron")
const {ipcRenderer} = electron;

ipcRenderer.on("NewSchedule",fillSchedule)


function handleSubmit1(e){
    event.preventDefault();
    ipcRenderer.send("openAddWindow");
}

function handleSubmit2(e){
    event.preventDefault();
    ipcRenderer.send("openFixedScheduleWindow");
}


var daySchedule = document.querySelector('#days');
daySchedule.addEventListener("click", createDict,false);

var TaskDelete = document.querySelector('#delete');
TaskDelete.addEventListener("click", SendDeleteTask,false);

var dateFormat;
var Schedule;
var x = document.getElementById("hidenDictionary").querySelectorAll("p"); // hour on schedule table
// send task need to be deleted to back end
function SendDeleteTask(e) {
    var TaskDeleteSelected = document.getElementById(e.target.value).innerHTML;
    var TaskDeleteInfo = TaskDeleteSelected.split(",");
    var nameOfDeleteTask = TaskDeleteInfo[0];
    var startOfDeleteTask = TaskDeleteInfo[1]
    ipcRenderer.send("taskDeleted",startOfDeleteTask,dateFormat);
}

//create dictionary key using date
function createDict(e) {
    var mon1 = document.getElementById("month").innerHTML;
    var year2 = document.getElementById("year").innerHTML;
    function monthNum(mon1){
        if (mon1=="January"){
                return 1;
            }
            else if (mon1=="February"){
                return 2;
            }
            else if (mon1=="March"){
                return 3;
            }
            else if (mon1=="April"){
                return 4;
            }
            else if (mon1=="May"){
                return 5;
            }
            else if (mon1=="June"){
                return 6;
            }
            else if (mon1=="July"){
                return 7;
            }
            else if (mon1=="August"){
                return 8;
            }
            else if (mon1=="September"){
                return 9;
            }
            else if (mon1=="October"){
                return 10;
            }
            else if (mon1=="November"){
                return 11;
            }
            else if (mon1=="December"){
                return 12;
            }

    }
    var monNum = monthNum(mon1).toString();
    var yearNum = year2.toString();
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
        var date = e.target.innerHTML + "/" + monNum + "/" + yearNum;
        document.getElementById("Date").innerHTML = "Date: "+ date;
        ipcRenderer.send("dateFormat",dateFormat);
        if (Schedule.hasOwnProperty(dateFormat) == false|| Schedule[dateFormat].length == 1){
            clear();
        }

        return dateFormat;
    }
    e.stopPropagation();
    
}
//clear the schedule table
function clear() {
    for (var i = 0; i < x.length; i++){
            x[i].innerHTML="";
        }
}
//fill the schedule table with the data from backend
function fillSchedule(e,schedule){
    
    Schedule = schedule;
    if (Schedule.hasOwnProperty(dateFormat) == false){
        clear();
    }
    else if (Schedule.hasOwnProperty(dateFormat)){
        clear();
        
        var tasks = Schedule[dateFormat]; // tasks will become a list of array, ex: [[name, start, end, status],[name,start,end,status],....]
        var numTask = 0;
        var minLength = 0.78;
        var hourLength = 47;
         
        
        
        while (numTask < tasks.length){
            hour = parseFloat(tasks[numTask][1].substr(0,2));
            
            var taskEnd = parseFloat(tasks[numTask][2].substr(0,2));
            var taskName = tasks[numTask][0];
            var minuteStart = parseFloat(tasks[numTask][1].substr(3,));
            var minuteEnd = parseFloat(tasks[numTask][2].substr(3,));
            var type = tasks[numTask][3];
            ipcRenderer.send("Test",taskName,hour,minuteStart,taskEnd, minuteEnd, numTask, type);
            var above;
            if (hour == 0){
                above = 45;
            }
            else{
                above = hour * hourLength + minuteStart * minLength;
            }
            
            var taskLength = ((taskEnd - hour) + (minuteEnd/60 - minuteStart/60)) * hourLength;
            taskDisplay(taskName, above, taskLength, numTask,type);
            if (hour == 0){
                x[0].innerHTML = tasks[numTask];
            }
            if (hour == 1){
                x[1].innerHTML = tasks[numTask];
            }
            if (hour == 2){
                x[2].innerHTML = tasks[numTask];
            }
            if (hour == 3){
                x[3].innerHTML = tasks[numTask];
            }
            if (hour == 4){
                x[4].innerHTML = tasks[numTask];
            }
            if (hour == 5){
                x[5].innerHTML = tasks[numTask];
            }
            if (hour == 6){
                x[6].innerHTML = tasks[numTask];
            }
            if (hour == 7){
                x[7].innerHTML = tasks[numTask];
                 
            }
            if (hour == 8){
                x[8].innerHTML = tasks[numTask];
                
            }
            if (hour == 9){
                x[9].innerHTML = tasks[numTask];
                   
            }
            if (hour == 10){
                x[10].innerHTML = tasks[numTask];
                   
            }
            if (hour == 11){
                x[11].innerHTML = tasks[numTask];
                   
            }
            if (hour == 12){
                x[12].innerHTML = tasks[numTask];
                   
            }
            if (hour == 13){
                x[13].innerHTML = tasks[numTask];
                   
            }
            if (hour == 14){
                x[14].innerHTML = tasks[numTask];
                   
            }
            if (hour == 15){
                x[15].innerHTML = tasks[numTask];
                   
            }
            if (hour == 16){
                x[16].innerHTML = tasks[numTask];
                   
            }
            if (hour == 17){
                x[17].innerHTML = tasks[numTask];
                 
            }
            if (hour == 18){
                x[18].innerHTML = tasks[numTask];
                 
            }
            if (hour == 19){
                x[19].innerHTML = tasks[numTask];
                 
            }
            if (hour == 20){
                x[20].innerHTML = tasks[numTask];
                 
            }
            if (hour == 21){
                x[21].innerHTML = tasks[numTask];
                 
            }
            if (hour == 22){
                x[22].innerHTML = tasks[numTask];
                 
            }
            if (hour == 23){
                x[23].innerHTML = tasks[numTask];
                 
            }
            if (hour == 24){
                x[24].innerHTML = tasks[numTask];
                 
            }
            numTask++;
        }
    }
}
//display task with different color and length based on duration and type
function taskDisplay(taskName,above,taskLength,numTask,type) {
    var ID = "task"+numTask.toString();
    var div = document.createElement("div");
    if (type == "exercise"){
        div.style.background = "green";
    }
    else if (type == "study"){
         div.style.background = "red";
    }
    else if (type == "work"){
        div.style.background = "blue";
    }
    else{
        div.style.background = "yellow";
    }
    div.setAttribute("id", ID);
    div.style.position = "absolute";
    div.style.width = "900px";
    div.style.height = taskLength.toString() +"px";
    div.style.top = above.toString()+"px";
    div.style.color = "white";
    div.innerHTML = taskName;
    document.getElementById("ShowTaskSchedule").appendChild(div);
}

