const users = require("../models/users.models");
const joi = require("joi");
const jwt = require('jsonwebtoken');

const getAllUsers = (req, res) => {
    users.getAllUsers((err, num_rows , results) => {
        if(err) {
            return res.sendStatus(500);
        }

        return res.status(200).send(results);
    })
}

const addNewUser = (req, res) => {
    
    const schema = joi.object({
        "first_name": joi.string().required(),
        "last_name": joi.string().required(),
        "email": joi.string().required().email(), //.email({ minDomainSegments: 2 })
        "password": joi.string().required().pattern(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/) //.pattern(new RegExp('((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,30})'))
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



const authenticateUser = (req, res) => {
    
    const schema = joi.object({
        "email": joi.string().required(), //.email({ minDomainSegments: 2 })
        "password": joi.string().required() //.pattern(new RegExp('((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,30})'))
    });

    const {error} = schema.validate(req.body);
    if(error)
    {
        return res.status(400).send(error.details[0].message);
    }

    users.authenticateUser(req.body.email, req.body.password, (err, id) => {

        if(err === 404) {
            return res.status(400).send("Invalid email/password");
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
                res.header("X-Authorization", token);

                return res.status(200).json({
                    user_id: id,
                    session_token: token
                });
            }
            else
            {
                users.setToken(id, (err, token) => {
                    if(err)
                    {
                        res.sendStatus(500);
                    }
                    
                    res.header("X-Authorization", token);
                    
                    return res.status(200).json({
                        user_id: id,
                        session_token: token
                    });
                })
            }
        });
    });
}

//This doesn't work for some reason but directly calling
//the model function from middleware does apparently?!
const getIDFromToken = (req, res) => {

    users.getIDFromToken(req, (err, id) => {
        
        if(err)
        {
            return err
        }

        return id;
    })
}

const setToken = (req, res) => {
    return res.sendStatus(500);
}

const getToken = (req, res) => {

    users.getToken(req, (err, token) => {
        if(err === 404)
        {
            return res.sendStatus(404)
        }
        else if (err)
        {
            return res.sendStatus(500);
        }

        return res.status(200).send({session_token: token})
    })

} 

const removeToken = (req, res) => {

    const token = req.header("X-Authorization");

    users.removeToken(token, (err) => {

        if(err) {
            return res.status(401).send("User already logged out")
        }
        else {
            return res.status(200).send("Logged Out");
        }
        
    })
}

module.exports = {
    getAllUsers: getAllUsers,
    addNewUser: addNewUser,
    getIDFromToken: getIDFromToken,
    authenticateUser: authenticateUser,
    //setToken: setToken,
    getToken: getToken,
    getIDFromToken: getIDFromToken,
    removeToken: removeToken
}