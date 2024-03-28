const siteRouter = require('./site')
const adminRouter = require('./admin')
const apiRouter = require('./api')
const auth = require('../app/controllers/auth')

function route(app) {
    app.use('/admin', auth.requireAdmin, adminRouter)
    app.use('/api', apiRouter)
    app.use('/', siteRouter)
}

module.exports = route;
