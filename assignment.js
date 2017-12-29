var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*var ResultSchema = new Schema({
    risposta1: String,
    risposta2: String,
});*/

var AssignmentSchema = new Schema({
    taskID: String,
    assignmentID: String,
    workerID: String,
    assignmentResult: String, 
});

module.exports = mongoose.model('Assignment', AssignmentSchema);