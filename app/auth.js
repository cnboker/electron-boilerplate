var token = {
    access_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJEZW1vX0lzc3VlciIsImF1ZCI6IkRlbW9fQXVkaWVuY2UiLCJleHAiOjE1NjEyNTQzNzYsInNjb3BlIjoiZnVsbF9hY2Nlc3MiLCJzdWIiOiJzY290dCIsImp0aSI6Ik10cW1XdlBCNXBzVXg5NXMiLCJhbGciOiJIUzI1NiIsImlhdCI6MTUzMDE1MDM3Nn0.Ue1pSRuWxE1ojrau9es23rMo7hSMTGlS87k-tflHOOg",
    id_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyTmFtZSI6InNjb3R0Iiwicm9sZSI6InVzZXIiLCJpYXQiOjE1Mjc0MzQ3ODgsImV4cCI6MTUzMDAyNjc4OH0.8E_zpIhjdk-sXeVutOg9bjdwTJENngRp-Xgaz2uiBzQ",
    userName: "scott"
};

const EventEmitter = require('events')
var logger = require('./logger')
class Auth extends EventEmitter{
    waitUtilGetToken(callback) {
        var token = this.getToken();
        if (token == null) {
            logger.info('token is null')
            window.setTimeout(this.waitUtilGetToken.bind(null, callback), 1000); /* 将参数callback带入进去*/
        } else {
            if (callback && typeof (callback) === "function") {
                logger.info('token is ok', token)
                callback(token);
            }
        }
    }

    getToken() {
        if (process.env.APP != 'web') {
            const storedToken = localStorage.getItem('token')
            //logger.info('token:' + storedToken);
            // if it exists
            if (storedToken) {
                // parse it down into an object
                token = JSON.parse(storedToken);
            } else {
                return null;
            }
        }
        return token;
    }

    refresh(){
        this.emit('refresh',getToken())
    }
}

module.exports = new Auth();