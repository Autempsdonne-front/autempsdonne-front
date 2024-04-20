// authentication.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Accès refusé. Pas de jeton fourni.');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send('Jeton invalide.');
    }
};
