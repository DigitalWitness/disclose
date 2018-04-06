var Submission = require('../models/submission.js').model;
var SubmissionFile = require('../models/submission_file.js').model;
var cors = require('cors');
var path = require('path');
var json2csv = require('json2csv').parse;

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

	app.delete('/api/submission/:submission_id', cors(corsOptionsDelegate), function(req, res){
		Submission.remove({submission_id : req.params.submission_id}, function(err) {
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
    var query = {
      user : req.body.user,
      submission_id : req.body.submission_id,
      files : [],
      tags : [],
      content: {
        messages : req.body.content.messages,
        media : req.body.content.media
      }
    }
		Submission.create(query, function(err, submission) {
    		if (err) {
    			console.log("1: " + err);
    			res.send(err);
    		}
    		else {
    			res.send(response_ok);
    		}
      });
    });

    app.post('/api/submission/tags/:submission_id', cors(corsOptionsDelegate), function(req, res) {
      var query = {submission_id : req.params.submission_id};
      var update = {tags : req.body.tags};
      var opts = {new : true}
      Submission.findOneAndUpdate(query, update, opts, function(err, data) {
        if (err) {
          res.send(err);
        }
        else {
          res.json(data);
        }
      });
    })


    app.get('/api/submissions.csv', cors(corsOptionsDelegate), function(req,res) {
      console.log("Received export request")
      Submission.find(function(err, submissions) {
        if(err) {
          res.send(err);
        }
        else {
          var fields = ['user', 'submission_id', 'datetime', 'content.messages'];
          var fieldNames = ['user', 'submission_id', 'date', 'messages'];
          var csv = json2csv(submissions, {fields})
          res.write(csv);
          res.end()
        }
      });
    });

    app.get('/api/submission/log/:submission_id', cors(corsOptionsDelegate), function(req, res) {
        // Need to redesign to handle and return multiple log files.
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

    // Endpoint for fetching file metadata
    app.get('/api/file/meta/:submission_id', cors(corsOptionsDelegate), function(req,res) {
        var query = {submission_id : req.params.submission_id};
        var fields = {'file.filename': true, 'submission_type': true, '_id': false}
        SubmissionFile.find(query , fields, function(err, submission) {
            if (err) {
                console.log("1. " + err);
                res.send({"success": false, "message":"Download failed."});
            }
            else {
                if (submission == null) {
                    res.json({"success": false, "message":"Submission GUID not found."})
                }
                else {
                    res.json(submission);
                }
            }
        });
    });

    // Endpoint for fetching file
    app.get('/api/file/:submission_id/:filename', cors(corsOptionsDelegate), function(req, res) {
        var query = {submission_id : req.params.submission_id, "file.filename": req.params.filename};
        SubmissionFile.findOne(query, function(err, submission) {
          if (err) {
              console.log("1. " + err);
              res.send({"success": false, "message":"Download failed."});
          }
          else {
              if (submission == null) {
                console.log("submission null")
                res.json({"success": false, "message":"An error occured."})
              }
              else {
                res.sendFile(submission.file.path, { root: path.join(__dirname, '../bin') });
              }
          }
        });
    });

   app.post('/api/files', upload.array('files', 12), function (req, res) {
      var file = req.files[0];
      var submission_id = req.body.submission_id;
      var query = {
          submission_id : req.body.submission_id,
          submission_type : req.body.submission_type,
          file : file
      };
      try {
          SubmissionFile.create(query, function(err, submission) {
              if (err) {
                  console.log("1: " + err);
                  res.json({"success":false, "message": "Upload failed."});
              }
              else {
                  // console.log(submission);
                  res.send({"success":true, "message": "Upload success."});
              }
          });
      } catch (err) {
    		console.log(err);
    		res.json({"success":false, "message": "Upload failed."});
		  }
	});

}
