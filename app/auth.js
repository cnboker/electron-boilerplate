var token = {
    access_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJEZW1vX0lzc3VlciIsImF1ZCI6IkRlbW9fQXVkaWVuY2UiLCJleHAiOjE1MzAwMjY3ODgsInNjb3BlIjoiZnVsbF9hY2Nlc3MiLCJzdWIiOiJzY290dCIsImp0aSI6IkZHZExlOFFSOUljaEl2ZXoiLCJhbGciOiJIUzI1NiIsImlhdCI6MTUyNzQzNDc4OH0.01-d6lvX-9-zyek2EB3zeLFlr12qd3yMme_1KhgqCRM",
    id_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyTmFtZSI6InNjb3R0Iiwicm9sZSI6InVzZXIiLCJpYXQiOjE1Mjc0MzQ3ODgsImV4cCI6MTUzMDAyNjc4OH0.8E_zpIhjdk-sXeVutOg9bjdwTJENngRp-Xgaz2uiBzQ",
    userName: "scott"
};
var logger = require('./logger')
var access_token = token.access_token;

const EventEmitter = require('events')
class Auth extends EventEmitter{
    getToken() {
        if (process.env.NODE_ENV == 'production') {
            const storedToken = localStorage.getItem('token')
            logger.info('token:' + storedToken);
            // if it exists
            if (storedToken) {
                // parse it down into an object
                access_token = JSON.parse(storedToken).access_token;
            } else {
                throw 'access_token not found!'
            }
        }
        return access_token;
    }
    refresh(){
        this.emit('refresh',getToken())
    }
}

module.exports = new Auth();