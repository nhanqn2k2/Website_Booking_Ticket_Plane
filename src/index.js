const express = require('express')
const morgan = require('morgan')
const path = require('path')
const app = express()
const flash = require('connect-flash')
const session = require('express-session');
const passport = require('passport')
const cors = require('cors')
const mongoose = require('mongoose')
const handlebars = require('express-handlebars')
const route = require('./routes')
const db = require('./config/db/connection')
const UserModel = require('./app/models/User')
const cookieParser = require('cookie-parser')
const siteRouter = require('./routes/site')
const jwt = require('jsonwebtoken');
const { Console } = require('console')
const port = 3000


db.connect()

// app.use(morgan('combined'))
app.use(express.static(path.join(__dirname, '/../public')));
app.use(
    express.urlencoded({
        extended: true,
    }),
);


app.use(cors());
app.use(cookieParser());
app.use(express.json());
// app.use(express.urlencoded({ extended:false}));

app.engine(
    'hbs',
    handlebars.engine({
        extname: '.hbs',
        helpers: {
            // convert time  to display
            dateFormat: function (date) {
                const hour = date.getHours() < 9 ? '0' + date.getHours() : date.getHours()
                const minute = date.getMinutes() < 9 ? '0' + date.getMinutes() : date.getMinutes();
                const second = date.getSeconds() < 9 ? '0' + date.getSeconds() : date.getSeconds();
                return `${hour}:${minute}:${second}`;
            },
            // convert day to display
            dayFormat: function (date) {
                const day = date.getDate() < 9 ? '0' + date.getDate() : date.getDate();
                const month = (date.getMonth() + 1) < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            },
            //convert money to display
            money: function (money) {
                if (money !== null && money !== undefined) {
                    return money.toLocaleString('en-US') + " VNĐ";
                }
            },
            //convert distance to display
            distance: function (distance) {
                return distance + " km"
            },
            //convert location to display
            location: function (location) {
                return `TP. ${location}`
            },
            //convert to datetime-local to input
            dateTimeLocal: function (date) {
                if (date !== undefined) {
                    const isoDate = new Date(date)
                    return isoDate.toISOString().slice(0, 16)
                }
            },
            // select to input selection
            selected: function (airline, data) {
                return airline == data ? 'selected' : ''
            },
            // convert datetime to display
            dateTime: function (date, option) {
                if (date !== undefined) {
                    const dates = new Date(date);
                    const year = dates.getFullYear();
                    const month = ('0' + (dates.getMonth() + 1)).slice(-2);
                    const day = ('0' + dates.getDate()).slice(-2);
                    const hours = ('0' + dates.getHours()).slice(-2);
                    const minutes = ('0' + dates.getMinutes()).slice(-2);
                    const seconds = ('0' + dates.getSeconds()).slice(-2);
                    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
                } else {
                    return option
                }
            },
            dateTicket: function (date) {
                if (date !== undefined) {
                    const dates = new Date(date);
                    const year = dates.getFullYear();
                    const month = ('0' + (dates.getMonth() + 1)).slice(-2);
                    const day = ('0' + dates.getDate()).slice(-2);
                    const time = dates.toLocaleTimeString('en-US', { hour12: true });
                    return `${day}-${month}-${year}/ ${time}`;
                }
            },
            // convert time to 12/12
            converTime: function (date) {
                const data = new Date(date)
                return data.toLocaleTimeString('en-US', { hour12: true });
            },
            // checked to checkbox input
            checked: function (data, typeTicker) {
                return data == typeTicker ? 'checked' : ''
            },
            // choose one of two option if one option is null
            chooseOne: function (optionOne, optionTwo) {
                if (optionOne) {
                    return optionOne
                } else return optionTwo
            },
            // convert time to display buy ticket
            showTime(dayOfWeek, day, month, year) {
                if (dayOfWeek !== undefined && day !== undefined && month !== undefined && year !== undefined) {
                    return `${dayOfWeek}, ${day} thg ${month} ${year}`
                }
                return ''
            }
        }
    }),
);
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'resources/views'))
// 3 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())
app.use(session({
    cookie: { maxAge: 60000 },
    secret: 'cookiesecret',
    saveUninitialized: false,
    resave: false
}));
app.use(passport.initialize())
app.use(passport.session())
// 4 
app.use(flash())
app.use((req, res, next) => {
    let userId;
    let userRole;
    const jwtToken = req.cookies.accessToken
    let isAdmin

    try {
        const decodedToken = jwt.verify(jwtToken, process.env.ACCESS_TOKEN_SECRET);
        userId = decodedToken.id;
        userRole = decodedToken.role;
        isAdmin = userRole && userRole === 'admin'
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            // Xóa cookie có tên là 'accessToken'
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            return res.redirect('/login')
        }
    }

    res.locals.userInfo = userId
    res.locals.isAdmin = isAdmin;
    res.locals.success_messages = req.flash('success')
    res.locals.error_messages = req.flash('error')
    next()
})

route(app)


app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});