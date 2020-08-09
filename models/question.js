const Sequelize = require('sequelize');
const sequelize = require('../database');
const User = require('./user');
const joi = require('@hapi/joi');
const {Favorite} = require('./favorite');
const Model = Sequelize.Model;

class Question extends Model {}
Question.init({

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

isAnswered: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
}

}, { 
    sequelize,
    modelName: 'question'
});

Question.belongsTo(User);

Question.belongsToMany(Favorite, {through: 'questionFavorite'});
Favorite.belongsToMany(Question, {through: 'questionFavorite'});

function validateQuestion(question) {
    const schema = joi.object({
        title: joi.string().min(3).max(255).required(),
        text: joi.string().min(3).max(500).required()
    })

    return schema.validate(question)
}

exports.Question = Question;
exports.validateQuestion = validateQuestion;