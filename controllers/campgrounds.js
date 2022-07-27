const Campground = require('../models/campground');

// *********************************************
// INDEX - renders multiple campgrounds
// **************************˜*******************
module.exports.index=async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
};

// **********************************************
// NEW - renders a form
// **********************************************
module.exports.renderNewForm=(req, res) => {
    res.render('campgrounds/new');
};

// **********************************************
// CREATE - creates a new campground
// **********************************************
module.exports.createCampground=async (req, res, next) => {
    if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully created a new campground'); //store a flash message if success
    res.redirect(`/campgrounds/${campground._id}`)
};

// ***********************************************
// SHOW - details about one particular campground
// ***********************************************
module.exports.showCampground=async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    // console.log(campground);
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
};

// ***********************************************
// EDIT - renders a form to edit a campground
// ***********************************************
module.exports.renderEditForm=async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect(`/campgrounds`);
    }
    res.render('campgrounds/edit', { campground });
};

// ***********************************************
// UPDATE - updates a particular campground
// ***********************************************
module.exports.deleteCampground=async (req, res) => {
    const { id } = req.params;
    const campground= Campground.findById(id);
    await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated a new campground');
    res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteCampground=async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
};