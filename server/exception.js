var err = function (code, message, next) {
  let err = new Error(message)
  err.statusCode = code;
  //It is like saying 'This is definitely an error, Go straight to error handling!'
  next(err)
}

var err400 = function (message, next) {
  err(400, message, next)
}

var err404 = function (message, next) {
  err(404, message, next)
}

module.exports = {
  err,
  err400,
  err404
}