const mongoose = require('mongoose');
const User = require('../models/User')
const Schema = mongoose.Schema;

const planeSchema = new Schema({
    planeName:{
        type:String,
        required:true
    },
    economySeatNumber:Number,
    businessSeatNumber:Number,
    creatorCode:{
        type:Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Plane',planeSchema);