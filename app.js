const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground=require('./models/campground')
const { v4: uuid } = require('uuid'); //For generating unique ID's
const ejsMate=require('ejs-mate');
//use camp database, default port: 27017
//Mongoose 6 always behaves as if useNewUrlParser , useUnifiedTopology , and useCreateIndex are true , and useFindAndModify is false .
mongoose.connect('mongodb://localhost:27017/yelp-camp');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
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
app.engine('ejs',ejsMate);

// *********************************************
// Root - renders the home page
// *********************************************
app.get('/', (req, res) => {
    res.render('home')
});
// *********************************************
// INDEX - renders multiple campgrounds
// *********************************************
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
});
// **********************************************
// NEW - renders a form
// **********************************************
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})
// ***********************************************
// SHOW - details about one particular campground
// ***********************************************
app.get('/campgrounds/:id', async (req, res,) => {
    const campground = await Campground.findById(req.params.id)
    console.log(campground);
    res.render('campgrounds/show', { campground });
});
// **********************************************
// CREATE - creates a new campground
// **********************************************
app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})
// ***********************************************
// EDIT - renders a form to edit a campground
// ***********************************************
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
})
// ***********************************************
// UPDATE - updates a particular campground
// ***********************************************
app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
});
// ***********************************************
// DELETE/DESTROY- removes a single campground
// ***********************************************
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

app.listen(3000, () => {
    console.log("Listen on port 3000.");
})