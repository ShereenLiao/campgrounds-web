const express = require('express');
const router = express.Router({ mergeParams: true }); //Pass {mergeParams: true} to the child router if you want to access the params from the parent router.

const Campground = require('../models/campground')
const Review = require('../models/review')

const { reviewSchema } = require('../schema.js');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const isLoggedIn = require('../utils/isLoggedIn');

//Validate the req.body.review
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

// **********************************************
// CREATE - creates a new review
// **********************************************
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    // review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

// ***********************************************
// DELETE/DESTROY- removes a single review
// ***********************************************
router.delete('/:reviewId', isLoggedIn, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;