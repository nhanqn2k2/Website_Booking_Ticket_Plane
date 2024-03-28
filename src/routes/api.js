const express = require('express');
const router = express.Router();

const apiController = require('../app/controllers/ApiController')

router.get('/flight/detail', apiController.getDetailPlane)
router.get('/history', apiController.getHistoryPlane)
router.get('/history/:id', apiController.getCustomerHistory)
router.get('/history/detail/:id', apiController.getDetailTicket)
router.get('/customer', apiController.getCustomer)
router.get('/customer/detail/:id', apiController.getDetailCustomer)
router.get('/flight/detail/:id', apiController.getOneFlight)
router.post('/addTicket', apiController.addTicket)

module.exports = router;
