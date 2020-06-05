module.exports = function (req, res, next) {
    if (!req.session.isAuthenticated) {
        res.status(401).end();

        return;
    }

    next();
};