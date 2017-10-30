const schema = new Schema({ firstName: String, lastName: String });

class MusicTrack {
 constructor(content, limit = 5) {
    this.currentPage = 1;
  } 
}



    const schema = new Schema({ firstName: String, lastName: String });

    class PersonClass {
      // `fullName` becomes a virtual
      get fullName() {
        return `${this.firstName} ${this.lastName}`;
      }

      set fullName(v) {
        const firstSpace = v.indexOf(' ');
        this.firstName = v.split(' ')[0];
        this.lastName = firstSpace === -1 ? '' : v.substr(firstSpace + 1);
      }

      // `getFullName()` becomes a document method
      getFullName() {
        return `${this.firstName} ${this.lastName}`;
      }

      // `findByFullName()` becomes a static
      static findByFullName(name) {
        const firstSpace = name.indexOf(' ');
        const firstName = name.split(' ')[0];
        const lastName = firstSpace === -1 ? '' : name.substr(firstSpace + 1);
        return this.findOne({ firstName, lastName });
      }
    }

    schema.loadClass(PersonClass);
    var Person = db.model('Person', schema);

    Person.create({ firstName: 'Jon', lastName: 'Snow' }).
      then(doc => {
        assert.equal(doc.fullName, 'Jon Snow');
        doc.fullName = 'Jon Stark';
        assert.equal(doc.firstName, 'Jon');
        assert.equal(doc.lastName, 'Stark');
        return Person.findByFullName('Jon Snow');
      }).
      then(doc => {
        assert.equal(doc.fullName, 'Jon Snow');
      });


      const Person = require("../models/person");

// .find() finds all instances in the database that match the query you pass in.
// It returns an array, even if there is only one item in the array.

// No query passed in means "find everything"
Person.find((err, people) => {  
    if (err) {
        // Note that this error doesn't mean nothing was found,
        // it means the database had an error while searching, hence the 500 status
        res.status(500).send(err)
    } else {
        // send the list of all people
        res.status(200).send(people);
    }
});

// If query IS passed into .find(), filters by the query parameters
Person.find({"name": "John James", "age": 36}, (err, people) =>{  
    if (err) {
        res.status(500).send(err)
    } else {
        // send the list of all people in database with name of "John James" and age of 36
        // Very possible this will be an array with just one Person object in it.
        res.status(200).send(people);
    }
});

Kitten.findOne(  
    {"color": "white", "name": "Dr. Miffles", "age": 1},  // query
    {"name": true, "owner": true},  // Only return an object with the "name" and "owner" fields. "_id" is included by default, so you'll need to remove it if you don't want it.
    (err, kitten) => {
        if (err) {
            res.status(200).send(err)
        }
        if (kitten) {  // Search could come back empty, so we should protect against sending nothing back
            res.status(200).send(kitten)
        } else {  // In case no kitten was found with the given query
            res.status(200).send("No kitten found")
        }
    }
);
Kitten.findById(req.params.kittenId, (err, kitten) => {  
    if (err) {
        res.status(500).send(err)
    }
    if (kitten) {
        res.status(200).send(kitten)
    } else {
        res.status(404).send("No kitten found with that ID")
    }
});
const Todo = require("../models/todo");

// Assuming this is from a POST request and the body of the
// request contained the JSON of the new "todo" item to be saved
let todo = new Todo(req.body);  
todo.save((err, createdTodoObject) => {  
    if (err) {
        res.status(500).send(err);
    }
    // This createdTodoObject is the same one we saved, but after Mongo
    // added its additional properties like _id.
    res.status(200).send(createdTodoObject);
});
const Todo = require("../models/todo");

// This would likely be inside of a PUT request, since we're updating an existing document, hence the req.params.todoId.
// Find the existing resource by ID
Todo.findById(req.params.todoId, (err, todo) => {  
    // Handle any possible database errors
    if (err) {
        res.status(500).send(err);
    } else {
        // Update each attribute with any possible attribute that may have been submitted in the body of the request
        // If that attribute isn't in the request body, default back to whatever it was before.
        todo.title = req.body.title || todo.title;
        todo.description = req.body.description || todo.description;
        todo.price = req.body.price || todo.price;
        todo.completed = req.body.completed || todo.completed;

        // Save the updated document back to the database
        todo.save((err, todo) => {
            if (err) {
                res.status(500).send(err)
            }
            res.status(200).send(todo);
        });
    }
});
Todo.findByIdAndRemove(req.params.todoId, (err, todo) => {  
    // We'll create a simple object to send back with a message and the id of the document that was removed
    // You can really do this however you want, though.
    le response = {
        message: "Todo successfully deleted",
        id: todo._id
    };
    res.status(200).send(response);
});



