require('../../config')
var fetcher = require('./resFetcher')
var unrar = require('./unrar')
var path = require('path')
var logger = require('../../logger')
var fs = require('fs');
const ipc = require("../../ipc/ipcBus");

module.exports = function (callback) {
    var dest = path.join(process.env.AppHome, 'puppeteer.zip');

    var output = path.join(process.env.ApplicationPath, 'resources');
    
    if (fs.existsSync(path.join(output,'node_modules'))) {
        //logger.info('chrome.exe exist')
        ipc.sendToFront("message", "后台程序准备就绪");
        // Do something
        if (callback) callback(true);
        return;
    }

    //下载锁问题
    var lockFile = path.join(process.env.AppHome, 'download.lock');
    console.log('lockFile', lockFile)
    if (fs.existsSync(lockFile)) {
        logger.info('puppeteer.zip exist, but crack, retry download')
        fs.unlinkSync(lockFile)
        if (fs.existsSync(dest)) {
            fs.unlinkSync(dest)
        }
        if (callback) callback(false)
        return;
    }
    if (fs.existsSync(dest)) {
        logger.info('puppeteer.zip exist', dest)

        unrar(dest, output, function (success) {
            var result = fs.existsSync(path.join(output,'node_modules'));
            if (callback) callback(result);
        })
        return;
    }

    var fileUrl = `${process.env.REACT_APP_DOWNLOAD_URL}/download/puppeteer.zip`

    fs.writeFileSync(lockFile, '1', function (err) {
        if (err) {
            logger.info('lock file create failure', err)
        }
    })

    fetcher(fileUrl, dest, function () {
        fs.unlinkSync(lockFile)
        //unrar
        unrar(dest, output, function (success) {
            if (callback) callback(success);
        })

    }, function () {
        if (callback) callback(false);
    })
}