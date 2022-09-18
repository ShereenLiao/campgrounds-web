const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const socketSchema = new Schema({
    socket_id: String,
    user:{
        type: Schema.Types.ObjectId,
        ref:'User'
    }
})

const RoomSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    sockets: [socketSchema]
});

module.exports = mongoose.model('Room', RoomSchema);