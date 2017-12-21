var express = require('express');
var router = express.Router();
var cors = require('cors');

/* GET users listing. */
var User = require('../models/user.js');

var whitelist = ['http://0.0.0.0:3000', 'http://localhost:3000']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  }else{
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

module.exports = function(app, passport) {

	app.get('/api/user', cors(corsOptionsDelegate), function(req, res) {
		User.find({}, 'local.email local.fname local.lab local.admin local.lname',
            function(err, users) {
    			if(err) {
    				console.log("Error: " + err);
    				res.send(err);
    			}
    			else {
    				res.json(users);
    			}
            });
	});

	app.delete('/api/user/:email', cors(corsOptionsDelegate), function(req, res) {
		console.log("Deleting email")
		var tempUser = User.findOne({"local.email": req.params.email});
        tempUser.remove().exec(function(err, user) {
            if(err) {
                res.send(err);
            }
            else {
                User.find(function(err, users) {
                    if(err) {
                        res.send(err);
                    }
                    else {
                        res.json(users);
                    }
                });
            }
        });
	});

	app.post('/signup', cors(corsOptionsDelegate), (req, res, next) => {
		console.log(req.body)
		return passport.authenticate('local-signup', (err) => {
			if (err) {
				if (err.name === 'MongoError' && err.code === 11000) {
				// the 11000 Mongo code is for a duplication email error
				// the 409 HTTP status code is for conflict error
					return res.status(409).json({
					  success: false,
					  message: 'Check the form for errors.',
					  errors: {
					    email: 'This email is already taken.'
					  }
					});
				}

				return res.status(400).json({
					success: false,
					message: 'Could not process the form.'
					});
			}
			return res.status(200).json({
			  success: true,
			  message: 'You have successfully created a new user.'
			});
		})(req, res, next);
	});

	app.post('/login', cors(corsOptionsDelegate), (req, res, next) => {
		return passport.authenticate('local-login', (err, token, userData) => {
			if (err) {
				if (err.name === 'IncorrectCredentialsError') {
					return res.status(400).json({
					success: false,
					message: err.message
					});
				}
				return res.status(400).json({
				success: false,
				message: 'Could not process the form.'
				});
			}
			return res.json({
			  success: true,
			  message: 'You have successfully logged in!',
			  token,
			  user: userData
			});
    	})(req, res, next);
	});

}
