const articles = require("../controllers/articles.controllers")

module.exports = function(app) {

    app.route("/articles")
        .get()
        .post();

    app.route("/articles/:id")
        .get()
        .patch()
        .delete();
}