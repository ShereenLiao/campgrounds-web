if(process.env.NODE_ENV!=="production"){
    require('dotenv').config();
}

const mongoose = require('mongoose');
const Campground = require('../models/campground');
const User = require('../models/user');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

//For creating mapbox client
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedUser = async () => {
    await User.deleteMany({});
    const user = new User({
        email: 'sherry@gmail.com',
        username: 'sherry'
    });
    const registereduser = await User.register(user, 'password');
    return registereduser;
}

const sample = array => array[Math.floor(Math.random() * array.length)];
//generate 100 campground using random number
const seedDB = async () => {
    const user = seedUser();
    await Campground.deleteMany({});
    for (let i = 0; i < 30; i++) {
        //Create random campground info
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const location = `${cities[random1000].city}, ${cities[random1000].state}`;
        const camp = new Campground({
            author: (await user)._id,
            location: location,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/sherry-camp/image/upload/v1658894337/xyovnitbshniuydkm4sq.webp',
                    filename: 'xyovnitbshniuydkm4sq'
                },
                {
                    url: 'https://res.cloudinary.com/sherry-camp/image/upload/v1658894338/rffiny4hjxqv6bumamvx.jpg',
                    filename: 'rffiny4hjxqv6bumamvx'
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price: price,

        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})

