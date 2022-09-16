const express = require('express');
const router = express.Router({ mergeParams: true }); //Pass {mergeParams: true} to the child router if you want to access the params from the parent router.
const reviews = require('../controllers/reviews')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn,validateReview,isReviewAuthor} = require('../middleware');



// **********************************************
// CREATE - creates a new review
// **********************************************
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

// ***********************************************
// DELETE/DESTROY- removes a single review
// ***********************************************
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;