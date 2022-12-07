const comments = require("../models/comments.models");
const joi = require("joi");

const getAll = (req, res) => {

    let id = parseInt(req.params.id);

    comments.getAllComments(id, (err, results) => {

        if(err)
        {
            return res.sendStatus(500);
        }

        return res.status(200).send(results);
    });
}

const create = (req, res) => {

    let article_id = parseInt(req.params.id);
    console.log(article_id);

    const schema = joi.object({
        "comment_text": joi.string().required(),
    })

    const {error} = schema.validate(req.body);
    if(error)
    {
        return res.status(400).send(error.details[0].message);
    }

    let comment = Object.assign({}, req.body);

    comments.createComment(comment, article_id, (err, id) => {

        if(err)
        {
            return res.status(500).send("Error: " + err);
        }

        return res.status(201).send({comment_id: id});
    })
}

const deleteComment = (req, res) => {
    
    let id = parseInt(req.body.comment_id);
    console.log(id);
    
    comments.deleteComment(id, (err) => {
        
        if(err)
        {
            console.log(err);
            return res.sendStatus(500);
        }

        return res.sendStatus(200);
    })

}

module.exports = {
    getAll: getAll,
    create: create,
    deleteComment: deleteComment
}