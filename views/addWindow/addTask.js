/*
addTask.js
backend code for the add task window
v2.7 ; 5/1/2020

Authors: Giorgi Imnaishvili, Tu Phan
Dependencies: electron, main.js
*/
const electron = require("electron")
const {ipcRenderer} = electron;

window.addEventListener('load',init);
function init(){
    const form = document.querySelector('form');
    form.addEventListener('submit',handleSubmit);
    
}

function handleSubmit(e){
    e.preventDefault();
    const nameField = document.querySelector("#taskName");
    const typeField = document.querySelector("#taskType");
    const taskDate = document.querySelector("#taskDate");
    const durationField = document.querySelector("#taskDuration");
    var duration = parseInt(durationField.value);
    const taskLocation = document.querySelector("#taskLocation")
    const taskPeriodStart = document.querySelector("#taskPeriodStart")
    const taskPeriodEnd = document.querySelector("#taskPeriodEnd")
    ipcRenderer.send('addNewTask',nameField.value,duration,typeField.value, taskDate.value, taskLocation.value, taskPeriodStart.value, taskPeriodEnd.value);
}