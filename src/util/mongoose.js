module.exports = {
    multipleMongooseToObject: function (mongooses) {
        return mongooses.map(mongooses => mongooses.toObject());
    },

    mongooseToObject: function (mongoose) {
        return mongoose ? mongoose.toObject() : mongoose;
    },

    convertDate: function (date) {
        const data = new Date(date)
        var year = data.getFullYear();
        var month = ('0' + (data.getMonth() + 1)).slice(-2);
        var day = ('0' + data.getDate()).slice(-2);

        return year + '-' + month + '-' + day;
    },

    convertTime: function (date) {
        const data = new Date(date)
        return data.toLocaleTimeString('en-US', { hour12: true });
    },

    chooseSeat: function (seat) {
        let seats = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10',
            'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10',
            'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10',
            'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10',
            'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10',
            'F11', 'F12', 'F13', 'F14', 'F15', 'F16', 'F17', 'F18', 'F19', 'F20',];
        seats = seats.filter(item => !seat.includes(item))
        const randomSeatIndex = Math.floor(Math.random() * seats.length);
        const selectedSeat = seats[randomSeatIndex];
        return selectedSeat
    }
};