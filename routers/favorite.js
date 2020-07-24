const express = require('express');
const debug = require('debug');
const {Favorite}= require('../models/favorite');
const router = express.Router();
const log = debug('app::favorite');
const messages = require('../messages');

router.get('/:offset/:limit', async (req, res) =>{
    const _offset = req.params.offset;
    const _limit = req.params.limit;

    if (!_offset || !_limit){
        log('wrong offset or limit: ', _offset, ' ', limit);
        res.status(400).send({
            message: messages.emptyOffsetLimit
        });
    }

    if(_offset <0 || _limit < 0){
        log('negetive offset or limit: ', _offset, ' ', limit);
        res.status(400).send({
            message: messages.negetiveOffsetLimit
        });
    }

    try{
        const result = await Favorite.findAll({
            attributes: ['id', 'name', 'description'],
            limit: _limit,
            offset: _offset,
            order: [['createdAt', 'DESC']],
        });
        res.send(result);
    }catch(error){
        log('Error when sending question paged: ', error.message);
        res.status(500).send({
            message: messages.error500
        });
    }
});

module.exports = router;
