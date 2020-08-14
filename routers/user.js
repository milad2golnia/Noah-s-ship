const express = require('express');
const debug = require('debug');
const joi = require('@hapi/joi');
const userDB = require('../models/user');
const rand = require('randomatic');
const Trans = require('../models/transaction');
const UserFavortieModel = require('../models/userFavorite');
const log = debug('app::user');
const messages = require('../messages');
const router = express.Router();
const auth = require('../middleWares/auth');

router.post('/', async (req, res)=>{
    const schema = joi.object({
        name: joi.string().min(1).max(250).required(),
        email: joi.string().email().required(),
        password: joi.string().min(8).max(250).required(),
        phone: joi.string().min(1).max(250),             //BUG: shoud set the length, maybe 11
        favorites: joi.array()
    }).unknown(true);                                   //BUG: shouldn't use unkown

    const result = schema.validate(req.body);

    if(result.error){
        log('Invalid request: ', result.error);
        return res.status(400).send({
            message: "required fields are: name, email, password"
        });
    }

    const _user = userDB.findByPk(req.body.email)

    if (_user) return res.status(200).send({message: messages.existsUser})

    try{
        log(req.body.password);
        const user = await userDB.create({
            email: req.body.email,
            name: req.body.name,
            password: req.body.password,
            phone: req.body.phone
        });

        const favorites = req.body.favorites;

        for (favorite of favorites){
            await UserFavortieModel.create({
                userEmail: user.email,
                favoriteId: favorite
            })
        }
        
        return res.send(user);
    }catch(error){
        log("Error when adding user: ", error.message);
        return res.status(500).send({
            message: "Internal error! please try again later"
        });
    }
});


router.put('/',auth , async(req, res)=>{
    try{
        await userDB.update({ isAdmin: true }, {
            where:{
                email: req.user.email
            }
        });
        
        return res.status(200).send({
            message: messages.successful
        });
        
    }catch(error){
        log("Error when promoting to admin: ", error.message);
        return res.status(500).send({
            message: messages.error500
        })
    }
})


router.post('/guarantee/', auth ,async (req, res)=>{

    const schema = joi.object({
        amount: joi.number().max(400000).min(10000).required(),
        bankTrackCode: joi.string().max(16).min(8).required()
    });

    //checking bankTrackCode.

    const verify = schema.validate(req.body);
    if(verify.error){
        log("Invalid amount paid: ", verify.error.message);
        if(verify.error.message.substr("bankTrackCode") !== -1)
            return res.status(400).send({
                message: "خطا! تراکنش از سمت بانک با خطا مواجه شد."
            });
        else
            return res.status(400).send({
                message: "خطا! مبلغ باید بین ۱۰ هزار ریال تا ۴۰۰ هزار ریال باشد."
            })
    }

    try{
        const prc = Math.abs(req.body.amount);
        
        const transaction = await Trans.create({
            userEmail: req.user.email,
            tracking: req.body.bankTrackCode,
            price: prc,
            isCompleted: true,
        });
        
        log("Transaction done! going to update user information...");

        const user = await userDB.findAll({
            where:{
                email: req.user.email
            }
        });
        if(user.length !== 1){
            log("more than one user with below email: ", req.body.email);
            return res.status(500).send({
                message: "خطا! اطلاعات ذخیره شده آسیب دیده اند، لطفا بعدا مجددا تلاش نمایید."
            });
        }
        user[0].isPaid = true;
        user[0].save();

        return res.send(transaction);

    }catch(error){
        log("Error when creating transaction: ", error.errors[0].message);

        if(error.fields.tracking)
            return res.status(400).send({
                message: 'خطا! تراکنش از سمت بانک به درستی انجام نشده است.'
            })
        else    
            return res.status(500).send({
                message: 'خطا! لطفا بعدا دوباره تلاش نمایید.'
            });
    }
});


router.get('/guarantee/',auth, async (req,res)=>{
    if(!req.user){
        log('User field is empty');
        return res.status(400).send({
            message: 'خطا! اطلاعات کاربر صحیح نیست.'
        });
    }
    log('here');
    try{
        const lastTransaction = await Trans.findAll({
            where:{
                updatedAt: (await Trans.max('updatedAt'))
            }
        });

        if(lastTransaction.length !== 1){
            log('Wrong query! more than one transaction per one time');
            return res.status(500).send({
                message: 'خطا! اطلاعات در سمت سرور آسیب دیده است، لطفا بعدا مجددا تلاش نمایید.'
            });
        }
        
        log('last transaction found! inserting new one...');

        const trackCode = rand('0', 16);        //BUG: no control if produce one duplicate!
        const result = await Trans.create({
            tracking: trackCode,
            price: lastTransaction[0].price * -1,
            isCompleted: false,
            userEmail: lastTransaction[0].email
        });

        log('Transaction completed! updating user Information...');

        const userInfo = await userDB.findAll({
            where:{
                email: lastTransaction[0].userEmail
            }
        });

        if(userInfo.length !== 1){
            log('more than one user with this email: ', lastTransaction[0].email);

            return res.status(500).send({
                message: 'خطا! اطلاعات در سمت سرور آسیب دیده است، لطفا بعدا تلاش نمایید.'
            });
        }

        userInfo[0].isPaid = false;
        userInfo[0].save();

        return res.send(result);
    }catch(err){
        log('Error when paying user\'s guarantee: ', err.errors[0].message);

        return res.status(500).send({
            message: 'خطا! لطفا بعدا تلاش کنید.'
        });
    }
})

module.exports = router;