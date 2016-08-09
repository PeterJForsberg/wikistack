var express = require('express');

var router = express.Router();

var Promise = require('bluebird');

var models = require('../models');
var Page = models.Page;
var User = models.User;

router.get('/', function(req, res) {
	res.redirect('/');
});

// router.get('/', function(req, res, next) {
//   User.findAll({}).then(function(users){
//     res.render('users', { users: users });
//   }).catch(next);
// });

// router.post('/', function(req, res) {
// 	// submit a new page to the database
// 	res.send(200, "got post");
// });

router.get('/add', function(req, res){
	// retrieve the 'add a page' form
	res.render('addpage');
});

router.put('/users', function(req, res) {
    // TBD
});

router.delete('/user', function(req, res) {
	//TBD
});

router.get('/user/:userId', function(req, res, next) {

  var userPromise = User.findById(req.params.userId);
  var pagesPromise = Page.findAll({
    where: {
      authorId: req.params.userId
    }
  });

  Promise.all([
    userPromise,
    pagesPromise
  ])
  .then(function(values) {
    var user = values[0];
    var pages = values[1];

    // res.render('user', { user: user, pages: pages });
    res.redirect('/wiki/add');
  })
  .catch(next);

});



router.post('/', function(req, res, next) {
  User.findOrCreate({
    where: {
      name: req.body.name,
      email: req.body.email
    }
  })
  .then(function (values) {

    var user = values[0];

    var page = Page.build({
      title: req.body.title,
      content: req.body.content
    });
    console.log("saving page");

    return page.save()
    // .then(function (page) {
    //   return page.setAuthor(user);
    // });

  })
  .then(function (page) {
    console.log("redirecting", page.route);
    // res.redirect('/wiki/add');
    res.redirect(page.route);
  })
  .catch(next);



  // STUDENT ASSIGNMENT:
  // make sure we only redirect *after* our save is complete!
  // note: `.save` returns a promise or it can take a callback.

});

router.get('/:urlTitle', function(req, res, next){
  // console.log("FINDING ROUTE");
  // res.send("mes");
  Page.findOne({
    where: {
      urlTitle: req.params.urlTitle
    }
  })
  .then(function(foundPage){
    console.log("query finished");
    res.render('wikipage.html',
    	foundPage.dataValues
    );
    // res.redirect('/:urlTitle');
  })
  .catch(next);
});


module.exports = router;
