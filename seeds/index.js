const mongoose = require('mongoose');
const Campground = require('../models/campground');
const User = require('../models/user');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedUser=async()=>{
    await User.deleteMany({});
    const user=new User({
        email:'admin@gmail.com',
        username:'admin'
    });
    const registereduser=await User.register(user, 'password');
    return registereduser;
}

const sample = array => array[Math.floor(Math.random() * array.length)];
//generate 100 campground using random number
const seedDB = async () => {
    const user=seedUser();
    await Campground.deleteMany({});
    for (let i = 0; i < 100; i++) {
        //Create random campground info
        const random1000 = Math.floor(Math.random() * 1000);
        const price=Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author:(await user)._id,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price:price,
            
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})

