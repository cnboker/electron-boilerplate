request = require('request');
var fs = require('fs');

var download = function (url, dest, success,error) {
    var file = fs.createWriteStream(dest);
    request.head(url, function(err, res, body) {

        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);
    
        var r = request(url).pipe(file);
        r.on('close', success);
        r.on('error', error);
      });

    // var request = http.get(url, function (response) {
    //     response.pipe(file);

    //     response.on('end', () => {
    //         console.log('response end');
    //     });
    //     console.log('response.statusCode', response.statusCode)
    //     console.log('content-length:', response.headers['content-length']);
    //     if (response.statusCode < 200 || response.statusCode >= 300) {
    //         // if (cb) cb('download failure');            
    //     }

    //     file.on('finish', function () {
    //         console.log('file finish');
    //         file.close(); // close() is async, call cb after close completes.
    //         // console.log('response', response)
    //         if (cb) cb();
    //     });
    // }).on('error', function (err) { // Handle errors
    //     console.log('response error');
    //     file.close();
    //     fs.unlink(dest); // Delete the file async. (But we don't check the result)
    //     if (cb) cb('download failure');
    // });
}
module.exports = download;