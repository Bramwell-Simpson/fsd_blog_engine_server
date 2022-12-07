const users = require("../controllers/users.controllers");

const isAuthenticated = function(req, res, next) {
    let token = req.headers.cookie.split("=")[1];

    if (token === "")
    {
        return res.sendStatus(401);
    }

    next();
};

module.exports = {
    isAuthenticated: isAuthenticated
}