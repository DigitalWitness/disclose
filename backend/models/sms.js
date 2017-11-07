var mongoose = require('mongoose');

var SMS = mongoose.Schema({
	_id : String,
    sender : String,
    message : String,
    readState : String,
    time : String,
    folderName : String
},
{
    collection: "messages"
});

module.exports = { model: mongoose.model('SMS', SMS),
					schema: SMS };