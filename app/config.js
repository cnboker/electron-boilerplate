//production, development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if(process.env.NODE_ENV == 'production'){
    process.env.REACT_APP_API_URL = 'http://polish.ioliz.com/api';
    process.env.REACT_APP_AUTH_URL = 'http://polish.ioliz.com';
   // process.env.REACT_APP_COOKIE_DOMAIN = '.ioliz.com'
}else{
    //process.env.REACT_APP_API_URL = 'http://polish.ioliz.com/api';
    //process.env.REACT_APP_AUTH_URL = 'http://polish.ioliz.com';
    process.env.REACT_APP_API_URL = 'http://localhost:3001/api';
    process.env.REACT_APP_AUTH_URL = 'http://localhost:3001';
    process.env.APP = 'web' //node, web, electron
    //process.env.APP = 'electron'
}