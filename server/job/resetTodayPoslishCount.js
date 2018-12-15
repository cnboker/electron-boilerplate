module.exports = function() {
  return new Promise((resolve, reject) => {
    doJob();
    resolve();
  });
};

function doJob(){
    
}