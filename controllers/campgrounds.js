const Campground = require('../models/campground');
const { cloudinary } = require("../cloudinary");
//For creating mapbox client
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

// *********************************************
// INDEX - renders multiple campgrounds
// **************************˜*******************
module.exports.index = async (req, res, next) => {
    // console.log(req.query);
    const {campground={}}=req.query;
    if(!campground){
        const campgrounds = await Campground.find({});
        return res.render('campgrounds/index', { campgrounds,campground})
    }
    var cond={}
    const {price,title,location}=campground;
    if(price){
        cond.price=parseInt(price);
    }
    if(title){
        cond.title=title;
    }
    if(location){
        cond.location=location;
    }
    const campgrounds=await Campground.find(cond);
    return res.render('campgrounds/index', { campgrounds,campground})
};

// **********************************************
// NEW - renders a form
// **********************************************
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

// **********************************************
// CREATE - creates a new campground
// **********************************************
module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.author = req.user._id;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await campground.save();
    req.flash('success', 'Successfully created a new campground'); //store a flash message if success
    res.redirect(`/campgrounds/${campground._id}`)
};
 


// ***********************************************
// SHOW - details about one particular campground
// ***********************************************
module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        },
    }).populate('author').populate('rooms');
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
};

// ***********************************************
// EDIT - renders a form to edit a campground
// ***********************************************
module.exports.renderEditForm = async (req, res) => {
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
module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated a new campground');
    res.redirect(`/campgrounds/${id}`);
};

// ***********************************************
// DELETE - delete a particular campground
// ***********************************************
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
};

