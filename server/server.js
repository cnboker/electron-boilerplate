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

var kwRoute = require('./api/routes/keywordRoutes');
kwRoute(app);

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port)

console.log('restfull api start...' + port)