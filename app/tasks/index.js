const EventEmitter = require('events');
var emitter = new EventEmitter();

emitter.on('downloadComplete',function(){
    console.log('test')
})
emitter.emit('downloadComplete')