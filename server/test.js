var pi = require('./job/perfomanceIndex')
var mongoose = require("mongoose"); //.set('debug', true);
mongoose.connect("mongodb://localhost/kwPolish");
pi().then(docs=>{
    console.log(docs);
});