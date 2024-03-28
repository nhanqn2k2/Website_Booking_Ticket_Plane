const { multipleMongooseToObject, mongooseToObject } = require('../../util/mongoose');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const Plane = require('../models/Plane')
const Ticket = require('../models/Ticket')
const Flight = require('../models/Flight')
const AirLine = require('../models/AirLine')
const DetailFlight = require('../models/DetailFlight')
const Customer = require('../models/Customer')
const User = require('../models/User')

class ApiController {
    // [GET] / detail/manage_plane
    getDetailPlane(req, res) {
        const data = req.query

        // lấy ra detail flight có airLightId khác với airLightId hiện tại
        DetailFlight.findOne({ flightId: data.flightId, airLightId: { $ne: data.detailId } })
            .then(detail => res.json(detail))
            .catch(error => console.log(error))
    }

    // [GET] / history/manage_history
    getHistoryPlane(req, res) {
        Customer.find({})
            .then(customer => {
                if (customer.length === 0) {
                    res.json('Chưa có khách hàng nào mua vé')
                } else {
                    res.json(customer)
                }
            })
            .catch(error => console.log(error))
    }

    // [GET] / history
    getCustomerHistory(req, res) {
        Ticket.find({ customerId: req.params.id })
            .populate('planeId')
            .then(ticket => res.json(ticket))
            .catch(error => res.json(error))
    }

    // [GET] / detail/history
    async getDetailTicket(req, res) {
        const id = req.params.id
        await Ticket.findById(id)
            .populate('flightId')
            .populate('planeId')
            .then(detail => {
                if (detail === null) {
                    res.json({
                        status: failed,
                        message: 'Không tìm thấy vé nào có mã này'
                    })
                } else {
                    res.json(detail)
                }
            })
            .catch(error => res.json(error))
    }

    // [GET] / customer
    getCustomer(req, res) {
        Customer.find({})
            .then(customer => {
                let message = ''
                if (customer === null) {
                    res.json({
                        status: 'failed',
                        message: 'Hiện chưa có khách hàng nào'
                    })
                } else {
                    res.json({
                        status: 'success',
                        customer
                    })
                }
            })
            .catch(error => res.json(error))
    }

    // [GET] detail/ customer
    getDetailCustomer(req, res) {
        const id = req.params.id
        let data
        Ticket.find({ customerId: id })
            .populate('customerId')
            .then(ticket => {
                data = ticket
                return Ticket.countDocuments({ customerId: id })
            })
            .then(count => {
                return res.json({
                    status: 'success',
                    data,
                    count,
                })
            })
            .catch(error => res.json({
                status: 'failed',
                message: error
            }))
    }

    getOneFlight(req, res) {
        const id = req.params.id
        DetailFlight.findById(id)
            .populate('flightId')
            .then(detail => res.json(detail))
            .catch(error => console.log(error))
    }

    async addTicket(req, res) {
        const data = req.body
        const jwtToken = req.cookies.accessToken
        let userId = ''
        let userI

        if (jwtToken !== undefined) {
            const decodedToken = jwt.verify(jwtToken, process.env.ACCESS_TOKEN_SECRET);
            userId = decodedToken.id;
        }

        if (userId !== '') {
            await User.findById(userId)
                .then(user => userI = user)
                .catch(error => console.log(error))
        }
        req.flash('userI', userI)
        req.flash('data', data)
        return res.redirect('/inforcustomer')
    }
}

module.exports = new ApiController();

