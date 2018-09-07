var pageTaskJober = require('./pageTaskJob');
var gpageTaskJober = require('./gpageTaskJob');
const auth = require('../auth')

module.exports.execute =  async function execute(task) {
    console.log(' auth.getToken()',  auth.getToken())
    var engine = auth.getToken().engine || 'baidu';
    if(engine == 'baidu'){
        console.log('execute baidu engine...')
        pageTaskJober.execute(task)
    }else if(engine == 'google'){
        gpageTaskJober.execute(task)
    }
}