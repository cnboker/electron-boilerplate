const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((e) => {
    console.log(e)
    process.exit(1)
  })

function getInstallerConfig () {
  console.log('creating windows installer')
  const rootPath = path.join('./')
  const outPath = path.join(rootPath, 'release')
  return Promise.resolve({
      //appDirectory: Tells the installer where to look for the packaged app.
    appDirectory: path.join(outPath, 'kwpolish-win32-ia32/'),
    authors: 'ioliz.com',
    //noMsi: should we use an msi installer?
    noMsi: true,
    //outputDirectory: where should the installer be saved?
    outputDirectory: path.join(outPath, 'windows-installer'),
    //exe: the name of the packaged exe file in the app directory
    exe: 'kwpolish.exe',
    //setupExe: the name of the installer exe
    setupExe: 'kwpolishInstaller.exe',
    description:'keyword polish',
    setupIcon: path.join(rootPath, 'assets', 'icons', 'win', 'icon.ico'),
    skipUpdateIcon:true
  })
}