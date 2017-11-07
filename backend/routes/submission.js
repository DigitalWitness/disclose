var Submission = require('../models/submission.js').model;
var cors = require('cors');

var response_ok = {'success': true}
var multer = require('multer');
var upload = multer().single('file1');

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

module.exports = function(app) {

	app.get('/api/submission', cors(corsOptionsDelegate), function(req, res) {
		Submission.find(function(err, submissions) {
			if (err){
				res.send(err);
			}
			else {
				res.json(submissions);
			}
		});
	});

	app.delete('/api/submission', function(req, res){
		Submission.remove({}, function(err) {
			if (err) {
				res.send(err);
			}
			else {
				res.send(response_ok);
			}
		});
	});

	app.post('/api/submission', function(req, res) {
		if (req.headers['content-type'] == 'application/json') {
			Submission.create({
				user : req.body.user,
				content: {
					messages : req.body.content.messages,
					media : req.body.content.media
				}
			}, function(err, submission) {
				if (err) {
					console.log("1: " + err);
					res.send(err);
				}
				else {
					res.send(response_ok);
				}
			});
		}
		else if (req.headers['content-type'] == 'multipart/form-data') {
			upload(req, res, function(err) {
				if (err) {
					console.log("error occured during upload");
					return; 
				}
			})
			res.send("multipart form not implemented yet");
		}
	});

}