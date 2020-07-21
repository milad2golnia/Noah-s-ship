const Sequelize = require('sequelize');
const sequelize = require('../database');
const User = require('./user');
const Model = Sequelize.Model;

class Question extends Model {}
Question.init({

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
    modelName: 'question'
   });

module.exports = Question;