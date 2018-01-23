var mongoose = require('mongoose');

var SubmissionFile = mongoose.Schema({
	submission_id: String,
	file: Object,
},
{
    collection: "submissions_files"
});

module.exports = { model: mongoose.model('SubmissionFile', SubmissionFile),
					schema: SubmissionFile };
