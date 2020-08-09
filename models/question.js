const Sequelize = require('sequelize');
const sequelize = require('../database');
const User = require('./user');
const joi = require('@hapi/joi');
const {Favorite} = require('./favorite');
const QuestionFavorite = require('./questionFavorite');
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

Question.belongsToMany(Favorite, {through: QuestionFavorite});
Favorite.belongsToMany(Question, {through: QuestionFavorite});

function validateQuestion(question) {
    const schema = joi.object({
        title: joi.string().min(3).max(255).required(),
        text: joi.string().min(3).max(500).required(),
        favorites: joi.array()
    })

    return schema.validate(question)
}

exports.Question = Question;
exports.validateQuestion = validateQuestion;