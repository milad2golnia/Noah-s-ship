const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.sendSatus(401).send('Access denied. No token provided');

    try{
        const decoded = jwt.verify(token, config.get('privateKey'));
        req.user = decoded;
        next();
    } catch (exception) {
        res.sendSatus(400).send('Invalid token');
    }
}