const articles = require("../models/articles.models");
const joi = require("joi");

const getAll = (req, res) => {
    articles.getAllArticles((err, num_rows, results) => {
        if(err)
        {
            return res.sendStatus(500);
        }

        return res.status(200).send(results);
    });
}

const create = (req, res) => {
    
    const schema = joi.object({
        "title": joi.string().required(),
        "author": joi.string().required(),
        "article_text": joi.string().required()
    });

    const {error} = schema.validate(req.body);
    if (error)
    {
        return res.status(400).send(error.details[0].message);
    }
    
    let article = Object.assign({}, req.body);

    articles.addNewArticle(article, (err, id) => {
        if (err)
        {
            return res.sendStatus(500);
        }

        return res.status(201).send({article_id: id});
    });
}

const getOne = (req, res) => {
    
    let article_id = parseInt(req.params.id);

    console.log(article_id);

    articles.getSingleArticle(article_id, (err, result) => {
        if(err === 404)
        {
            return res.sendStatus(404);
        }
        if (err)
        {
            return res.sendStatus(500);
        }

        return res.status(200).send(result);
    });
}

const updateArticle = (req, res) => {
    
    let article_id = parseInt(req.params.id);

    articles.getSingleArticle(article_id, (err, result) => {
        if(err === 404)
        {
            return res.sendStatus(404);
        }
        if (err === 500)
        {
            console.log(err);
            return res.sendStatus(500);
        }

        const schema = joi.object({
            "title": joi.string(),
            "author": joi.string(),
            "article_text": joi.string()
        });
    
        const {error} = schema.validate(req.body);
        if (error)
        {
            return res.status(400).send(error.details[0].message);
        }

        if(req.body.hasOwnProperty("title"))
        {
            result.title = req.body.title;
        }

        if(req.body.hasOwnProperty("author"))
        {
            result.author = req.body.author;
        }

        if(req.body.hasOwnProperty("article_text"))
        {
            result.article_text = req.body.article_text;
        }

        articles.updateArticle(article_id, result, (err, id) => {
            if(err) 
            {
                console.log(err);
                return res.sendStatus(500);
            }

            return res.sendStatus(200);
        })
    });
}

const deleteArticle = (req, res) => {
    
    let article_id = parseInt(req.params.id);

    articles.deleteArticle(article_id, (err) => {
        
        if(err === 404)
        {
            return res.sendStatus(404);
        }
    
        if(err)
        {
            console.log(err);
            return res.sendStatus(500);
        }
        
        return res.sendStatus(200)
    })
}

module.exports = {
    getAll: getAll,
    create: create,
    getOne: getOne,
    updateArticle: updateArticle,
    deleteArticle: deleteArticle
}