var pageTaskJober = require('./pageTaskJob');
var gpageTaskJober = require('./gpageTaskJob');

async function execute(task) {

    if(process.env.engine == 'baidu'){
        pageTaskJober(task)
    }else if(process.env.engine == 'google'){
        gpageTaskJober(task)
    }
}