const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review= require('./review');

const CampgoundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
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