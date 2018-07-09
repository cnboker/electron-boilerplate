module.exports = function (rarFile, outputPath, finished) {
    console.log(rarFile)
    console.log(outputPath)
    var fs = require('fs')
    var unzip = require('unzipper')

    var extract = unzip.Extract({
        path: outputPath
    });
    fs.createReadStream(rarFile).pipe(extract);
    extract.on('error', function (err) {
        console.log(err)
        if (finished) finished(false);
    });
    extract.on('close', function () {
        console.log('zip success')
        if (finished) finished(true);
    })

}