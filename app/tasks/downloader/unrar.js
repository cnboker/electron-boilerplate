module.exports = function (rarFile, outputPath, finished) {
    var logger = require('../../logger')
    // var fs = require('fs')
    // var unzip = require('unzipper')

    // var extract = unzip.Extract({
    //     path: outputPath
    // });
    // fs.createReadStream(rarFile).pipe(extract);
    // extract.on('error', function (err) {
    //     logger.info('unzip err', err)
    //     if(fs.existsSync(rarFile)){
    //         fs.unlinkSync(rarFile);
    //     }
    //     if (finished) finished(false);
       
    // });
    // extract.on('close', function () {
    //     if (finished) finished(true);
    // })
    try{
        var AdmZip = require('adm-zip');
        var zip = new AdmZip(rarFile);
        zip.extractAllTo(outputPath, /*overwrite*/true);
        finished(true)
    }catch(e){
        logger.info('rar error',e)
        finished(false)
    }
    
}