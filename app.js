const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground = require('./models/campground')
const { v4: uuid } = require('uuid'); //For generating unique ID's
const ejsMate = require('ejs-mate');
const { nextTick } = require('process');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');//For define schema and validate input data
const { join } = require('path');
const {campgroundSchema}=require('./schema.js');
//use camp database, default port: 27017
//Mongoose 6 always behaves as if useNewUrlParser , useUnifiedTopology , and useCreateIndex are true , and useFindAndModify is false .
mongoose.connect('mongodb://localhost:27017/yelp-camp');

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
// To use delete, put and patch requests
app.use(methodOverride('_method'));
//To parse form data in POST request body:
app.use(express.urlencoded({ extended: true }))
// To parse incoming JSON in POST request body:
app.use(express.json())
//To use EJS template engine
app.engine('ejs', ejsMate);

//Validate the req.body.camp
const validateCampground=(req,res,next)=>{
    const { error } = campgroundSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400);
    }
    else{
        next();
    }
}

// *********************************************
// Root - renders the home page
// *********************************************
app.get('/', (req, res) => {
    res.render('home')
});
// *********************************************
// INDEX - renders multiple campgrounds
// *********************************************
app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));
// **********************************************
// NEW - renders a form
// **********************************************
app.get('/campgrounds/new', catchAsync(async (req, res) => {
    res.render('campgrounds/new');
}));
// ***********************************************
// SHOW - details about one particular campground
// ***********************************************
app.get('/campgrounds/:id', catchAsync(async (req, res,) => {
    const campground = await Campground.findById(req.params.id)
    console.log(campground);
    res.render('campgrounds/show', { campground });
}));
// **********************************************
// CREATE - creates a new campground
// **********************************************
app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}));
// ***********************************************
// EDIT - renders a form to edit a campground
// ***********************************************
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
}));
// ***********************************************
// UPDATE - updates a particular campground
// ***********************************************
app.put('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
}));
// ***********************************************
// DELETE/DESTROY- removes a single campground
// ***********************************************
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));
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