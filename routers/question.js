const express = require('express');
const debug = require('debug');
const QuestionModel = require('../models/question');
const User = require('../models/user');
const category= require('../models/favorite');
const auth = require('../middleWares/auth');
const router = express.Router();
const log = debug('app::question');
const QuestionFavoriteModel = require('../models/questionFavorite');
const messages = require('../messages');
const QuestionFavorite = require('../models/questionFavorite');
const {Op} = require('sequelize');
const AnswerModel = require('../models/answer');

router.get('/list/:offset/:limit', async (req, res) =>{
    const _offset = req.params.offset;
    const _limit = req.params.limit;

    if (!_offset || !_limit){
        log('wrong offset or limit: ', _offset, ' ', limit);
        res.status(400).send({
            message: messages.emptyOffsetLimit
        });
    }

    if(_offset <0 || _limit < 0){
        res.status(500).send({
            message: messages.negetiveOffsetLimit
        });
    }

    try{
        const result = await QuestionModel.Question.findAll({
            attributes: ['id', 'text', 'title', 'createdAt'],
            limit: _limit,
            offset: _offset,
            order: [['createdAt', 'DESC']],
            include: [{
                model: User,
                attributes: ['name', 'email']
            },{
                model: category.Favorite,
                attributes: ['name'],
                through:{
                    attributes: []
                }
            }
            ]
        });

        var whereClause;
        var attributes;
        if(!req.user.admin){
            whereClause = {
                confirmed: true
            }
            attributes = [
                'id', 'title', 'updatedAt', 'userEmail', 'confirmed'
            ]
        }else{
            whereClause = {
                confirmed:{
                    [Op.or]: [true, null]
                }
            };
        }
        
        for (i in result){
            whereClause.questionId = result[i].id;
            result[i].setDataValue("Answers", await AnswerModel.Answer.findAll({
                attributes: attributes,
                order: [['createdAt', 'DESC']],
                where:whereClause
            }) );
        }
        
        res.send(result);
    }catch(error){
        log('Error when sending question paged: ', error.message);
        res.status(500).send({
            message: messages.error500
        });
    }
});


router.get('/info/:id', async (req, res)=>{
    const _id = req.params.id;
    
    if(_id < 0){
        log('Invalid id', _id);
        res.status(400).send({
            message: messages.unavailable
        });
    }

    try{
        const result = await QuestionModel.Question.findAll({
            where:{
                id: _id
            },
            include: [{
                model: User
            },{
                model: category.Favorite,
                through:{
                    attributes: []
                }
            }]
        });
        if(result.length == 0){
            log('Requestd question doesn\' exist; questions id: ', id);
            return res.status(404).send({
                message: messages.unavailable
            });
        }
        if(result.length > 1){
            log('More than one question associated with one Id: ', JSON.stringify(result));
            res.status(500).send({
                message: messages.error500
            });
        }
        res.send(result);
    }catch(error){
        log('Error when retrieving question info: ',error.message);
        return res.status(500).send({
            message: messages.error500
        });
    }
})
          
router.post('/', async (req, res)=>{
    const result = QuestionModel.validateQuestion(req.body);

    if(result.error){
        log('Invalid request: ', result.error);
        return res.status(400).send({
            message: messages.error400
            });
    }

    try{
        const question = await QuestionModel.Question.create({
            title: req.body.title,
            text: req.body.text,
            userEmail: req.user.email
        });

        const favorites = req.body.favorites;
        
        if (favorites != null){
            for (favorite of favorites){
                await QuestionFavoriteModel.create({
                    questionId: question.id,
                    favoriteId: favorite 
                });
        }

    }

        return res.status(200).send(question);
    }catch(error){
        log("Error when adding question: ", error.message);
        return res.status(500).send({
            message: messages.error500
        });
    }
});

module.exports = router;
