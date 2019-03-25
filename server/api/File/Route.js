
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
      cb(null, Date.now().toString() + '-' + file.originalname)
    }
  })
  var upload = multer({storage}) 
  var express = require('express');
  //app.post("/api/fileUpload", upload.single('file'), ctl.fileUpload)
  var fileRouter = express.Router();
  fileRouter.post('/', upload.single('file'), ctl.fileUpload)
  fileRouter.delete('/:id',(req,res)=>{
    console.log('file remove', req.params.id)
    fs.unlinkSync(`./public/files/${req.params.id}`)
  });

  app.use('/api/fileUpload',fileRouter)

};