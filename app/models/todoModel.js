var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var todoSchema = new Schema({
    text : String,
    done : Boolean
});

module.exports = mongoose.model('TodoModel', todoSchema);