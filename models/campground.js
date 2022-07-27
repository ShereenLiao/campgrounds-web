const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review= require('./review');

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
    price: Number,
    description: String,
    location: String,
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
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