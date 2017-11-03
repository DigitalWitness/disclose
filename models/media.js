var mongoose = require('mongoose');

var Media = mongoose.Schema({
    id : Number,
    metaData : Object,
    mediaType : Object,
    mediaUri : Object
},
{
    collection: "media"
});

module.exports = { model: mongoose.model('Media', Media),
				   schema: Media };