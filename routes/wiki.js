var express = require('express');

var router = express.Router();

var Promise = require('bluebird');

router.get('/', function(req, res) {
	// retrieve all wiki pages (any?)
	// res.send(200, "got get");
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

router.get('/:userId', function(req, res, next) {

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
    res.render('user', { user: user, pages: pages });
  })
  .catch(next);

});

var models = require('../models');
var Page = models.Page; 
var User = models.User; 

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

      return page.save().then(function (page) {
        return page.setAuthor(user);
      });

    })
    .then(function (page) {
      // console.log(page, "Page");
      // console.log(user, " Auth");
      console.log('testpageroute', page.route);
      res.redirect(page.route);
    })
    .catch(next);

  // STUDENT ASSIGNMENT:
  // make sure we only redirect *after* our save is complete!
  // note: `.save` returns a promise or it can take a callback.
  // page.save()
  // .then(function(page) {
  //   console.log('nonerr', page.urlTitle);
  // 	res.json(page);
  // })
  // .catch(function(err) {
  // 	throw err;
  // 	  console.log('error', page.urlTitle);
  // });// -> after save -> res.redirect('/');
});

router.get('/:urlTitle', function(req, res, next){
  Page.findOne({ 
    where: { 
      urlTitle: req.params.urlTitle 
    } 
  })
  .then(function(foundPage){
    res.render('wikipage.html', 
    	foundPage.dataValues
    );
    // res.redirect('/:urlTitle'); 
  })
  .catch(next);
});



// 	Page.findAll({attributes: ['title', 'content']})
// 	.then(function(sqlResult){
// 		console.log("SQL result: ", sqlResult); 

// 		res.send(' hit dynamic route at ' + req.params.urlTitle);
// 		res.redirect('/:urlTitle'); 
// 	});
// 	// res.json(Page);
// });

// function generateUrlTitle (title) {
//   if (title) {
//     // Removes all non-alphanumeric characters from title
//     // And make whitespace underscore
//     return title.replace(/\s+/g, '_').replace(/\W/g, '');
//   } else {
//     // Generates random 5 letter string
//     return Math.random().toString(36).substring(2, 7);
//   }
// }

module.exports = router;
