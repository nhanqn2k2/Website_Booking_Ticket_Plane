const mongoose = require('mongoose');
const dotenv = require('dotenv').config({path:__dirname+'/./../../.env'})

// stop warning.
mongoose.set('strictQuery', true);
async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connect successfully!');
    } catch (error) {
        console.log('Connect fail!');
    }
}

module.exports = { connect };