var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ResultSchema = new Schema({
    risposta: string,
    risposta2: string
});

var AssignmentSchema = new Schema({
    taskID: String,
    assignmentID: String,
    workerID: String,
    assignmentResult: Resultschema 
});

module.exports = mongoose.model('Assignment', AssignmentSchema);