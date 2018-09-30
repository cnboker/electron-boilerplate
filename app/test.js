require('./config')
require('./auth')
var jobContext = require('./tasks/jobContext')
jobContext.puppeteer = require('puppeteer')

var jobAction = require('./tasks/jobAction')
var taskRouter = require('./tasks/taskRouter')
var taskItem = {
    doc: {
      userName: 'scott',
      engine: 'google',
      link: 'h3c.com',
      keyword: '软件定制',
      rank: 0,
    },
    action: jobAction.Polish,
    end: function (doc) {
      console.log(' execute doc rank', doc);
    },

  };
  taskRouter.execute(taskItem)