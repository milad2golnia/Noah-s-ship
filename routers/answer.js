const express = require('express');
const sequelize = require('sequelize');
const AnswerModel = require('../models/answer');
const UserModel = require('../models/user');
const QuestionModel = require('../models/question');
const { Op } = require("sequelize");
const messages = require('../messages');
const saleModel = require('../models/sale');
const joi = require('@hapi/joi');


const debug = require('debug');
const log = debug('app::answer');

const router = express.Router();


router.post('/', async (req, res)=>{

    const _result = AnswerModel.validateAnswer(req.body);

    if(_result.error){
        log('Invalid request: ', _result.error);
        return res.status(400).send({
            message: messages.error400
        });
    }

    const _user = await UserModel.findByPk(req.user.email);

    if (_user.isAdmin || _user.isSupervisor || _user.isPaid){

        try{
            const _answer = await AnswerModel.Answer.create({
                title: req.body.title,
                text: req.body.text,
                userEmail: _user.email,
                questionId: req.body.questionId
            });

            await QuestionModel.Question.update({
                isAnswered: true,
              }, {
                where: {
                  id: _answer.questionId
                }
            });

            return res.send(_answer);
        }catch(error){
            log("Error when adding answer: ", error.message);
            return res.status(500).send({
                message: messages.error500
            });
        }

    } else {
        return res.status(200).send({
            message: messages.createAnswerNotAllowed
        });
    }

});



router.get('/list/:questionID/:_offset/:_limit', async (req, res)=>{
    var offset = req.params._offset;
    var limit = req.params._limit;
    var QID = req.params.questionID;
    
    if(!offset || !limit){
        log('no offset or limit provided: ', offset, limit);
        res.status(400).send({
            message: messages.emptyOffsetLimit
        });
    }

    if(offset<0 || limit<=0){
        log('Invalid offset and limit: ', offset, limit);
        res.status(400).send({
            message: messages.negetiveOffsetLimit
        })
    }

    if(!QID || QID<0){
        log('Invalid question id:', QID);
        res.status(400).send({
            message: messages.unavailable
        })
    }

    try{
        const isAdmin = req.user.admin;
        var whereClause;
        if(!isAdmin)
            whereClause = {
                confirmed: true
            }
        whereClause.questionId = QID;
        const result = await AnswerModel.Answer.findAll({
            attributes: ['id', 'title', 'updatedAt', 'userEmail', 'confirmed'],
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']],
            where:whereClause
        });
        res.send(result);
    }catch(error){
        log('Error when getting the list of answers: ', error.message);
        res.status(500).send({
            message: messages.error500
        })
    }
})


router.put('/confirmation/', async(req, res)=>{

    if(!req.user.admin){
        log('forbiddend request to confirm answer: ', req.user.admin);
        return res.status(405).send({
            message: messages.notAllowed
        });
    }

    const schema = joi.object({
        answerID: joi.number().min(0).max(100000).required(),
        confirmation: joi.boolean().required()
    })

    const result = schema.validate(req.body);
    if(result.error){
        log('Invalid parameters: ', result.error);
        return res.status(400).send({
            message: messages.error400
        });
    }

    try{
        await AnswerModel.Answer.update({ confirmed: req.body.confirmation}, {
            where:{
                id: req.body.answerID
            }
        });
        
        res.status(200).send({
            message: messages.successful
        })
    }catch(error){
        log("Error when modifying question: ", error.message);
        return res.status(500).send({
            message: messages.error500
        })
    }
});


router.get('/:id', async (req, res)=>{
    const id = req.params.id;

    if(!id || id<0){
        log("Invalid answer ID passed: ", id);
        return res.status(400).send({
            message: messages.error400
        });
    }

    try{
        const result =await saleModel.Sale.findAll({
            where:{
                answerId: id,
                userEmail: req.user.email
            }
        });

        if(result.length == 0 && req.user.admin == 0){
            log("forbidden request: ", req.user.email, id);
            return res.status(405).send({
                message: messages.notAllowed
            })
        }else if(result.length > 1)
            log('Inconsistance database, two transaction for same sale: ', req.user.email, id);
        
        const info = await AnswerModel.Answer.findAll({
            where:{
                id: id
            }
        });

        return res.send(info[0]);
    }catch(error){
        log("Error when getting answers detail: ", error.message);
        return res.status(500).send({
            message: messages.error500
        });
    }
})

module.exports = router;