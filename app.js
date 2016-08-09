var swig = require('swig');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var app = express();
var models = require('./models');
var wikiRouter = require('./routes/wiki');
// ...


// helps grab the body of http request
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
// logger
app.use(morgan('dev'));
// serves public static files before checking router
app.use(express.static('./public'));
// html rendering setup
// app.set('views', __dirname + '/views'); // point res.render to the proper directory
app.set('view engine', 'html'); // have res.render work with html files
app.engine('html', swig.renderFile); // when giving html files to res.render, tell it to use swig
swig.setDefaults({ cache: false });

app.use('/wiki', wikiRouter);
// or, in one line: app.use('/wiki', require('./routes/wiki'));


//required to set the port of the server
var server = app.listen(4000);

// var models = require('./models');

// ... other stuff

models.User.sync({})
.then(function () {
    return models.Page.sync({})
})
.then(function () {
    server.listen(3001, function () {
        console.log('Server is listening on port 3001!');
    });
})
.catch(console.error);
