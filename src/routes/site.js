const express = require('express');
const router = express.Router();


const siteController = require('../app/controllers/SiteController');
const middlewareController = require('../app/controllers/middlewareController');
const auth = require('../app/controllers/auth')


const addTokenHeader = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (token) {
        req.headers['Authorization'] = `secretToken ${token}`;
    }
    next();
};
router.get('/searchflyteam', siteController.searchFlyTeam);
router.post('/searchFlight', siteController.searchFlight);

router.get('/inforcustomer', siteController.inforCustomer);
router.get('/list_book', siteController.list_book);
router.get('/detail_book/:id', siteController.detail_book);
router.get('/history_book', middlewareController.verifyToken, siteController.history_book);
router.get('/information_user', middlewareController.verifyToken, siteController.information_user);
router.get('/service', middlewareController.verifyToken,siteController.service);
router.get('/payment', siteController.payment);
router.get('/Lienhe', siteController.lienHe);
router.get('/gioithieu', siteController.gioithieu);

// register routes
router.get('/register', siteController.renderRegisterPage);
router.post('/register', siteController.register);

// login routers
router.get('/login', auth.preventLoginForLoggedInUsers, siteController.renderLoginPage);
router.post('/login', addTokenHeader,siteController.login);

// logout routers
router.get('/logout',  middlewareController.verifyToken, siteController.logout);

// search routes
router.get('/search', siteController.search);
router.post('/search', siteController.searchTicket)

// refesh access token routers
router.post('/refresh', siteController.requestRefreshToken);
// Ticket
router.post('/addTicket', siteController.addTicket)
// End ticket

router.get('/', siteController.index);

module.exports = router;