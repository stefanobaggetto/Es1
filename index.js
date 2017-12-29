var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Assignment = require('./assignment');

const app = express();

mongoose.Promise = global.Promise;
var options = {
    useMongoClient: true,
    user: 'admin',
    pass: 'admin'
  };
mongoose.connect('mongodb://admin:admin@ds235827.mlab.com:35827/es1', options);
const db = mongoose.connection;
db.on('error', err => {
  console.error(`Error while connecting to DB: ${err.message}`);
});
db.once('open', () => {
  console.log('DB connected successfully!');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

router.get('/', function (req, res) {
    res.json({ message: 'welcome to our api!' });
});

router.route('/assignments')

    // create a assignment
    // accessed at POST http://localhost:8080/api/assignemnt
    .post(function (req, res) {
        // create a new instance
        var assignment = new Assignment();
        // set the name (comes from the request)
        assignment.taskID = req.body.taskID;
        assignment.assignmentID = req.body.assignmentID;
        assignment.workerID = req.body.workerID;
        assignment.assignmentResult = req.body.assignmentResult;

        // save
        assignment.save(function (err) {
            if (err) { res.send(err); }
            res.json(assignment);
        });

    })
    
    // get all
    
    .get(function (req, res) {
        Assignment.find(function (err, assignments) {
            if (err) { res.send(err); }
            res.json(assignments);
        });
    });


// route
router.route('/assignments/:assignment_id')

    // get the bear with that id
    // (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function (req, res) {
        Assignment.find({
            assignmentID: req.params.assignment_id
        }, function (err, assignment) {
            if (err) { res.send(err); }
            res.json(assignment);
        });
    })

    .put(function (req, res) {

        // use our assignment model to find the bear we want
        Assignment.find({
            assignmentID: req.params.assignment_id 
        }, function (err, assignment) {
            if (err) { res.send(err); }
            // update the assignment info
            /*Ora però quello che ci ritorna non è più sicuro che sia univico, pertanto ci viene fornito un array
            se noi vogliamo accedere ad un campo allora è bene specificarne la posizione (ecco perché c'è assignment[0].campo = req.body.campo)*/
            assignment[0].assignmentResult = req.body.assignmentResult; 
            // save the assignment
            /*Visto che stiamo lavorando con un array, anche se è di un solo elemento, ora dobbiamo comunque riferisci all'elemento specifico 'assignment[0]'*/
            assignment[0].save(function (err) {
                if (err) { res.send(err); }
                res.json(assignment);
            });

        });
    })

// delete the assignment with this id
    .delete(function (req, res) {
        Assignment.remove({
            assignmentID: req.params.assignment_id //di nuovo si applica il ragionamento precendente
        }, function (err, assignment) {
            if (err) { res.send(err); }
            res.json({ message: 'Successfully deleted' });
        });
    });

// middleware route to support CORS and preflighted requests
app.use(function (req, res, next) {
    // do logging
    console.log('Something is happening.');
    //Enabling CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Content-Type', 'application/json');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE');
        return res.status(200).json({});
    }
    // make sure we go to the next routes
    next();
});

// register our router on /api
app.use('/api', router);

// handle invalid requests and internal error
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: { message: err.message } });
});


app.listen(port);
console.log('Magic happens on port ' + port);