const jwt = require('jsonwebtoken');
const User = require('../models/users');

const auth = async (req, res, next) => {
    try {
        const token = req.headers.cookie.replace('jwt=', '')
        const decoded = jwt.verify(token, 'thisismynewcourse')
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        if (!user) {
            throw new Error();
        }
        req.user = user;
        req.token = token
        next();
    } catch (e) {
        res.status(401).send({ error: 'Please Authenticate...!' });
    }
}
module.exports = auth;
