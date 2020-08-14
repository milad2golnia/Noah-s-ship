const express = require('express');

const AnswerModel = require('../models/answer');
const UserModel = require('../models/user');
const QuestionModel = require('../models/question');

const debug = require('debug');
const log = debug('app::answer');
const messages = require('../messages');

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

module.exports = router;