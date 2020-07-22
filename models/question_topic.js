const Sequelize = require('sequelize');
const sequelize = require('../database');
const Question = require('./question');
const Favorite = require('./favorite');
const Model = Sequelize.Model;

class QuestionTopic extends Model {}
QuestionTopic.init({

  question: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    references: {
        model: Question,
        key: 'id',
    }
  },

  topic: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      references: {
          model: Favorite,
          key: 'id'
      }
  }

}, { 
    sequelize,
    modelName: 'question_topic'
   });

module.exports = QuestionTopic;