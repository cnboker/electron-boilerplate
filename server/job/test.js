var mongoose = require("mongoose"); //.set('debug', true);
mongoose.Promise = require("bluebird");
mongoose.connect("mongodb://localhost/kwPolish");

var rewardJob = require("./rewardCodeCreatorJob");
var User = require("../api/User/Model");

rewardJob()
  .then(codes => {
    return [User.find({}), codes];
  })
  .spread(async (users, codes) => {
    await users.map(async doc => {
      var rc = codes.pop();
      rc.isUsed = true;
      await rc.save();
      doc.rewardCode = rc.code;
      await doc.save();
      console.log(doc);
    });
  })
  .then(() => {
    console.log('close.....')
    mongoose.disconnect();
  })
  .catch(e => {
    console.log("error", e);
    mongoose.disconnect();
  });
