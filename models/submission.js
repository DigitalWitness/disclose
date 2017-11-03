var mongoose = require('mongoose');
const Messages = require('./messages.js').schema;
const Media = require('./media.js').schema;

var Submission = mongoose.Schema({
	user: String,
	datetime: String,
	content : {
		messages : [Messages],
		media: [Media] 
	}
},
{
    collection: "submissions"
});

module.exports = { model: mongoose.model('Submission', Submission),
					schema: Submission };