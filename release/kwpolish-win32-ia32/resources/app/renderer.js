

document.getElementById('start').addEventListener('click', function () {
	event.preventDefault();
    console.log('start');
    //getPic('https://www.google.com');
    var main = require('./seo/main');
    main();
});