/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , mongoose = require('mongoose')
  , path = require('path');

var app = express();

mongoose.connect('mongodb://localhost/truckroutes');

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

var Schema = mongoose.Schema; 

var Drivers = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
});

var Trucks = new Schema({
    licenceNo: { type: String, required: true },
    title: { type: String, required: true },
});

var Routes = new Schema({
    title: { type: String, required: true },
  len: {type: Number},
});

var Trip = new Schema({
    customRoute: { type: String, required: false },
  route:[Routes],
    driver: [Drivers],
    truck: [Trucks],
    modified: { type: Date, default: Date.now }
});

var DriversModel = mongoose.model('Drivers', Drivers);
var TripsModel = mongoose.model('Trips', Drivers);

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res){
  res.render('index', {
    title: 'Home'
  });
});

app.get('/drivers', function(req, res){

  return DriversModel.find(function (err, drivers) {
    if (!err) {
      res.render('driver_list', {
        drivers:drivers,
        title: 'Drivers'
      });
      
      
    } else {
      return console.log(err);
    }
  });
});

app.get('/drivers/add', function(req, res){
  var driver_data={
    _id:"",
    firstName:"",
    lastName:""
  };
  res.render('driver_edit', {
    title: 'Driver data',
    driver:driver_data
  });
});

app.post('/drivers/add', function(req, res){
  console.log(req.body);
  var driver;
  
  driver = new DriversModel({
    firstName:req.body.firstname,
    lastName:req.body.lastname,
  });
  
  driver.save(function (err) {
    if (!err) {
      return console.log("created");
    } else {
      //TODO: return page with errors
      return console.log(err);
    }
  });
  //TODO: return to list page, if saved
  res.redirect('/drivers/', 301);
  //return res.send(driver);  
});

app.get('/drivers/:id', function(req, res){
  return DriversModel.findById(req.params.id, function (err, driver_data) {
    if (!err) {
      res.render('driver_edit', {
        title: 'Driver data',
        driver:driver_data
      });
    } else {
      return console.log(err);
    }
  });

  res.render('driver_edit', {
    title: 'Driver data'
  });
});

app.post('/drivers/:id', function(req, res){

  return DriversModel.findById(req.params.id, function (err, driver_data) {
    driver_data.firstName=req.body.firstname;
    driver_data.lastName=req.body.lastname;
    return driver_data.save(function (err) {
      if (!err) {
        console.log("updated");
      } else {
        console.log(err);
      }
      res.redirect('/drivers/', 301);
    });
  });
});

app.get('/trips', function(req, res){
  return TripsModel.find(function (err, trip_list) {
    if (!err) {
      res.render('trip_list', {
        trips:trip_list,
        title: 'trips'
      });
      
      
    } else {
      return console.log(err);
    }
  });

});

app.get('/json/drivers', function(req, res){

  DriversModel.find(function (err, drivers_list) {
    if (!err) {
    res.json(drivers_list);
    } else {
    res.json({});
    }
  });
});


app.get('/trips/add', function(req, res){

  var trip_data={
    _id:"",
    route:"",
    customRoute:""
  };
  res.render('trip_edit', {
    title: 'Trips',
    trip: trip_data
  });
});


app.get('/routes', function(req, res){
  res.render('routes', {
    title: 'Routes'
  });
});



http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var crud = require('crud'),
  cm = require('crud-mongoose'),
  mongoose = require('mongoose'),
  Model = mongoose.model('users', new mongoose.Schema({
      firstName: { type: String, required: true },
      lastName:  { type: String, required: true },
      gender:    { type: String, required: true, enum: ['M', 'F'] },
      created:   { type: Date, default: Date.now }
  }));

// All Users -------------------------------------------------------------------

crud.entity('/users').Create()
  .pipe(cm.createNew(Model));

crud.entity('/users').Read()
  .pipe(cm.findAll(Model))

crud.entity('/users').Delete()
    .pipe(cm.removeAll(Model));

// One User --------------------------------------------------------------------

crud.entity('/users/:_id').Read()
  .pipe(cm.findOne(Model))

crud.entity('/users/:_id').Update()
  .pipe(cm.updateOne(Model));

crud.entity('/users/:_id').Delete()
  .pipe(cm.removeOne(Model));