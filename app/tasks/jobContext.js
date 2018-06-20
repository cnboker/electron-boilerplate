const puppeteer = require('puppeteer')
var jobAction = require('./jobAction')

const jobContext = {
    busy: false,
    tasks: [],
}

module.exports = jobContext;

jobContext.addTask = function (task) {
    this.tasks.push(task);
}

jobContext.popTask = function () {
    return this.tasks.shift();
}

jobContext.hasScanTask = function(){
    return this.tasks.filter(function(task){
        return task.action == jobAction.SCAN
    }).length > 0
}

jobContext.hasPolishTask = function(){
    return this.tasks.filter(function(task){
        return task.action == jobAction.Polish
    }).length > 0
}

jobContext.removeById = function(id){
    this.tasks = this.tasks.filter(function(task){
        return task._id != id
    });
}

jobContext.clean = function(){
    this.tasks = [];
}