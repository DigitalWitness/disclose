var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('login.ejs', { message: req.flash('loginMessage') });
});

// router.get('/', function(req, res) {
//   console.log(path.join(__dirname, '../build'))
//   res.sendFile('index.html', {root : path.join(__dirname, '../build')});
// })
module.exports = router;
