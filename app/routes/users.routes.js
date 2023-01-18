const users = require("../controllers/users.controllers");
const auth = require("../lib/middleware");

module.exports = function(app) {
    app.route("/users")
        .get(auth.isAuthenticated, users.getAllUsers)
        .post(auth.isAuthenticated, users.addNewUser)
        
    app.route("/login")
        .post(users.authenticateUser)

    app.route("/logout")
        .post(auth.isAuthenticated, users.removeToken)
}

//auth.isAuthenticated