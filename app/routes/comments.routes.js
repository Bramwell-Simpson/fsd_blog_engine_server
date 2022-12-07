const comments = require("../controllers/comments.controllers");
const auth = require("../lib/middleware");

module.exports = function(app) {

    app.route("/articles/:id/comments")
        .get(comments.getAll)
        .post(auth.isAuthenticated, comments.create)
        .delete(auth.isAuthenticated, comments.deleteComment)
}