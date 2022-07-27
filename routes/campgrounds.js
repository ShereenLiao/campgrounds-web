const express = require('express');
const router = express.Router({ mergeParams: true }); //Pass {mergeParams: true} to the child router if you want to access the params from the parent router.

const Campground = require('../models/campground')
const Review = require('../models/review')

const { campgroundSchema } = require('../schema.js');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const isLoggedIn = require('../utils/isLoggedIn');
// const { isLoggedIn } = require('../middleware');

//Validate the req.body.camp
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

// *********************************************
// INDEX - renders multiple campgrounds
// *********************************************
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));

// **********************************************
// NEW - renders a form
// **********************************************
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

// **********************************************
// CREATE - creates a new campground
// **********************************************
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully created a new campground'); //store a flash message if success
    res.redirect(`/campgrounds/${campground._id}`)
}));

// ***********************************************
// SHOW - details about one particular campground
// ***********************************************
router.get('/:id', catchAsync(async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
    console.log(campground);
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}));


// ***********************************************
// EDIT - renders a form to edit a campground
// ***********************************************
router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}));

// ***********************************************
// UPDATE - updates a particular campground
// ***********************************************
router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(req.params.id);
    if (!campground || campground.author === req.user._id) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect('/campgrounds');
    }
    await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated a new campground');
    res.redirect(`/campgrounds/${campground._id}`)
}));

// ***********************************************
// DELETE/DESTROY- removes a single campground
// ***********************************************
router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
}));

module.exports = router;