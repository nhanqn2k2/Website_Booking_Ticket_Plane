const { multipleMongooseToObject, mongooseToObject } = require('../../util/mongoose');
const Plane = require('../models/Plane')
const Ticket = require('../models/Ticket')
const Flight = require('../models/Flight')
const AirLine = require('../models/AirLine')
const DetailFlight = require('../models/DetailFlight')
const moment = require('moment')

class AdminController {

    // [GET] /
    login(req, res, next) {
        res.render('admin/login', { title: 'login', layout: 'adminLogin' })
    }

    // [GET] /
    index(req, res) {
        res.render('admin/home', { title: 'Trang chủ', layout: 'adminMain' })
    }

    // [GET] / add_plane
    addPlane(req, res) {
        const gioKhoiHanh = req.flash('dateStart')
        const gioDen = req.flash('hourEnd')
        const noidi = req.flash('fromPlace')
        const noiden = req.flash('toPlace')
        Plane.find({})
            .then(plane => res.render('admin/add_plane', { title: 'Thêm máy bay', layout: 'adminMain', plane: multipleMongooseToObject(plane), gioKhoiHanh, gioDen, noidi, noiden }))
            .catch(error => console.log(error))
    }

    // [GET] / add_user
    addUser(req, res) {
        res.render('admin/add_user', { title: 'Thêm người dùng', layout: 'adminMain' });
    }

    // [GET] / history_booked
    historyBooked(req, res) {
        res.render('admin/history_booked', { title: 'Lịch sử mua vé', layout: 'adminMain' });
    }

    // [GET] / history_plane
    historyPlane(req, res) {
        res.render('admin/history_plane', { layout: 'adminMain', title: 'Quản lý lịch sử' })
    }

    // [GET] / information_booked
    informationBooked(req, res) {
        res.render('admin/information_booked', { layout: 'adminMain', title: 'Chi tiết lịch sử mua vé' })
    }

    // [GET] / manage_plane
    managePlane(req, res) {
        Flight.find({})
            .then((data) => {
                return res.render('admin/manage_plane', { layout: 'adminMain', title: 'Quản lý chuyến bay', data: multipleMongooseToObject(data) })
            })
            .catch(error => console.log(error))
    }

    // [GET] / update/manage_plane
    async updateManagerPlane(req, res) {
        const flightId = req.params.id
        let planeName

        await Flight.findById(flightId)
            .populate('planeId')
            .then(flight => planeName = flight.planeId.planeName)
            .catch(error => console.log(error))

        DetailFlight.findOne({ flightId: flightId })
            .populate('flightId')
            .populate('airLightId')
            .then(flight => res.render('admin/add_plane', { layout: 'adminMain', title: 'Thông tin chuyến bay', flight: mongooseToObject(flight), planeName: planeName }))
            .catch(error => console.log(error))
    }

    // [POST] / add/manage_plane
    async addNewPlane(req, res) {
        const data = req.body
        const {dateStart, hourEnd, fromPlace, toPlace} = data

        let start = moment(dateStart).toDate()
        let end = moment(hourEnd).toDate()
        let now = moment()
        const totalSeat = 60
        const availableSeat = totalSeat
        let airlineE
        let airlineB
        let totalSeatE, totalSeatB
        let priceE, priceB
        let planeId, message = ''

        if (dateStart === '') {
            message = 'Vui lòng chọn ngày/ giờ khởi hành'
        } else if (start < now) {
            message = 'Không được chọn ngày ở quá khứ'
        } else if (hourEnd === '') {
            message = 'Vui lòng chọn ngày/ giờ hạ cánh'
        } else if(start >= end) {
            message = 'Ngày/ giờ hạ cánh phải lớn hơn ngày/ giờ khởi hành'
        } else if (fromPlace === '') {
            message = 'Vui lòng chọn nơi đi'
        } else if (toPlace === '') {
            message = 'Vui lòng chọn nơi đến'
        }

        if (message !== '') {
            req.flash('error', message)
            req.flash('dateStart', dateStart)
            req.flash('hourEnd', hourEnd)
            req.flash('fromPlace', fromPlace)
            req.flash('toPlace', toPlace)
            return res.redirect('/admin/add_plane')
        }

        if (data.airline === 'Phổ thông') {
            totalSeatE = totalSeat - 20
            totalSeatB = totalSeat - totalSeatE
            priceE = data.distance * 2300
            priceB = data.distance * 2300 * 2.3
        } else {
            totalSeatE = totalSeat - (totalSeat - 20)
            totalSeatB = totalSeat - totalSeatE
            priceE = data.distance * 2300 * 2.3
            priceB = data.distance * 2300
        }

        // Tìm hạng vé
        await AirLine.findOne({ rank: data.airline })
            .then(airline => airlineE = airline._id)
            .catch(error => console.log(error))

        // Tìm hạng vé còn lại khác với cái ở trên
        await AirLine.findOne({ rank: { $ne: data.airline } })
            .then(airline => airlineB = airline._id)
            .catch(error => console.log(error))

        // Tìm máy bay theo tên còn lại khác với cái ở trên
        await Plane.findOne({planeName: data.plane})
            .then(plane => planeId = plane._id)
            .catch(error => console.log(error))

        // Tạo ra flight
        const flight = new Flight({
            dateStart: data.dateStart,
            fromPlace: data.fromPlace,
            toPlace: data.toPlace,
            hourStart: data.dateStart,
            hourEnd: data.hourEnd,
            distance: data.distance,
            totalSeat: totalSeat,
            availableSeat: availableSeat,
            planeId: planeId,
            creatorId: '6436fb65b4fd17688a288899'
        })

        // Tạo ra chi tiết flight
        const detailFlightE = new DetailFlight({
            totalSeat: totalSeatE,
            availableSeat: totalSeatE,
            price: priceE,
            airLightId: airlineE,
            flightId: flight._id,
            fromPlace: data.fromPlace,
            toPlace: data.toPlace,
            dateStart: data.dateStart
        })

        const detailFlightB = new DetailFlight({
            totalSeat: totalSeatB,
            availableSeat: totalSeatB,
            price: priceB,
            airLightId: airlineB,
            flightId: flight._id,
            fromPlace: data.fromPlace,
            toPlace: data.toPlace,
            dateStart: data.dateStart
        })

        await flight.save()
        await detailFlightE.save()
        await detailFlightB.save()

        req.flash('success', 'Thêm chuyến bay thành công')
        res.redirect('/admin/manage_plane')
    }

