const express = require('express');
const debug = require('debug');
const {Question, validateQuestion} = require('../models/question');
const joi = require('@hapi/joi');
const questionDB = require('../models/question');
const User = require('../models/user');


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
            include: User
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
        const result = await questionDB.findAll({
            include: [QTDB]
        })
    }catch(error){
        log('Error when retrieving question info: ',error.message);
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
