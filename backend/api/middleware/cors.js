module.exports = function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        res.sendStatus(204);
    } else {
        next();
    }
};
