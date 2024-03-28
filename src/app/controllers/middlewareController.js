const jwt = require('jsonwebtoken');

const middlewareController = {
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            // Bearer 12345
            const accessToken = token.split(' ')[1];
            jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                if (err) {
                    if (err.name === 'TokenExpiredError') {
                        res.clearCookie('accessToken');
                        res.clearCookie('refreshToken');
                        return res.redirect('/login')
                    }
                    // Nếu token không hợp lệ, chuyển hướng tới trang đăng nhập
                } else {
                    req.user = user;
                    next();
                }
            });
        } else {
            // Nếu không có token, kiểm tra xem người dùng đã đăng nhập hay chưa
            if (req.cookies.accessToken) {
                // Nếu đã đăng nhập, tiếp tục thực hiện request
                next();
            } else {
                // Nếu chưa đăng nhập, chuyển hướng tới trang đăng nhập
                res.cookie('redirectUrl', req.url);
                return res.redirect('/login')
            }
        }
    }
};

module.exports = middlewareController;