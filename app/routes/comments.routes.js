const comments = require("../controllers/comments.controllers");
const auth = require("../lib/middleware");

module.exports = function(app) {

    app.route("/articles/:id/comments")
        .get(comments.getAll)
        .post(comments.create)

    app.route("/comments/:cmid")
        .delete(auth.isAuthenticated, comments.deleteComment)
}
//auth.isAuthenticated