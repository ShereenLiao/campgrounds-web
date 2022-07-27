const { campgroundSchema, reviewSchema } = require('./schema.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

//Validate the req.body.camp
module.exports.validateCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground=await Campground.findById(id);
    if(req.body.deleteImages){
        const deleteNum = req.body.deleteImages.length;
        if(req.files>0){
            const addNum=req.files.length;
            if(campground.images.length+addNum-deleteNum<=0){
                req.flash('error', 'At least one image.');
                return res.redirect(`/campgrounds/${id}`);
            }
        }
        else if(campground.images.length===deleteNum){
            req.flash('error', 'At least one image.');
            return res.redirect(`/campgrounds/${id}`);
        }
    }
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}
//Validate the req.body.review
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}