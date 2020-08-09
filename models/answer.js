const Sequelize = require('sequelize');
const sequelize = require('../database');
const joi = require('@hapi/joi');
const {Question} = require('./question')
const User = require('./user')
const Model = Sequelize.Model;

class Answer extends Model {}
Answer.init({

title: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
        len: [3, 255],
        notEmpty: true
    }
},

text: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      len: [3, 500],
      notEmpty: true,
    }
},

confirmed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
}

}, { 
    sequelize,
    modelName: 'answer'
});

Answer.belongsTo(User);
Answer.belongsTo(User, {foreignKey: {name: 'supervisorId'}});
Answer.belongsTo(Question);

function validateAnswer(answer) {
    const schema = joi.object({
        title: joi.string().min(3).max(255).required(),
        text: joi.string().min(3).max(500).required(),
        questionId: joi.number().integer().required()
    });
  
    return schema.validate(answer)
}

exports.Answer = Answer;
exports.validateAnswer = validateAnswer;