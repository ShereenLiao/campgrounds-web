//If we work in production mode, don't import.env
if(process.env.NODE_ENV!=="production"){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const { v4: uuid } = require('uuid'); //For generating unique ID's
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const { nextTick } = require('process');
const ExpressError = require('./utils/ExpressError');
const { join } = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

//Split the routes: campgrounds, reviews, users
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

const dbUrl=process.env.DB_URL||'mongodb://localhost:27017/yelp-camp';
const MongoStore = require('connect-mongo');


//localhost: mongodb://localhost:27017/yelp-camp
//Connect to yelp-camp in Mongodb using localhost on port 27017. 
//Mongoose 6 always behaves as if useNewUrlParser , useUnifiedTopology , and useCreateIndex are true , and useFindAndModify is false .
mongoose.connect(dbUrl,{
    useNewUrlParser: true,
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
app.use(express.static(path.join(__dirname, 'public')));

const secret=process.env.SECRET||'thisshouldbeabettersecret!';

const sessionConfig = {
    store: MongoStore.create({ mongoUrl: dbUrl }),
    secret: secret,
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

//To use passport for authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));// use static authenticate method of model in LocalStrategy

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Apply the middleware to send the success and error message 
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});

//Use the routes: campgrounds, reviews, users
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);


// *********************************************
// Root - renders the home page
// *********************************************
app.get('/', (req, res) => {
    // res.render('home')
    res.render('home');
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

const port=process.env.PORT||3000;

app.listen(port, () => {
    console.log(`Listen on port ${port}`);
})
