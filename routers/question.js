const express = require('express');
const debug = require('debug');
const {Question, validateQuestion} = require('../models/question');
const joi = require('@hapi/joi');
const questionDB = require('../models/question');
const User = require('../models/user');
const category= require('../models/favorite');

const router = express.Router();
const log = debug('app::question');

router.get('/list/:offset/:limit', async (req, res) =>{
    const _offset = req.params.offset;
    const _limit = req.params.limit;

    if (!_offset || !_limit){
        log('wrong offset or limit: ', _offset, ' ', limit);
        res.status(400).send({
            message: 'خطا! لطفا بازه ی سوالات مورد نظر را مشخص کنید.'
        });
    }

    if(_offset <0 || _limit < 0){
        res.status(500).send({
            message: 'خطا! پارامترهای ارسالی باید دارای مقداری مثبت باشند.'
        });
    }

    try{
        const result = await questionDB.Question.findAll({
            attributes: ['id', 'title', 'createdAt'],
            limit: _limit,
            offset: _offset,
            order: [['createdAt', 'DESC']],
            include: [{
                model: User,
                attributes: ['name', 'email']
            },{
                model: category,
                attributes: ['name'],
                through:{
                    attributes: []
                }
            }
            ]
        });
        res.send(result);
    }catch(error){
        log('Error when sending question paged: ', error.message);
        res.status(500).send({
            message: 'خطا! لطفا بعدا تلاش نمایید'
        });
    }
});




router.get('/info/:id', async (req, res)=>{
    const _id = req.params.id;
    
    if(_id < 0){
        log('Invalid id', _id);
        res.status(400).send({
            message: 'خطا! سوال خواسته شده وجود ندارد.'
        });
    }

    try{
        const result = await questionDB.Question.findAll({
            where:{
                id: _id
            },
            include: [{
                model: User
            },{
                model: category,
                through:{
                    attributes: []
                }
            }]
        });
        if(result.length == 0){
            log('Requestd question doesn\' exist; questions id: ', id);
            return res.status(404).send({
                message: 'خطا! اطلاعات مورد نظر وجود ندارد'
            });
        }
        if(result.length > 1){
            log('More than one question associated with one Id: ', JSON.stringify(result));
            res.status(500).send({
                message: 'خطا! دیتابیس آسیب دیده است'
            });
        }
        res.send(result);
    }catch(error){
        log('Error when retrieving question info: ',error.message);
        return res.status(500).send({
            message: 'خطا! لطفا بعدا تلاش نمایید'
        });
    }
})





          
router.post('/', async (req, res)=>{
    const result = validateQuestion(req.body);

    if(result.error){
        log('Invalid request: ', result.error);
        return res.sendStatus(400).send({
            message: "check the sending fields"
            });
    }

    try{
        const question = await Question.create({
            title: req.body.title,
            text: req.body.text,
            userEmail: req.user.email
            //set topic (optional)
        });
        return res.sendStatus(200).send(question.id);
    }catch(error){
        log("Error when adding question: ", error.message);
        return res.sendStatus(500).send({
            message: "Internal error! please try again later"
        });
    }
});




module.exports = router;
