const users = require("../models/users.models");
const jwt = require("jsonwebtoken");

const isAuthenticated = function(req, res, next) {

    let token = req.get("X-Authorization");

    users.getIDFromToken(token, (err, id) => {
    
        if(err || !id) {
            return res.sendStatus(401);
        }

        next();
    });
};

module.exports = {
    isAuthenticated: isAuthenticated
}