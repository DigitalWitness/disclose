var mongoose = require('mongoose');
const SMS = require('./sms.js').schema;

var Messages = mongoose.Schema({
    contact: {
    	firstName: String,
    	lastName: String,
    	phoneNumber: String,
    },
    timespan : String,
    message : [SMS]
},
{
    collection: "messages"
});

module.exports = { model: mongoose.model('Messages', Messages),
					schema: Messages 
                };
