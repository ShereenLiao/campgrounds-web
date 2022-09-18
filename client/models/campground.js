const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

//Virtuals will not be included by default.
// To include virtuals in res.json(), you need to set the toJSON schema option to { virtuals: true }.
const opts = { toJSON: { virtuals: true } };

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});


const CampgoundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    description: String,
    price: Number,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    location: String,
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    rooms:[{type: Schema.Types.ObjectId, ref: 'Room'}],
},opts); 

//To create virtual properties for geoJSON map
CampgoundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>`;
});

// DELETE ALL ASSOCIATED PRODUCTS AFTER A FARM IS DELETED
// Pre middleware can get the farm. Post middleware can get the farm.
CampgoundSchema.post('findOneAndDelete', async function (campground) {
    if (campground.reviews.length) {
        //delete all products whose id is in fram.products
        const res = await Review.deleteMany({ _id: { $in: campground.reviews } })
    }
})

const Campground = mongoose.model('Campground', CampgoundSchema);
module.exports = Campground;