const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Flight = require('./Flight')
const AirLine = require('./AirLine')

const detailFlight = new Schema({
    flightId: {
        type: Schema.Types.ObjectId,
        ref: 'Flight'
    },
    dateStart: {
        type: Date,
        require: true
    },
    airLightId: {
        type: Schema.Types.ObjectId,
        ref: 'AirLine'
    },
    fromPlace:{
        type:String,
        required:true
    },
    toPlace:{
        type:String,
        required:true
    },
    totalSeat: {
        type: Number,
        required: true
    },
    availableSeat: {
        type: Number,
        required: true
    },
    price: {
        type:Number,
        required:true
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('DetailFlight', detailFlight)
