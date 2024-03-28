const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const airlineSchema = new Schema({
    rank: {
        type: String,
        required: true
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('AirLine', airlineSchema)
