const db = require("../../database");

const getAllComments = (id, done) => {

    const sql = "SELECT * FROM comments WHERE article_id=?";
    let results = [];

    db.all(sql, [id], (err, rows) => {
        
        if(err)
        {
            console.log("Something went wrong " + err);
            return done(err);
        }


        rows.forEach((row) => {
            results.push({
                comment_id: row.comment_id,
                comment_text: row.comment_text,
                date_published: row.date_published,
                article_id: row.article_id
            });
        })

        return done(err, results);
    })
}

const createComment = (comment, id, done) => {

    let date = Date.now();
    const sql = "INSERT INTO comments (comment_text, date_published, article_id) VALUES (?,?,?)";

    let values = [comment.comment_text, date, id];

    db.run(sql, values, function(err) {
        
        if(err)
        {
            return done(err, null);
        }

        return done(null, this.lastID);
    });
}

const deleteComment = (id, done) => {

    const sql = "DELETE FROM comments WHERE comment_id=?";

    db.run(sql, [id], (err) => {

        return done(err);
    })
}

module.exports = {
    getAllComments: getAllComments,
    createComment: createComment,
    deleteComment: deleteComment
}