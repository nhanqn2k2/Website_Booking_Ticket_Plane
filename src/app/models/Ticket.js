const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Plane = require('./Plane')
const Customer = require('./Customer')
const Flight = require('./Flight')
const User = require('./User')


const ticketSchema = new Schema({
    seatNumber:{
        type:String,
        required:true
    },
    ticketPrice:{
        type:Number,
        required:true
    },
    ticketType:{
        type:String,
        required:true
    },
    ticketClass:{
        type:String,
        required:true
    },
    planeId:{
        type:Schema.Types.ObjectId, 
        ref: 'Plane'
    },
    customerId:{
        type:Schema.Types.ObjectId, 
        ref: 'Customer'
    },
    buyerId: {
        type:Schema.Types.ObjectId,
        required:true,
    },
    flightId:{
        type:Schema.Types.ObjectId, 
        ref: 'Flight'
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Ticket',ticketSchema);