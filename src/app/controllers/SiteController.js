const moment = require('moment');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const flash = require('express-flash')
const User = require('../models/User')
const Plane = require('../models/Plane');
const mongoose = require('mongoose');
const Customer = require('../models/Customer');
const Flight = require('../models/Flight');
const Ticket = require('../models/Ticket');
const { response } = require('express');
const { multipleMongooseToObject, mongooseToObject, convertDate, convertTime, chooseSeat } = require('../../util/mongoose');
const AirLine = require('../models/AirLine');
const DetailFlight = require('../models/DetailFlight');
const Role = require('../models/Role')



class SiteController {

    // [GET] /
    index(req, res, next) {
        const noidi = req.flash('noidi')
        const noiden = req.flash('noiden')
        const ngaydi = req.flash('ngaydi')
        const ngayden = req.flash('ngayden')
        const loaive = req.flash('loaive')

        res.render('home', { title: 'Trang chủ', noidi, noiden, ngaydi, ngayden, loaive })
    }

    // [GET] / search
    searchFlyTeam(req, res) {
        res.render('searchflyteam')
    }

    // [GET] / inforcustomer
    inforCustomer(req, res) {
        const data = req.flash('data')
        const userI = req.flash('userI')
        const username = req.flash('username')
        const gender = req.flash('gender')
        const date = req.flash('date')
        const identify = req.flash('identify')
        const email = req.flash('email')
        const phone = req.flash('phone')
        const location = req.flash('location')
        const idTicketOne = req.flash('idTicketOne')
        const idTicketTwo = req.flash('idTicketTwo')
        const flightMotChieu = req.flash('flightMotChieu')
        const flightKhuHoi = req.flash('flightKhuHoi')

        const dataUser = {
            username: username[0],
            gender: gender,
            date: date,
            identify: identify,
            email: email[0],
            phone: phone[0],
            location: location
        }

        res.render('inforcustomer', { data: data[0], userI: userI[0], dataUser, idTicketOne: idTicketOne[0], idTicketTwo: idTicketTwo[0], flightMotChieu: flightMotChieu[0], flightKhuHoi: flightKhuHoi[0] })
    }

    // [GET] / list_book
    list_book(req, res) {
        res.render('list_book')
    }

    // [GET] / detail_book
    async detail_book(req, res) {
        const id = req.params.id
        let ticket
        await Ticket.findById(id)
            .populate('customerId')
            .populate('flightId')
            .then(detail => ticket = detail)
            .catch(error => console.log(error))
        res.render('detail_book', { title: 'Thông tin chi tiết vé', ticket: mongooseToObject(ticket)})
    }

    // [GET] / history_book
    async history_book(req, res) {
        const jwtToken = req.cookies.accessToken
        let userId
        let myTicket
        if (jwtToken !== undefined) {
            const decodedToken = jwt.verify(jwtToken, process.env.ACCESS_TOKEN_SECRET);
            userId = decodedToken.id;
        }
        
        await Ticket.find({buyerId: userId})
            .populate('flightId')
            .then(ticket => myTicket = ticket)
            .catch(error => console.log(error))

        res.render('history_book', {myTicket: multipleMongooseToObject(myTicket), title: 'Lịch sử đặt vé'})
    }

    // [GET] / information_user
    async information_user(req, res) {
        const jwtToken = req.cookies.accessToken
        let userId
        let myUser
        if (jwtToken !== undefined) {
            const decodedToken = jwt.verify(jwtToken, process.env.ACCESS_TOKEN_SECRET);
            userId = decodedToken.id;
        }

        // tim kiem thong tin ca nhan cua user
        await User.findById(userId) 
            .then(user => myUser = user)
            .catch(error => console.log(error))

        res.render('information_user', { myUser: mongooseToObject(myUser), title: 'Thông tin cá nhân' })
    }

    // [GET] / service
    service(req, res) {
        res.render('service')
    }

    // [GET] / payment
    payment(req, res) {
        res.render('payment')
    }

    // [GET] / lien he
    lienHe(req, res) {
        res.render('Lienhe')
    }

