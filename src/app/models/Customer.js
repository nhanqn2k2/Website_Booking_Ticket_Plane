const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    customerName:{
        type:String,
        required:true
    },
    identityCard:String,
    gender:String,
    address:String,
    email: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    phoneNumber:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('Customer',customerSchema);