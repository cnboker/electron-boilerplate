const puppeteer = require('puppeteer')
var jobAction = require('./jobAction')
var schedule = require('node-schedule');
var pageTaskJob = require('./pageTaskJob')

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

jobContext.hasScanTask = function () {
    this.scanTasks().length > 0
}

jobContext.scanTasks = function(){
    return this.tasks.filter(function (task) {
        return task.action == jobAction.SCAN
    });
}

// jobContext.hasPolishTask = function () {
//     return this.tasks.filter(function (task) {
//         return task.action == jobAction.Polish
//     }).length > 0
// }

jobContext.removeById = function (id) {
    this.tasks = this.tasks.filter(function (task) {
        return task.doc._id != id
    });
}

jobContext.dirty = function(id){
    var tasks = this.tasks.filter(function(item){
        return task.doc._id == id
    });
    if(tasks.length > 0){
        tasks[0].state = 'dirty'
    }
}

jobContext.clean = function () {
    for(var item in this.tasks){
        item.state = 'dirty'
    }
}

//做擦亮任务计划
// jobContext.schedule = function () {
//     for (var i = this.tasks.length - 1; i >= 0; i -= 1) {
//         var task = this.tasks[i]
//         if (task.action == jobAction.SCAN) continue;
//         var date = new Date(task.doc.runTime);
//         schedule.scheduleJob(date, function () {
//             console.log('schedule time', Date.now().toDateString())
//             if (jobContext.busy) return;
//             pageTaskJob.execute(task)
//         })
//         this.tasks.splice(i,1); //remove task
//     }
// }