const Sequelize = require('sequelize');
const sequelize = require('../database');
const Answer = require('./answer');
const Topic = require('./topic');
const Model = Sequelize.Model;

class AnswerTopic extends Model {}
AnswerTopic.init({

  answer: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    references: {
        model: Answer,
        key: 'id',
    }
  },

  topic: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      references: {
          model: Topic,
          key: 'id'
      }
  }

}, { 
    sequelize,
    modelName: 'answer_topic'
   });

module.exports = AnswerTopic;