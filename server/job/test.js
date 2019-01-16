var mongoose = require("mongoose"); //.set('debug', true);
mongoose.Promise = require("bluebird");
mongoose.connect("mongodb://localhost/kwPolish");

var rewardJob = require("./rewardCodeCreatorJob");
var User = require("../api/User/Model");

rewardJob()
  .then(codes => {
    return [User.find({}), codes];
  })
  .spread((users, codes) => {
    return new Promise(async (resolve,reject)=>{
      await users.map(async doc => {
        var rc = codes.pop();
        rc.isUsed = true;
        doc.rewardCode = rc.code;
        Promise.all([
          rc.save(),
          doc.save()
        ]).then(()=>{
          console.log(doc)
        })
       
      });
      resolve();
    })
  })
  .then(() => {
    console.log('close.....')
    mongoose.disconnect();
  })
  .catch(e => {
    console.log("error", e);
    mongoose.disconnect();
  });
