function crossOrigin(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); //SECURITY BUG: we should replace * later.
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, DELETE")
    next();
}

module.exports = crossOrigin;