    // [GET] / gioi thieu
    gioithieu(req, res) {
        res.render('gioithieu')
    }

    // [GET] / search
    search(req, res) {
        const idTicket = req.flash('id')
        res.render('search', { title: 'Tìm kiếm', idTicket })
    }

    // [GET] / register
    renderRegisterPage(req, res) {
        const name = req.flash('name')
        const username = req.flash('username')
        const phone = req.flash('phone')
        const email = req.flash('email')
        const password = req.flash('password')
        const cfpassword = req.flash('cfpassword')
        res.render('register', { title: 'Đăng ký', name, username, phone, email, password, cfpassword })
    }

    // [POST] / register
    async register(req, res) {
        const data = req.body
        let userExist
        let message = ''

        // kiem tra xem username da ton tai hay chua
        if (data.username !== '') {
            await User.findOne({ username: data.username })
                .then(user => {
                    if (user) {
                        userExist = true
                    }
                })
                .catch(error => console.log(error))
        }

        // validate form
        if (data.name === '') {
            message = 'Vui lòng nhập tên của bạn'
        } else if (data.phone === '') {
            message = 'Vui lòng nhập số điện thoại'
        } else if (data.username === '') {
            message = 'Vui lòng nhập username'
        } else if (userExist) {
            message = 'Username đã tồn tại'
        } else if (data.email === '') {
            message = 'Vui lòng nhập email'
        } else if (data.password === '') {
            message = 'Vui lòng nhập password'
        } else if (data.password.length < 6) {
            message = 'Mật khẩu phải có tối thiểu 6 ký tự'
        } else if (data.cfpassword === '') {
            message = 'Vui nhập xác nhận mật khẩu'
        } else if (data.password !== data.cfpassword) {
            message = 'Mật khẩu và xác nhận mật khẩu phải giống nhau'
        }

        if (message !== '') {
            req.flash('error', message)
            req.flash('name', data.name)
            req.flash('username', data.username)
            req.flash('phone', data.phone)
            req.flash('email', data.email)
            req.flash('password', data.password)
            req.flash('cfpassword', data.cfpassword)
            return res.redirect('/register')
        }

        try {
            // hash password
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(data.password, salt)
            let roleId
            await Role.findOne({ roleName: 'user' })
                .then(role => roleId = role._id)
                .catch(error => console.log(error))

            //create a new user
            const newUser = new User({
                username: data.username,
                password: hash,
                email: data.email,
                roleId: roleId,
                phoneNumber: data.phone,
                name: data.name
            });

            //save to database
            await newUser.save()
            // res.status(200).json(user)
            req.flash('success', 'Đăng ký thành công')
            res.redirect("/login");
        } catch (err) {
            res.status(500).json(err)
        }

    }

    // [GET] / login
    renderLoginPage(req, res) {
        const username = req.flash('username')
        res.render('login', { username })
    }

