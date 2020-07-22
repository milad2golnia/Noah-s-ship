const express = require('express');
const debug = require('debug');
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




module.exports = router;