var express = require('express'),
app = express(),
port = process.env.PORT || 3001;
var Keyword = require('./api/models/keywordModel');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/keyword');


app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());

app.use(function(req, res, next) {
   // Website you wish to allow to connect
   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

   // Request methods you wish to allow
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
 
   // Request headers you wish to allow
   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
 
   // Set to true if you need the website to include cookies in the requests sent
   // to the API (e.g. in case you use sessions)
   res.setHeader('Access-Control-Allow-Credentials', true);
 

  
   // Pass to next layer of middleware
   next();

  // res.status(404).send({url: req.originalUrl + ' not found'});

  
});

app.get('/404', function(req, res){
  throw new NotFound;
});

app.get('/500', function(req, res){
  throw new Error('keyboard cat!');
});

var kwRoute = require('./api/routes/keywordRoutes');
kwRoute(app);



app.listen(port)

console.log('restfull api start...' + port)