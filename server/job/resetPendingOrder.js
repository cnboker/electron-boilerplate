var QRPay = require("../api/QRPay/Model");

module.exports = function() {
  console.log("reset pending order...");
  return new Promise((resolve, reject) => {
    QRPay.deleteMany({ status: 0 })
      .then(result => {
        resolve(result);
      })
      .catch(e => {
        reject(e);
      });
  });
};
