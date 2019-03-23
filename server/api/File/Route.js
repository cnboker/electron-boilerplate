
module.exports = function (app) {
  var ctl = require("./Controller");
  var multer = require('multer')
  var fs = require('fs')
  var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let path = `./public/files`;
      if(!fs.existsSync(path)){
        fs.mkdirSync(path,);
      }
      cb(null,path)
    },
    filename: (req, file, cb) => {
      console.log('file',file)
      cb(null, Date.now().toString() + file.originalname)
    }
  })
  var upload = multer({storage}) 

  app.post("/api/fileUpload", upload.single('file'), ctl.fileUpload)
};