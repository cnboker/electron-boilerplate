function initdb(cb) {
  const {
    exec
  } = require('child_process');
  exec('mongo ../data/scripts/create-db.js', function (err, stdout, stderr) {
    if (err) {
      console.log(`err:${err}`);
      return;
    }
    console.log(`stdout:${stdout}`);
    console.log(`stderr:${stderr}`);
    cb();
  });
}

module.exports = initdb;