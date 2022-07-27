const express = require('express');
const router = express.Router({ mergeParams: true }); //Pass {mergeParams: true} to the child router if you want to access the params from the parent router.
const campgrounds=require('../controllers/campgrounds')
const Campground = require('../models/campground')
const Review = require('../models/review')

const { campgroundSchema } = require('../schema.js');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn,isAuthor,validateCampground} = require('../middleware');

// *********************************************
// INDEX - renders multiple campgrounds
// **************************˜*******************
router.get('/', catchAsync(campgrounds.index));

// **********************************************
// NEW - renders a form
// **********************************************
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

// **********************************************
// CREATE - creates a new campground
// **********************************************
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

// ***********************************************
// SHOW - details about one particular campground
// ***********************************************
router.get('/:id', catchAsync(campgrounds.showCampground));

// ***********************************************
// EDIT - renders a form to edit a campground
// ***********************************************
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

// ***********************************************
// UPDATE - updates a particular campground
// ***********************************************
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.editCampground));

// ***********************************************
// DELETE/DESTROY- removes a single campground
// ***********************************************
router.delete('/:id', isLoggedIn, isAuthor,catchAsync(campgrounds.deleteCampground));

module.exports = router;