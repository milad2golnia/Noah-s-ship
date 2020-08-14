const express = require('express');
const debug = require('debug');
const joi = require('@hapi/joi');
const userDB = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');

const router = express.Router();
const log = debug('app::Authentication');


async function getTokens(info){
    return new Promise( async(resolve, reject)=>{
        try{
            const _refreshToken =  jwt.sign({
                email: info.email,
                password: info.password
            },
            config.get('privateKey'), 
            {
                expiresIn: 60 * 60 * 10
            }
            );

            const _accessToken = jwt.sign({
                email: info.email,
                admin : info.isAdmin
            },
            config.get('privateKey'),
            {
                expiresIn: 60 * 60
            });

            resolve({
                refreshToken: _refreshToken,
                accessToken: _accessToken
            });
        }catch(error){
            log('Error when creating tokens: ', error.message);
            reject(error);
        }
    })
}

router.post('/tokens/',async (req, res)=>{
    var schema = joi.object({
        email: joi.string().email().max(250).required(),
        password: joi.string().max(250).min(8).required()
    });
    var result = schema.validate(req.body);

    if(result.error){
        
        log(`No email-password pattern: ${result.error}`);
        
        schema = joi.object({
            refreshToken: joi.string().min(8).max(250).required()
        });
        
        result = schema.validate(req.body);
        
        if(result.error){
            log('Invalid Request: ', result.error.message);
            res.status(400).send('Invalid Request: provide mail-password or token');
            return -1;
        }
        const verificatin = jwt.verify(
            req.body.refreshToken,
            config.get("privateKey")
        )
        if(verificatin){
            var _email = verificatin.email;
            var _password = verificatin.password;
        }
    }else{
        var _email = req.body.email;
        var _password = req.body.password;
    }
    
    try{
        userDB.sync(); 
        const userInfo = await userDB.findAll({
            attributes: ['email', 'password', 'isAdmin'],
            where: {
                email: _email,
                password: _password 
            }
        });
        if(userInfo.length != 1){
            log('Invalid password');
            res.status(400).send({
                message:   "Invalid password or token"
            });
            return -2;
        }else 
            res.send( await getTokens(userInfo[0]));
    }catch(error){
        log(error);
    }
})


module.exports = router;