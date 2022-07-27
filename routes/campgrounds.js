const express = require('express');
const router = express.Router({ mergeParams: true }); //Pass {mergeParams: true} to the child router if you want to access the params from the parent router.
const campgrounds=require('../controllers/campgrounds')
const Campground = require('../models/campground')
const Review = require('../models/review')
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn,isAuthor,validateCampground} = require('../middleware');
const multer  = require('multer')
const {storage}=require('../cloudinary/index');
const upload = multer({ storage })//store in cloud
router.route('/')
.get(catchAsync(campgrounds.index))
.post(isLoggedIn, upload.array('image'),validateCampground,catchAsync(campgrounds.createCampground));

router.route('/new')
.get(isLoggedIn, campgrounds.renderNewForm);


router.route('/:id')
.get(catchAsync(campgrounds.showCampground))
.put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.editCampground))
.delete(isLoggedIn, isAuthor,catchAsync(campgrounds.deleteCampground))


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));


module.exports = router;