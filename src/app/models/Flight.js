const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Plane = require('./Plane')

const flightSchema = new Schema({
    dateStart: {
        type:Date,
        required:true
    },
    fromPlace:{
        type:String,
        required:true
    },
    toPlace:{
        type:String,
        required:true
    },
    hourStart: {
        type:Date,
        required:true
    },
    hourEnd: {
        type:Date,
        required:true
    },
    distance: {
        type:String,
        default: 0
    },
    totalSeat: {
        type: Number,
        required: true
    },
    availableSeat: {
        type: Number,
        required: true
    },
    creatorId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    },
    planeId: {
        type:Schema.Types.ObjectId,
        required: true,
        ref: 'Plane'
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Flight',flightSchema);