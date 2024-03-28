const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Role = require('./Role');


const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique: true
    },
    password:{
        type:String,
        required:true
    },
    name: String,
    email:String,
    phoneNumber:String,
    gender:String,
    birthday:String,
    roleId:{
        type:Schema.Types.ObjectId, 
        ref: 'Role'
        // default: '0' //user(0); admin(1)                   
    },
},{
    timestamps: true
});

const UserModel = mongoose.model('User',userSchema)
module.exports = UserModel