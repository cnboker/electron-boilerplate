
function checkNetwork(callback) {
  var timer = setInterval(function() {
    require("dns").lookup("www.baidu.com", function(err) {
      if (err && err.code == "ENOTFOUND") {
        console.log("No connection");
      } else {
        console.log("Connected");
        clearInterval(timer)
        if(callback)callback();       
      }
    });
  }, 2000);
}


checkNetwork(function(){
  console.log('ooooooook')
})