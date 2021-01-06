const jwt = require('jsonwebtoken');
const User = require('../models/users');

const auth = async (req, res, next) => {


    // try {
    //     const token = req.headers.cookie.replace('jwt=', '');

    //     const decoded = jwt.verify(token, 'thisismynewcourse')
    //     // console.log('decoding success');
    //     // console.log('decoded', decoded);

    //     // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //     const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
    //     // console.log('user found');
    //     if (!user) {
    //         throw new Error();
    //     }
    //     //  req.token = token;
    //     // console.log('response success');
    //     req.user = user;
    //     req.token = token
    //     next();
    // } catch (error) {
    //     res.status(401).send({ error: 'Please Authenticate...!' });

    // }
    // console.log('auth middelware');
    // next();
    // try {
    // const token = req.header('Authorization').replace('Bearer ', '');

    // console.log(req.headers.cookie);

    // console.log(token);
    // console.log('token found');
    const token = req.headers.cookie.replace('jwt=', '');

    // token = token.replace('io=',' ');
    // console.log(typeof(token));

    const va = token
    // console.log(va)
    // console.log(va.split(' '))
    const value = va.split(' ');
    // console.log(value.length)
    // console.log(value)
    if (value.length === 2) {
        try {
            // console.log(value[0])

            const size = value[0].length;
            // console.log(size);
            if (size !== 150) {
                const size_2 = value[1].length;
                const newToken = value[1].slice(0, size_2)
                // console.log('newtoken::', typeof (newToken))

                const decoded = jwt.verify(newToken, 'thisismynewcourse')
                // console.log('decoding success');
                // console.log('decoded', decoded);

                // const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findOne({ _id: decoded._id, 'tokens.token': newToken });
                // console.log('user found');
                if (!user) {
                    throw new Error();
                }
                //  req.token = token;
                // console.log('response success');
                req.user = user;
                req.token = newToken
                next();
            } else {
                const newToken = value[0].slice(0, size - 1)
                // console.log('newtoken::', typeof (newToken))

                const decoded = jwt.verify(newToken, 'thisismynewcourse')
                // console.log('decoding success');
                // console.log('decoded', decoded);

                // const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findOne({ _id: decoded._id, 'tokens.token': newToken });
                // console.log('user found');
                if (!user) {
                    throw new Error();
                }
                //  req.token = token;
                // console.log('response success');
                req.user = user;
                req.token = newToken
                next();
            }
            // const newToken = value[0].slice(0, size - 1)
            // // console.log('newtoken::', typeof (newToken))

            // const decoded = jwt.verify(newToken, 'thisismynewcourse')
            // console.log('decoding success');
            // // console.log('decoded', decoded);

            // // const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // const user = await User.findOne({ _id: decoded._id, 'tokens.token': newToken });
            // // console.log('user found');
            // if (!user) {
            //     throw new Error();
            // }
            // //  req.token = token;
            // // console.log('response success');
            // req.user = user;
            // req.token = newToken
            // next();
        } catch (e) {
            res.status(401).send({ error: 'Please Authenticate...!' });
        }
    } else {
        try {
            const decoded = jwt.verify(token, 'thisismynewcourse')
            // console.log('decoding success');
            // console.log('decoded', decoded);

            // const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
            // console.log('user found');
            if (!user) {
                throw new Error();
            }
            //  req.token = token;
            // console.log('response success');
            req.user = user;
            req.token = token
            next();
        } catch (e) {
            res.status(401).send({ error: 'Please Authenticate...!' });
        }


    }
    // console.log('value::',value[0])
    // console.log('value slices',value.slice(0,value.length-1));
    /*
    
     const size = value[0].length;
     console.log(size);
     const newToken = value[0].slice(0, size - 1)
     console.log('newtoken::', typeof (newToken))

     const decoded = jwt.verify(newToken, 'thisismynewcourse')
     // console.log('decoding success');
     console.log('decoded', decoded);

     // const decoded = jwt.verify(token, process.env.JWT_SECRET);
     const user = await User.findOne({ _id: decoded._id, 'tokens.token': newToken });
     // console.log('user found');
     if (!user) {
         throw new Error();
     }
     //  req.token = token;
     // console.log('response success');
     req.user = user;
     req.token = newToken
     next();
 } catch (e) {
     res.status(401).send({ error: 'Please Authenticate...!' });

 }*/

}

module.exports = auth;