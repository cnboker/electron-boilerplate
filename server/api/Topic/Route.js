module.exports = (app) => {
  var topicCtl = require('./TopicController')
  
  app
    .route('/api/topics/:id')
    .get(topicCtl.list)

  app
    .route('/api/topic/update')
    .post(topicCtl.update)
}
