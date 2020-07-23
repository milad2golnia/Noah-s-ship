const express = require('express');
const debug = require('debug');
const {Question, validateQuestion} = require('../models/question');
const log = debug('app::question');
const router = express.Router();
const auth = require('../middleware/auth');

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