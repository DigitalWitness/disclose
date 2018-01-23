var Submission = require('../models/submission.js').model;
var SubmissionFile = require('../models/submission_file.js').model;
var cors = require('cors');
var path = require('path');

var response_ok = {'success': true}
var multer = require('multer');
const upload = multer({ dest: 'files/' })

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
        console.log(req.body)
		Submission.create({
			user : req.body.user,
            submission_id : req.body.submission_id,
            files : [],
			content: {
				messages : req.body.content.messages,
				media : req.body.content.media
			}
		    },
            function(err, submission) {
    			if (err) {
    				console.log("1: " + err);
    				res.send(err);
    			}
    			else {
    				res.send(response_ok);
    			}
            });
    });

    app.get('/api/submission/photo/:submission_id', cors(corsOptionsDelegate), function(req, res) {
        // Also wrap CORS around it so it can accept the parameter.
        // Need to redesign to handle and return multiple photos.
        try {
            SubmissionFile.findOne({submission_id : req.params.submission_id},
                function(err, submission) {
                    if (err) {
                        console.log("1. " + err);
                        res.send({"success": false, "message":"Download failed."});
                    }
                    else {
                        if (submission == null) {
                            res.json({"success": false, "message":"Submission GUID not found."})
                        }
                        else {
                            console.log(submission)
                            res.sendFile(submission.file.path, { root: path.join(__dirname, '../') });
                        }
                    }
                });
        }
        catch (err) {
            console.log("Submission GUID not found");
            console.log(err);
            res.send({"success": false, "message":err});
        }
    });

	app.post('/api/files', upload.array('files', 12), function (req, res) {
        var file = req.files[0];
        var submission_id = req.body.submission_id;
		console.log(file);
        console.log(submission_id);
        try {
            SubmissionFile.create({
                submission_id : submission_id,
                file : file
            },
            function(err, submission) {
                if (err) {
                    console.log("1: " + err);
                    res.json({"success":false, "message": "Upload failed."});
                }
                else {
                    console.log(submission);
                    res.send({"success":true, "message": "Upload success."});
                }
            });
        } catch (err) {
			console.log(err);
			res.json({"success":false, "message": "Upload failed."})
		}
	});

}
