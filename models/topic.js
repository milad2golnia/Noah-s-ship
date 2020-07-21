const Sequelize = require('sequelize');
const sequelize = require('../database');
const Model = Sequelize.Model;

class Topic extends Model {}
Topic.init({

  name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        min: 3,
        max: 255,
        notEmpty: true
      }
  },

  description: {
    type: Sequelize.TEXT,
    allowNull: true,
    validate: {
        min: 3,
        max: 255,
        notEmpty: false
    }
  }

}, { 
    sequelize,
    modelName: 'topic'
   });

module.exports = Topic;