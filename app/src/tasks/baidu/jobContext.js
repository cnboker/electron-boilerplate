const puppeteer = require('puppeteer')

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