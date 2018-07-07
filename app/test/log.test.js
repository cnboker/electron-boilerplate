var logger = require('../logger')

logger.info('hello','world')
logger.info('hello,', {name:'scott'})
logger.info('hello,', [{name:'scott'}])