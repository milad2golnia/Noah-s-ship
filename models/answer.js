const Sequelize = require('sequelize');
const sequelize = require('../database');
const Question = require('./question')
const User = require('./user')
const Model = Sequelize.Model;

class Answer extends Model {}
Answer.init({

question: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
        model: Question,
        key: 'id',
    }
},

title: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
        min: 3,
        max: 255,
        notEmpty: true
    }
},

text: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      min: 3,
      max: 500,
      notEmpty: true,
    }
},

writer: {
    type: Sequelize.STRING,
    allowNull: false,
    references: {
        model: User,
        key: 'email',
    }
}

}, { 
    sequelize,
    modelName: 'answer'
   });

module.exports = Answer;