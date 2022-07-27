const express = require('express');
const router = express.Router({ mergeParams: true }); //Pass {mergeParams: true} to the child router if you want to access the params from the parent router.
const Campground = require('../models/campground')
const Review = require('../models/review')
const campgrounds=require('../controllers/reviews')
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn,validateReview,isReviewAuthor} = require('../middleware');



// **********************************************
// CREATE - creates a new review
// **********************************************
router.post('/', isLoggedIn, validateReview, catchAsync(campgrounds.createReview))

// ***********************************************
// DELETE/DESTROY- removes a single review
// ***********************************************
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(campgrounds.deleteReview));

module.exports = router;