const express = require('express');
const router = express.Router();


const adminController = require('../app/controllers/AdminController');

router.get('/login', adminController.login)
router.get('/add_plane', adminController.addPlane)
router.get('/add_user', adminController.addUser)
router.get('/history_booked/:id', adminController.historyBooked)

// Start Manager Flight
router.get('/history_plane', adminController.historyPlane)
router.get('/update_plane/:id', adminController.updateManagerPlane)
router.post('/add_plane', adminController.addNewPlane)
router.post('/update_plane/:id', adminController.updatePlane)
// End Manager Flight

// Start History ticket
router.get('/information_booked/:id', adminController.informationBooked)
// End History ticket

router.get('/manage_plane', adminController.managePlane)
router.get('/manage_sales', adminController.manageSale)

// Start manager user
router.get('/manage_user', adminController.manageUser)
router.get('/admin_information_user/:id', adminController.admin_information_user)
// End manager user
router.post('/manage_sales', adminController.getSales)

router.get('/home', adminController.index);

module.exports = router;
