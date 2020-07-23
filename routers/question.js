const express = require('express');
const debug = require('debug');
const {Question, validateQuestion} = require('../models/question');
const log = debug('app::question');
const router = express.Router();
const auth = require('../middleware/auth');

const joi = require('@hapi/joi');
const questionDB = require('../models/question');


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
        const result = await questionDB.findAll({
            attributes: ['id', 'title', 'writer', 'createdAt'],
            limit: _limit,
            offset: _offset,
            order: [['createdAt', 'DESC']]
        });
        res.send(result);
    }catch(error){
        log('Error when sending question paged: ', error.message);
        res.status(500).send({
            message: 'خطا! لطفا بعدا تلاش نمایید'
        });
    }
});
          
router.post('/', auth, async (req, res)=>{
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