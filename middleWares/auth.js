const jwt = require('jsonwebtoken');
const config = require('config');
const debug = require('debug');

const log = debug('app::authentication middleware');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No token provided');

    try{
        const decoded = jwt.verify(token, config.get('privateKey'));
        req.user = decoded;
        next();
    } catch (exception) {
        res.status(400).send('Invalid token');
    }
}