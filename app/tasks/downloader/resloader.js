require('../../config')
var fetcher = require('./resFetcher')
var unrar = require('./unrar')
var path = require('path')

module.exports = function (callback) {
    var dest = path.join(process.env.Home,'puppeteer.zip');
    //var output = `${process.env.AppRoot}\\resources\\app.asar.unpacked\\node_modules`
    var output = path.join(process.env.Home,'puppeteer')
    var fs = require('fs');
    if (fs.existsSync(process.env.ChromePath)) {
        console.log('chrome.exe exist')
        // Do something
        if (callback) callback();
        return;
    }

    if (fs.existsSync(dest)) {
        console.log('puppeteer.zip exist', dest)
        unrar(dest, output, callback)
        return;
    }

    var fileUrl = `${process.env.REACT_APP_DOWNLOAD_URL}/download/puppeteer.zip`
    fetcher(fileUrl, dest, function (err) {
        if (err == undefined) {
            //unrar
            unrar(dest, output, callback)
        }
        //console.info(err)
    })
}