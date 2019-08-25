const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer', '')
        const decoded = jwt.verify(token, 'Still learning')
        const user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token
        })

        if (!user) {
            throw new Error()

        }
        //create the individual token, that makes it possible to logout without loggin out on every single device.
        user.token = token
        req.user = user
        next()
    } catch (e) {
        console.log(e)
        res.status(401).send({
            error: 'Please authenticate'
        })
    }

}

module.exports = auth