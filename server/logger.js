var log4js = require('log4js');

log4js.configure(
    {
      appenders: {
        file: {
          type: 'file',
          filename: 'logs/log.txt',
          maxLogSize: 10 * 1024 * 1024, // = 10Mb
          numBackups: 5, // keep five backup files
          compress: true, // compress the backups
          encoding: 'utf-8',
          mode: 0o0640,
          flags: 'w+'
        },
        dateFile: {
          type: 'dateFile',
          filename: 'logs/date.log',
          pattern: 'yyyy-MM-dd-hh',
          compress: true
        },
        out: {
          type: 'stdout'
        }
      },
      categories: {
        default: { appenders: ['file', 'dateFile', 'out'], level: 'trace' }
      }
    }
  );
  
  const logger = log4js.getLogger('all');
//   logger.debug('This little thing went to market');
//   logger.info('This little thing stayed at home');
//   logger.error('This little thing had roast beef');
//   logger.fatal('This little thing had none');
//   logger.trace('and this little thing went wee, wee, wee, all the way home.');



module.exports = logger;