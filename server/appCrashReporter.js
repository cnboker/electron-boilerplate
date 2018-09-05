module.exports = function(app) {
    var multer = require("multer");
    var fs = require('fs');
    var path = require('path');
    
    var miniDumpsPath = path.join(__dirname, 'app-crashes');
    let upload = multer({ dest: miniDumpsPath }).single("upload_file_minidump");
  
    app.post("/api/app-crash", upload, (req, res) => {
      req.body.filename = req.file.filename;
      const crashData = JSON.stringify(req.body);
      fs.writeFile(req.file.path + ".json", crashData, e => {
        if (e) {
          return console.error("cannot write" + e.message);
        }
        console.info("crash file write to file:\n\t" + crashData);
      });
      res.end();
    });
  
  };
  