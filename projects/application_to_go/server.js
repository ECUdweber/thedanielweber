// server.js

    // set up ========================
    var faker = require('faker');
    var express  = require('express');
    var fs = require('fs');

    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
    var path = require('path');

	var cors = require('cors');
	app.use(cors());
	app.options('*', cors());

    app.set('app', path.join(__dirname, 'app'));

    // configuration =================

    //app.use(express.static(__dirname + '/app'));                 // set the static files location /public/img will be /img for users
    
    app.use(express.static(__dirname + '/app'));
    app.use('/bower_components',  express.static(__dirname + '/bower_components'));
    
    //app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());

    var customers_file = 'customers.json';

app.all('*', function(req, res, next){
	res.header("Access-Control-Allow-Origin", "*"); 
	res.header('Access-Control-Allow-Methods',    'GET,PUT,POST,DELETE,OPTIONS');
	res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");

  fs.readFile(customers_file, function(err, data){
    res.locals.customers = JSON.parse(data);
    next();
  });
});

app.get('bower_components/', function(req, res) {
    res.sendfile(app.get('app') + '/bower_components');
});

app.get('/', function(req, res) {
    res.sendfile(app.get('app') + '/index.html');
});

app.get('/api/customers/search', function(req, res) {
    // WOULD USE MONGO DB IN REAL APP INSTEAD OF PARSING JSON LIKE THIS

    var fn_search = req.query.firstName;
    var ln_search = req.query.lastName;

    var file = fs.readFileSync(customers_file);
    var customers = JSON.parse(file);

    //console.log(customers);

    var customers_to_return = [];

    if(fn_search && ln_search) {
        // Search for both fields

        for( var count in customers ) {   
            if((customers[count].firstName.indexOf(fn_search) > -1) && (customers[count].lastName.indexOf(ln_search) > -1)) {
                customers_to_return.push(customers[count]);
            }
        }   
    }
    else if(fn_search) {
        // Only first name was passed

        for( var count in customers ) {   
            if(customers[count].firstName.indexOf(fn_search) > -1) {
                customers_to_return.push(customers[count]);
            }
        }        
    }
    else {
        // Only Last name was passed.

        for( var count in customers ) {   
            if(customers[count].lastName.indexOf(ln_search) > -1) {
                customers_to_return.push(customers[count]);
            }
        }                  
    }

    var totalCustomers = customers_to_return.length;

    var items_per_page = req.query.itemsPerPage;
    var current_page = req.query.page;
    var items_to_return = customers_to_return;

    if(items_per_page) {
        // if current_page is 1, start at array sub 0 and get items_per_page
        var start_sub_array_at = items_per_page * (current_page - 1);
        var customers_length = customers_to_return.length;
        var end_sub_array_at = start_sub_array_at + items_per_page;

        //if(end_sub_array_at > customers_length)
        //    end_sub_array_at = customers_length - 1;

        items_to_return = customers_to_return.splice(start_sub_array_at, end_sub_array_at);
    }  

    var return_obj = {
        totalItems: totalCustomers,
        customers: items_to_return
    }; 

    res.json(return_obj);
});

app.get('/api/customers/:id', function(req, res) {
	var id = req.params.id; 

	var file = fs.readFileSync(customers_file);
	var customers = JSON.parse(file);

	var customer_to_return = {};

	for( var count in customers ) {    
	    if(customers[count].id == id) 
	 		customer_to_return = customers[count]; 	 	
	}

  	res.json(customer_to_return);
});


app.put('/api/customers/:id', function (req, res) {		
	var id = req.params.id; 

	var file = fs.readFileSync(customers_file);
	var customers = JSON.parse(file);

    var customer_to_return = {};

    for( var count in customers ) {    
        if(customers[count].id == id) {
            customers[count].firstName = req.body.firstName;
            customers[count].middleName = req.body.middleName;
            customers[count].lastName = req.body.lastName;
            customers[count].nickName = req.body.nickName;
            customers[count].maritalStatus = req.body.maritalStatus;
            customers[count].gender = req.body.gender;
            customers[count].title = req.body.title;
            customers[count].ssn = req.body.ssn;            

            customer_to_return = customers[count];                  
        }
    }

	//update the file with new object
	fs.writeFileSync(customers_file, JSON.stringify(customers));
	res.json(customer_to_return);	
});

app.get('/api/customers', function(req, res) {
    var items_per_page = req.query.itemsPerPage;
    var current_page = req.query.page;
    var items_to_return = res.locals.customers;

    var totalCustomers = items_to_return.length;

    if(items_per_page) {
        // if current_page is 1, start at array sub 0 and get items_per_page
        var start_sub_array_at = items_per_page * (current_page - 1);
        var customers_length = res.locals.customers.length;
        var end_sub_array_at = start_sub_array_at + items_per_page;

        //if(end_sub_array_at > customers_length)
        //    end_sub_array_at = customers_length - 1;

        items_to_return = res.locals.customers.splice(start_sub_array_at, end_sub_array_at);
    }   

    var return_obj = {
        totalItems: totalCustomers,
        customers: items_to_return
    }; 

    res.json(return_obj);    

    //res.json(items_to_return);
}); 

app.delete('/api/customers/:id', function(req, res) {

	var id = req.params.id; 
	
	var file = fs.readFileSync(customers_file);
	var customers = JSON.parse(file); 

    for( var count in customers ) {    
        if(customers[count].id == id) {
           customers.splice(count, 1);                  
        }
    }

	fs.writeFileSync(customers_file, JSON.stringify(customers));	

  	res.json(true);
});

app.get('/faker/customer', function(req, res) {
  res.json({
    fname: faker.name.firstName(),
    lname: faker.name.lastName(),
    email: faker.internet.email(),
    address: faker.address.streetAddress(),
    bio: faker.lorem.sentence(),
    image: faker.image.avatar()
  });
});  


    // listen (start app with node server.js) ======================================
    app.listen(8080);
    console.log("App listening on port 8080");  











/*

// server.js

    // set up ========================
    var faker = require('faker');
    var express  = require('express');
    var fs = require('fs');

    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

    // configuration =================

    //mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');     // connect to mongoDB database on modulus.io

    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    
    //app.use(morgan('dev'));                                         // log every request to the console
    //app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    //app.use(bodyParser.json());                                     // parse application/json
    //app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    //app.use(methodOverride());

//app.locals({
//  title: 'Application To Go Example'
//});

app.all('*', function(req, res, next){
  fs.readFile('customers.json', function(err, data){
    res.locals.customers = JSON.parse(data);
    next();
  });
});

app.post('/items', function (req, res) {   
	db.items.insert(req.body, function (err, doc) {
		res.json(doc);
	});		
});

app.get('/api/customers', function(req, res) {
  res.json(res.locals.customers);
}); 

app.get('/api/user', function(req, res) {
  res.json({
    fname: faker.name.firstName(),
    lname: faker.name.lastName(),
    email: faker.internet.email(),
    address: faker.address.streetAddress(),
    bio: faker.lorem.sentence(),
    image: faker.image.avatar()
  });
});  


    // listen (start app with node server.js) ======================================
    app.listen(8080);
    console.log("App listening on port 8080");  
*/