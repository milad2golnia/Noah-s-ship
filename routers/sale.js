const express = require('express');

const SaleModel = require('../models/sale');
const AnswerModel = require('../models/answer');

const debug = require('debug');
const log = debug('app::sale');
const messages = require('../messages');
const { required } = require('@hapi/joi');

const router = express.Router();


router.post('/', async (req, res)=>{

    const _result = SaleModel.validateSale(req.body);

    
    if(_result.error){
        log('Invalid request: ', _result.error);
        return res.status(400).send({
            message: messages.error400
        });
    }
    
    const _answer = await AnswerModel.Answer.findByPk(req.body.answerId);

    if (_answer.confirmed != null){
        if (_answer.confirmed == true){
            try{
                
                const _sale = await SaleModel.Sale.create({
                    price: _answer.price,
                    point: req.body.point,
                    userEmail: req.user.email,
                    answerId: req.body.answerId
                });

                return res.send(_sale);
            }catch(error){
                log("Error when adding sale: ", error.message);
                return res.status(500).send({
                    message: messages.error500
                });
            }
        }

    } else {
        return res.status(200).send({
            message: messages.unConfirmedAnswer
        });
    }

});

module.exports = router;