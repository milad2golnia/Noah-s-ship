const express = require('express');
const debug = require('debug');
const joi = require('@hapi/joi');
const userDB = require('../models/user');

const log = debug('app::user');
const router = express.Router();


router.post('/', async (req, res)=>{
    const schema = joi.object({
        name: joi.string().min(1).max(250).required(),
        email: joi.string().email().required(),
        password: joi.string().min(8).max(250).required(),
        phone: joi.string().min(1).max(250)             //BUG: shoud set the length, maybe 11
    }).unknown(true);                                   //BUG: shouldn't use unkown

    const result = schema.validate(req.body);

    if(result.error){
        log('Invalid request: ', result.error);
        return res.status(400).send({
            message: "required fields are: name, email, password"
        });
    }

    try{
        //userDB.sync();
        log(req.body.password);
        const user = await userDB.create({
            email: req.body.email,
            name: req.body.name,
            password: req.body.password,
            phone: req.body.phone
        });
        return res.send(user);
    }catch(error){
        log("Error when adding user: ", error.message);
        return res.status(500).send({
            message: "Internal error! please try again later"
        });
    }
});


module.exports = router;