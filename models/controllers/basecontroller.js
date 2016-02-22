const jwt = require('jwt-simple');

class BaseCtrl {
    constructor() {
        this.secret = 's3cr37';
    }

    getUserId(req, res) {
        if (!req.headers.authorization)
            return res.status(401).send();

        let token = req.headers.authorization.split(' ');
        let payload = jwt.decode(token[1], this.secret);
        return payload.sub;
    }

    isAuthenticated(req, res, next) {
        req.user_id = this.getUserId(req, res);
        if (req.user_id)
            return next();
    }
}

module.exports = BaseCtrl;
