const users = require("../models/users.models");
const joi = require("joi");
const cookieParser = require("cookie-parser");

const addNewUser = (req, res) => {
    
    const schema = joi.object({
        "first_name": joi.string().required(),
        "last_name": joi.string().required(),
        "email": joi.string().required(),
        "password": joi.string().required()
    });

    const {error} = schema.validate(req.body);
    if(error)
    {
        return res.status(400).send(error.details[0].message);
    }

    let user = Object.assign({}, req.body);

    users.addNewUser(user, (err, id) => {
        if(err)
        {
            return res.sendStatus(500);
        }

        return res.status(201).send({user_id: id});
    })
}

const getIDFromToken = (req, res) => {
    
    token = res.headers.cookie.split("=")[1];
    
    return res.sendStatus(500);
}

const authenticateUser = (req, res) => {
    
    const schema = joi.object({
        "email": joi.string().required(),
        "password": joi.string().required()
    });

    const {error} = schema.validate(req.body);
    if(error)
    {
        return res.status(400).send(error.details[0].message);
    }

    users.authenticateUser(req.body.email, req.body.password, (err, id) => {

        if(err === 404) {
            return res.status(404).send("Invalid email/password");
        }
        if(err)
        {
            console.log(err);
            return res.status(500);
        }

        users.getToken(id, (err, token) => {
            if(err)
            {
                console.log(err);
                return res.sendStatus(500);
            }

            if(token)
            {
                console.log("in if statment");

                res.set("Set-Cookie", `session=${token}`);

                return res.status(200).send({
                    user_id: id,
                    session_token: token
                });
            }
            else
            {
                console.log("in else statement - how");

                users.setToken(id, (err, token) => {
                    if(err)
                    {
                        res.sendStatus(500);
                    }

                    res.set("Set-Cookie", `session=${token}`);

                    return res.status(200).send({
                        user_id: id,
                        token: token
                    });
                })
            }
        });
    });
}

/*
const setToken = (req, res) => {
    return res.sendStatus(500);
}

const getToken = (req, res) => {
    return res.sendStatus(500);
} */

const removeToken = (req, res) => {

    console.log(req.headers.cookie)

    token = req.headers.cookie.split("=")[1];

    if(token === "")
    {
        return res.status(401).send("Already Logged out");
    }

    users.removeToken(token, (err) => {
        
        res.set("Set-Cookie", "session=");
        return res.status(200).send("Logged Out " + token);
    })
}

module.exports = {
    addNewUser: addNewUser,
    getIDFromToken: getIDFromToken,
    authenticateUser: authenticateUser,
    //setToken: setToken,
    //getToken: getToken,
    //getIDFromToken: getIDFromToken,
    removeToken: removeToken
}