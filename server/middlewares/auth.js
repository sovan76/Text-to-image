
import jwt from 'jsonwebtoken';


const userAuth = (req, res, next) => {

    const {token} = req.headers;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No token provided'
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.userId };
        next();
    } catch (error) {
        return res.status(401).json({
            success: false, 
            message: 'Invalid token'
        });
    }
};

export default userAuth;