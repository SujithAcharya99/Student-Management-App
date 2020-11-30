const jwt = require('jsonwebtoken');
const User = require('../models/users');

const auth = async (req, res, next) => {
    // console.log('auth middelware');
    // next();
    try {
        const token = req.header('Authorization').replace('Bearer ', '');

        // console.log(token);
        console.log('token found');
        const decoded = jwt.verify(token,'thisismynewcourse')
        console.log('decoding success');
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id , 'tokens.token': token });
        console.log('user found');
        if (!user) {
            throw new Error();
        }
        //  req.token = token;
        // console.log('response success');
        req.user = user;

        next();
    } catch (e) {
        res.status(401).send({ error: 'Please Authenticate...!'});
    }

}

module.exports = auth;