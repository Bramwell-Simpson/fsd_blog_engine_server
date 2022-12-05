const users = require("../controllers/users.controllers");

module.exports = function(app) {
    app.route("/users")
        .post(users.addNewUser)
        //.get(users.getIDFromToken)
    
        
    app.route("/login")
        .post(users.authenticateUser)
        //.patch(users.setToken)
        //.get(users.getToken)

    app.route("/logout")
        .post(users.removeToken)
}