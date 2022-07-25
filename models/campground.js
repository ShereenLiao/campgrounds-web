const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampgoundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
});

const Campground = mongoose.model('Campground', CampgoundSchema);
module.exports = Campground;