    // [POST] / login
    async login(req, res) {
        const data = req.body
        let message = ''

        // validate form
        if (data.username === '') {
            message = 'Vui lòng nhập username'
        } else if (data.password === '') {
            message = 'Vui lòng nhập password'
        }

        if (message !== '') {
            req.flash('error', message)
            req.flash('username', data.username)
            return res.redirect('/login')
        }

        try {
            let validPassword = ''
            const user = await User.findOne({ username: req.body.username }).populate('roleId')
            // Kiểm tra xem có user hay không
            if (user !== null) {
                validPassword = await bcrypt.compare(req.body.password, user.password)
                if (!validPassword) {
                    req.flash('error', 'Sai tên đăng nhập hoặc mật khẩu')
                    req.flash('username', req.body.username)
                    return res.redirect('/login')
                }
            }

            if (user && validPassword) {
                // Nếu username và password hợp lệ
                // Tạo accessToken 
                const accessToken = jwt.sign({
                    id: user.id,
                    role: user.roleId.roleName
                },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: "2h" }
                );

                // Tạo refreshToken
                const refreshToken = jwt.sign({
                    id: user.id,
                    role: user.roleId.roleName
                },
                    process.env.ACCESS_REFRESH_SECRET,
                    { expiresIn: "1d" }
                );

                // Thêm các token vào cookie
                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                })

                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                })

                const { password, ...others } = user._doc;
                const redirectUrl = req.cookies.redirectUrl || '/';
                req.flash('success', 'Đăng nhập thành công')
                res.clearCookie('redirectUrl');
                res.redirect(redirectUrl);
            }
        } catch (err) {
            res.status(500).json(err)
        }
    }

    // [POST] /requestRefreshToken
    async requestRefreshToken(req, res) {
        //take refresh token from user
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json("Ban chua dang nhap")
        jwt.verify(refreshToken, process.env.ACCESS_REFRESH_SECRET, (err, user) => {
            if (err) return console.log(err)
            // create new access token, refresh token
            const newAccessToken = jwt.sign({
                id: user.id
            },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "2h" }
            );
            const newRefreshToken = jwt.sign({
                id: user.id
            },
                process.env.ACCESS_REFRESH_SECRET,
                { expiresIn: "1d" }
            );
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            })
            res.status(200).json({ accessToken: newAccessToken })
        })
    }

    async logout(req, res) {
        res.clearCookie('refreshToken')
        res.clearCookie('accessToken')
        req.flash('success', 'Đăng xuất thành công')
        res.redirect('/')
    }

    // [POST] / search ticket
    searchTicket(req, res) {
        const id = req.body.ticketId
        let message = ''

        // Kiểm tra thông tin
        if (id === '') {
            message = 'Vui lòng nhập mã số vé'
        } else if (id.length != 24) {
            message = 'Mã số vé không tồn tại'
        }

        if (message !== '') {
            req.flash('error', message)
            req.flash('id', id)
            return res.redirect('/search')
        }

        // tim ve bang ma so ve
        Ticket.findById(id)
            .populate('customerId')
            .populate('planeId')
            .populate('flightId')
            .then(ticket => {
                if (ticket) {
                    return res.render('search', { ticket: mongooseToObject(ticket) })
                } else {
                    res.render('search', { message: 'Mã số vé không tồn tại' })
                }
            })
            .catch(error => console.log(error))
    }

    // [POST] / search flight
    async searchFlight(req, res) {
        const data = req.body
        const { fromPlace, toPlace, dateStart, dateRoundTrip, typeTicket } = data

        const daysOfWeek = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy']
        let airLightId, motChieu = [], khuHoi = []
        let messageMotChieu, messageKhuHoi
        let message = ''
        const now = new Date(Date.now())
        // convert time
        const date = `${now.getFullYear()}-${now.getMonth() + 1 <= 9 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1}-${now.getDate() <= 9 ? '0' + now.getDate() : now.getDate()}`

        // validate form
        if (data.fromPlace === '') {
            message = 'Vui lòng chọn nơi đi'
        } else if (data.toPlace === '') {
            message = 'Vui lòng chọn nơi đến'
        } else if (data.dateStart === '') {
            message = 'Vui lòng chọn ngày đi'
        } else if (data.dateStart < date) {
            message = 'Không thể chọn ngày quá khứ'
        } else if (data.typeTicket === 'khuhoi') {
            if (data.dateRoundTrip === '') {
                message = 'Vui lòng chọn ngày về'
            } else if (dateStart > dateRoundTrip) {
                message = 'Ngày về phải lớn hơn ngày đi'
            }
        }


        if (message !== '') {
            req.flash('error', message)
            req.flash('noidi', fromPlace)
            req.flash('noiden', toPlace)
            req.flash('ngaydi', dateStart)
            req.flash('ngayden', dateRoundTrip)
            req.flash('loaive', typeTicket)
            return res.redirect('/')
        }

        const tempMotChieu = new Date(dateStart)
        const tempKhuHoi = new Date(dateRoundTrip)
        const dayOfWeekMotChieu = daysOfWeek[tempMotChieu.getDay()]
        const dayOfWeekKhuHoi = daysOfWeek[tempKhuHoi.getDay()]

        const ticketMotChieu = {
            fromPlaceMotChieu: fromPlace,
            toPlaceMotChieu: toPlace,
            dayOfWeekMotChieu,
            day: tempMotChieu.getDate(),
            month: tempMotChieu.getMonth() + 1,
            year: tempMotChieu.getFullYear(),
            type: 'motchieu',
        }
        const ticketKhuHoi = {
            fromPlaceKhuHoi: toPlace,
            toPlaceKhuHoi: fromPlace,
            dayOfWeekKhuHoi,
            day: tempKhuHoi.getDate(),
            month: tempKhuHoi.getMonth() + 1,
            year: tempKhuHoi.getFullYear(),
            type: 'khuhoi'
        }

        // tim ma so cua hang ve
        await AirLine.findOne({ rank: data.airLight })
            .then(airLight => airLightId = airLight._id)
            .catch(error => console.log(error))
        
        // tim kiem theo cac tieu chi
        let search = {
            fromPlace: data.fromPlace,
            toPlace: data.toPlace,
            airLightId: airLightId
        }

        // neu co chon option khu hoi thi tim kiem chuyen bay khu hoi
        if (data.typeTicket === 'khuhoi') {
            let searchKhuHoi = {
                fromPlace: data.toPlace,
                toPlace: data.fromPlace,
                airLightId: airLightId
            }

            // tim chuyen bay khu hoi
            await DetailFlight.find(searchKhuHoi)
                .populate('flightId')
                .then(details => khuHoi = details)
                .catch(error => console.log(error))

            // kiem tra xem co chuyen bay khu hoi nao khong
            if (khuHoi !== []) {
                khuHoi = khuHoi.filter(temp => convertDate(temp.dateStart) === data.dateRoundTrip && temp.availableSeat > 0)
                if (khuHoi.length === 0) {
                    khuHoi = []
                    messageKhuHoi = 'Không tìm thấy chuyến bay khứ hồi nào!'
                }
            }
        }

        // tim chuyen bay mot chieu
        await DetailFlight.find(search)
            .populate('flightId')
            .then(details => motChieu = details)
            .catch(error => console.log(error))

        // kiem tra xem co chuyen bay mot chieu nao khong
        if (motChieu !== []) {
            motChieu = motChieu.filter(temp => convertDate(temp.dateStart) === data.dateStart && temp.availableSeat > 0)
            if (motChieu.length === 0) {
                motChieu = []
                messageMotChieu = 'Không tìm thấy chuyến bay một chiều nào!'
            }
        }


        // tra ra ket qua
        if (motChieu.length === 0 && khuHoi.length === 0) {
            return res.render('searchflyteam', { message: messageMotChieu, messageKhuHoi: messageKhuHoi })
        } else if (motChieu.length === 0) {
            return res.render('searchflyteam', { khuHoi: multipleMongooseToObject(khuHoi), message: messageMotChieu, ticketKhuHoi })
        } else if (khuHoi.length === 0) {
            return res.render('searchflyteam', { motChieu: multipleMongooseToObject(motChieu), messageKhuHoi: messageKhuHoi, ticketMotChieu })
        } else {
            return res.render('searchflyteam', { motChieu: multipleMongooseToObject(motChieu), khuHoi: multipleMongooseToObject(khuHoi), ticketMotChieu, ticketKhuHoi })
        }

    }

    // [POST] / addTicket
    async addTicket(req, res) {
        const data = req.body
        let userId, ticketKhuHoi, customer
        const jwtToken = req.cookies.accessToken
        let detailMotChieu, detailKhuHoi
        let listSeatMotChieu, listSeatKhuHoi
        const { username, gender, date, identify, email, phone, location } = data
        let message = ''

        // Xu ly loi
        if (data.username === '') {
            message = 'Vui lòng nhập họ và tên'
        } else if (data.gender === '') {
            message = 'Vui lòng cung cấp giới tính'
        } else if (data.date === '') {
            message = 'Vui lòng cung cấp ngày sinh'
        } else if (data.identify === '') {
            message = 'Vui lòng cung cấp CMND/ CCCD'
        } else if (data.email === '') {
            message = 'Vui lòng cung cấp email'
        } else if (data.phone === '') {
            message = 'Vui lòng cung cấp số điện thoại'
        } else if (data.location === '') {
            message = 'Vui lòng cung cấp địa chỉ'
        }

        // thong bao loi
        if (message !== '') {
            req.flash('error', message)
            req.flash('username', username)
            req.flash('gender', gender)
            req.flash('date', date)
            req.flash('identify', identify)
            req.flash('email', email)
            req.flash('phone', phone)
            req.flash('location', location)
            // Luu lai du lieu cu khi phat sinh loi
            req.flash('idTicketOne', data.idTicketOne)
            req.flash('idTicketTwo', data.idTicketTwo)
            req.flash('flightMotChieu', data.flightMotChieu)
            req.flash('flightKhuHoi', data.flightKhuHoi)

            return res.redirect('/inforcustomer')
        }

        // tim kiem user
        if (jwtToken !== undefined) {
            const decodedToken = jwt.verify(jwtToken, process.env.ACCESS_TOKEN_SECRET);
            userId = decodedToken.id;
        }

        // Tìm chuyến bay để lấy list các ghế đã đặt
        await Ticket.find({ flightId: data.flightMotChieu })
            .then(ticket => {
                if (ticket) {
                    listSeatMotChieu = ticket.map(temp => temp.seatNumber)
                }
            })
            .catch(error => console.log(error))

        await Customer.findOneAndUpdate({ phoneNumber: data.phone }, { $set: { identityCard: data.identify, gender: data.gender, address: data.location, dateOfBirth: data.date, customerName: data.username, email: data.email } }, { new: true, upsert: true })
            .then(user => customer = user)
            .catch(error => console.log(error))
        // Tìm chuyến bay để lấy list các ghế đã đặt
        if (data.flightKhuHoi !== '') {
            await Ticket.find({ flightId: data.flightKhuHoi })
                .then(ticket => listSeatKhuHoi = ticket.map(temp => temp.seatNumber))
                .catch(error => console.log(error))

            // Tim kiem chuyen bay da dat de lay gia ve
            await DetailFlight.findById(data.idTicketTwo)
                .populate('airLightId')
                .populate('flightId')
                .then(detail => detailKhuHoi = detail)
                .catch(error => console.log(error))

            // create ve khu hoi
            ticketKhuHoi = new Ticket({
                seatNumber: chooseSeat(listSeatKhuHoi),
                ticketPrice: detailKhuHoi.price,
                ticketType: 'Khứ hồi',
                ticketClass: detailKhuHoi.airLightId.rank,
                planeId: detailKhuHoi.flightId.planeId,
                customerId: customer._id,
                buyerId: userId,
                flightId: detailKhuHoi.flightId._id,
            })
        }

        // tim kiem detail ve theo id
        await DetailFlight.findById(data.idTicketOne)
            .populate('airLightId')
            .populate('flightId')
            .then(detail => detailMotChieu = detail)
            .catch(error => console.log(error))


        // create ve mot chieu
        const ticketMotChieu = new Ticket({
            seatNumber: chooseSeat(listSeatMotChieu),
            ticketPrice: detailMotChieu.price,
            ticketType: 'Một chiều',
            ticketClass: detailMotChieu.airLightId.rank,
            planeId: detailMotChieu.flightId.planeId,
            customerId: customer._id,
            buyerId: userId,
            flightId: detailMotChieu.flightId._id,
        })

        // luu ve
        await ticketMotChieu.save()
        if (ticketKhuHoi) {
            await ticketKhuHoi.save()
            await DetailFlight.updateOne({_id: data.idTicketTwo}, {$inc: {availableSeat: -1}}) // cap nhat so ve con lai
            await Flight.updateOne({_id: data.flightKhuHoi}, {$inc: {availableSeat: -1}}) // cap nhat so ve
        }

        // cap nhat so ve
        await DetailFlight.updateOne({_id: data.idTicketOne}, {$inc: {availableSeat: -1}})
        await Flight.updateOne({_id: data.flightMotChieu}, {$inc: {availableSeat: -1}})

        req.flash('success', 'Đặt vé thành công')
        res.redirect('/')
    }
}

module.exports = new SiteController();
