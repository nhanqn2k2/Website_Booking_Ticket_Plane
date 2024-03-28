const jwt = require('jsonwebtoken')

function requireAdmin(req, res, next) {
    const token = req.cookies.accessToken;
    if (token) {
        // Verify the JWT token
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
            if (err) {
                // Token is invalid or expired
                return res.status(401).json({ message: 'Unauthorized' });
            } else if (decoded.role === 'admin') {
                // User is an admin, allow access to /admin routes
                req.user = decoded;
                next();
            } else {
                // User is not an admin, deny access to /admin routes
                return res.redirect('/')
            }
        });
    } else {
        // Token is missing
        return res.redirect('/login')
    }
}

function preventLoginForLoggedInUsers(req, res, next) {
    const token = req.cookies.accessToken
    if (token) {
        // Người dùng đã đăng nhập, chuyển hướng đến trang chính của ứng dụng
        return res.redirect('/');
    } else {
        // Người dùng chưa đăng nhập, cho phép truy cập trang đăng nhập
        next();
    }
}

module.exports = {
    requireAdmin, preventLoginForLoggedInUsers,
};

// const isAdmin = (req, res, next) => {
//     // const token = req.headers.authorization?.split(' ')[1];
//     const token = req.cookies.accessToken
//     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     console.log(decoded.role)
//     if (!token) {
//         return res.status(401).json({ message: 'No token provided.' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//         if (decoded.role !== 'admin') {
//             return res.status(403).json({ message: 'Access denied.' });
//         }
//         req.user = decoded;
//         next();
//     } catch (err) {
//         return res.status(401).json({ message: 'Invalid token.' });
//     }
// };