const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground = require('./models/campground')
const Review=require('./models/review')
const { v4: uuid } = require('uuid'); //For generating unique ID's
const ejsMate = require('ejs-mate');
const session=require('express-session');
const flash = require('connect-flash');
const { nextTick } = require('process');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');//For define schema and validate input data
const { join } = require('path');
const {campgroundSchema, reviewSchema}=require('./schema.js');

const campgrounds=require('./routes/campgrounds');
const reviews=require('./routes/reviews');

//use camp database, default port: 27017
//Mongoose 6 always behaves as if useNewUrlParser , useUnifiedTopology , and useCreateIndex are true , and useFindAndModify is false .
mongoose.connect('mongodb://localhost:27017/yelp-camp');

//Connect to yelp-camp in Mongodb using localhost on port 27017. 
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// Views folder and EJS setup:
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//To use EJS template engine
app.engine('ejs', ejsMate);


// To use delete, put and patch requests
app.use(methodOverride('_method'));
//To parse form data in POST request body:
app.use(express.urlencoded({ extended: true }))
// To parse incoming JSON in POST request body:
app.use(express.json())
//To specifies the root directory from which to serve static assets.
app.use(express.static(path.join(__dirname,'public')));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,//The cookie cannot be accessed through cliend side script
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));

//To use flash to store message
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


//Separate the routes
app.use('/campgrounds',campgrounds);
app.use('/campgrounds/:id/reviews',reviews);

// *********************************************
// Root - renders the home page
// *********************************************
app.get('/', (req, res) => {
    res.render('home')
});

// ***********************************************
// Error Handler- browse route that not exists
// ***********************************************
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

// ***********************************************
// Error Handler- send error message
// ***********************************************
app.use((err, req, res, next) => {
    //default statusCode=500, message = 'Something went wrong'
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log("Listen on port 3000.");
})