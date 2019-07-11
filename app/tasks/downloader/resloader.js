require('../../config')
var fetcher = require('./resFetcher')
var unrar = require('./unrar')
var path = require('path')
var logger = require('../../logger')
var fs = require('fs');
const ipc = require("../../ipc/ipcBus");

module.exports = function (callback) {
    var pupeteerFileName = 'puppeteer.zip';
    //puppeteer.zip已经下载完整
    var exist = fs.existsSync(path.join(process.env.AppHome, pupeteerFileName)) 
    
    if(process.arch === 'ia32' && !exist){
        pupeteerFileName = 'puppeteer32.zip';  
    }
    console.log(pupeteerFileName)
    var dest = path.join(process.env.AppHome, pupeteerFileName);

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
        logger.info(`${pupeteerFileName} exist, but crack, retry download`)
        fs.unlinkSync(lockFile)
        if (fs.existsSync(dest)) {
            fs.unlinkSync(dest)
        }
        if (callback) callback(false)
        return;
    }
    if (fs.existsSync(dest)) {
        logger.info(`${pupeteerFileName}  exist`, dest)

        unrar(dest, output, function (success) {
            var result = fs.existsSync(path.join(output,'node_modules'));
            if (callback) callback(result);
        })
        return;
    }

    var fileUrl = `${process.env.REACT_APP_DOWNLOAD_URL}/download/${pupeteerFileName}`
    
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