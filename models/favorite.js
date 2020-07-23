const Sequelize = require('sequelize');
const sequelize = require('../database');
const Model = Sequelize.Model;

class Favorite extends Model {}
Favorite.init({

  name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: [3, 255]
      }
  },

  description: {
    type: Sequelize.TEXT,
    allowNull: true,
    validate: {
      len: [3, 255]
    }
  }

}, { 
    sequelize,
    modelName: 'favorite'
});

module.exports = Favorite;