
require('../config')
console.info(process.env.Home)
console.info(process.env.AppRoot)

require('../tasks/downloader/resloader')()