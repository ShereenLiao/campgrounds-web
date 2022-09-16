const express = require('express');
const router = express.Router({ mergeParams: true }); //Pass {mergeParams: true} to the child router if you want to access the params from the parent router.
const Campground = require('../models/campground')
const Room = require('../models/room')
const User = require('../models/user')
const rooms = require('../controllers/rooms')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn,validateReview,isRoomAdmin} = require('../middleware');
const {ExpressError} = require("../utils/ExpressError");

function parseQuery(queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}



// **********************************************
// GET - get multiple rooms
// **********************************************
router.get('/', (req, res)=>{
    const {id} = req.params;
    const q = req._parsedUrl.query;
    if(q){
        const query = parseQuery(q);
        const {username, room} = query;
        console.log(username, room);
        res.render('rooms/chat', {username, room, id});
    }
    else{
        console.log('redirect to rooms')
        res.render('rooms/index', {campgroundId: id});
    }
})


// **********************************************
// GET - render create room page
// **********************************************
router.get('/new', (req, res)=>{
    const {id} = req.params;
    res.render('rooms/new', {campgroundId: id});
})

// ***********************************************
// SHOW - show the current room
// ***********************************************
router.get('/:roomId', async (req, res) => {
    const baseUrl = req.baseUrl;
    const returnUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/'));
    const {roomId} = req.params;
    const userId = req.user._id;
    const user = await User.findById(userId)
    const room = await Room.findById(roomId)
    res.render('rooms/chat', {room, user, returnUrl});
})

// **********************************************
// CREATE - creates a new review
// **********************************************
router.post('/new', isLoggedIn, async (req, res)=>{
    const {id} = req.params;
    if (!req.body.room) throw new Error('Invalid Room Data', 400)
    /**1.create a new room 
     * 2.assign the user creating the room to admin 
     * 3.save it to the room db
     * 4.append it to the room list of current campground
     */
    const campground = await Campground.findById(id);
    const room = new Room(req.body.room);
    room.admin = req.user._id;
    campground.rooms.push(room);
    console.log(room);
    await campground.save();
    await room.save();
    res.redirect(`${room._id}`)
})



// // ***********************************************
// // DELETE/DESTROY- removes a single review
// // ***********************************************
// router.delete('/:roomId', isLoggedIn, isRoomAdmin, catchAsync(rooms.deleleRoom));

module.exports = router;