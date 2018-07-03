var log4js = require('log4js');
var path = require('path')
var userHome = require('user-home');

log4js.configure(
    {
      appenders: {
        file: {
          type: 'file',
          filename:`${userHome}/logs/log.txt`,
          maxLogSize: 10 * 1024 * 1024, // = 10Mb
          numBackups: 5, // keep five backup files
          compress: true, // compress the backups
          encoding: 'utf-8',
          mode: 0o0640,
          flags: 'w+'
        },
        // dateFile: {
        //   type: 'dateFile',
        //   filename: 'logs/more-important-things.log',
        //   pattern: 'yyyy-MM-dd-hh',
        //   compress: true
        // },
        out: {
          type: 'stdout'
        }
      },
      categories: {
        default: { appenders: ['file',  'out'], level: 'trace' }
      }
    }
  );
  
   function getUserAppDirectory() {
    if (isMacOS())
        return System.getProperty("user.home") + "/Library/Application Support/app";
    else
        return System.getenv("APPDATA") + "/app";
}

  const logger = log4js.getLogger('global');
//   logger.debug('This little thing went to market');
//   logger.info('This little thing stayed at home');
//   logger.error('This little thing had roast beef');
//   logger.fatal('This little thing had none');
//   logger.trace('and this little thing went wee, wee, wee, all the way home.');



module.exports = logger;