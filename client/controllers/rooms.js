const Campground = require('../models/campground');
const Room = require('../models/room');

// *********************************************
// INDEX - renders multiple rooms
// **************************˜*******************
module.exports.index = async (req, res, next) => {
    // console.log(req.query);
    const {room={}}=req.query;
    if(!room){
        const rooms = await Campground.find({});
        return res.render('rooms/index', { campgrounds,campground})
    }
};

// **********************************************
// CREATE - creates a new room
// **********************************************
module.exports.createRoom=async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const room = new Room(req.body.room);
    room.admin= req.user._id;
    campground.rooms.push(room);
    await room.save();
    await campground.save();
    req.flash('success', 'Created new room!');
    res.redirect(`/campgrounds/${campground._id}/rooms/${room._id}`);
};

// ***********************************************
// DELETE/DESTROY- removes a single room
// ***********************************************
module.exports.deleteRoom=async (req, res) => {
    const { id, roomId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { rooms: roomId } });
    await Room.findByIdAndDelete(roomId);
    req.flash('success', 'Successfully deleted room')
    res.redirect(`/campgrounds/${id}`);
};