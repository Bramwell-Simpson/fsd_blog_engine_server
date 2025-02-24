const articles = require("../controllers/articles.controllers")
const auth = require("../lib/middleware");

module.exports = function(app) {

    app.route("/articles")
        .get(articles.getAll)
        .post(auth.isAuthenticated, articles.create);

    app.route("/articles/:id")
        .get(articles.getOne)
        .patch(auth.isAuthenticated, articles.updateArticle)
        .delete(auth.isAuthenticated, articles.deleteArticle);
}

//auth.isAuthenticated, 