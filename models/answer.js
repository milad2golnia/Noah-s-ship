const Sequelize = require('sequelize');
const sequelize = require('../database');
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

}, { 
    sequelize,
    modelName: 'answer'
});

Answer.belongsTo(User);
Answer.belongsTo(Question);

module.exports = Answer;