    // [POST] / add/manage_plane
    async updatePlane(req, res) {
        const id = req.params.id
        const data = req.body
        let price = data.price.split(" ")[0]
        price = parseInt(price.replace(/,/g, ''));

        // tạo ra dữ liệu update
        let detailFlight = {
            totalSeat: data.totalSeat,
            availableSeat: data.availableSeat,
            price: price,
        }

        let flight = {
            dateStart: data.dateStart,
            fromPlace: data.fromPlace,
            toPlace: data.toPlace,
            hourStart: data.dateStart,
            hourEnd: data.hourEnd,
        }

        // thực hiện tìm và update
        await DetailFlight.findOneAndUpdate({ _id: data.detailId }, detailFlight, { new: true })
            .then(data => console.log(data))
            .catch(error => console.log(error))

        await Flight.findOneAndUpdate({ _id: id }, flight, { new: true })
            .then(data => console.log(data))
            .catch(error => console.log(error))


        req.flash('success', 'Chỉnh sửa thành công')
        res.redirect('/admin/manage_plane')
    }

    // [GET] / manage_sales
    manageSale(req, res) {
        const price = req.flash('price')
        const date = req.flash('date')
        res.render('admin/manage_sales', { layout: 'adminMain', title: 'Thống kê thu nhập', price: price[0], date: date[0] })
    }

    // [GET] / manage_user
    manageUser(req, res) {
        res.render('admin/manage_user', { layout: 'adminMain', title: 'Quản lý khách hàng' })
    }

    // [GET] / admin_information_user
    admin_information_user(req, res) {
        res.render('admin/admin_information_user', { layout: 'adminMain', title: 'Thông tin chi tiết khách hàng' })
    }

    async getSales(req, res) {
        const data = req.body
        let price, allTicket, message = ''
        const now = new Date(Date.now())
        const date = `${now.getFullYear()}-${now.getMonth() <= 9 ? '0' + (now.getMonth() + 1):now.getMonth()+1}-${now.getDate() <= 9 ? '0' + now.getDate():now.getDate()}`

        if (data.departure_datetime === '') {
            message = 'Vui lòng chọn thời gian cần thống kê'
        } else if (data.departure_datetime > date) {
            message = 'Không được chọn ngày của tương lai'
        }

        if (message !== '') {
            req.flash('error', message)
            req.flash('date', data.departure_datetime)
            return res.redirect('/admin/manage_sales')
        }
    
        const startTime = moment(data.departure_datetime).startOf('day').toDate();
        const endTime = moment(data.departure_datetime).endOf('day').toDate();

        await Ticket.find({ createdAt: { $gte: startTime, $lte: endTime } })
            .then(ticket => allTicket = ticket)
            .catch(error => console.log(error))

        allTicket = allTicket.map(data => data.ticketPrice)

        price = allTicket.reduce((total, currentValue) => {
            return total + currentValue
        }, 0)
        
        req.flash('price', price.toLocaleString('en-US') + " VNĐ")
        return res.redirect('/admin/manage_sales')
    }
}

module.exports = new AdminController();
