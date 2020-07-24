const Sequelize = require('sequelize');
const sequelize = require('../database');
const joi = require('@hapi/joi');

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

function validateFavorite(favorite) {
  const schema = joi.object({
      title: joi.string().min(3).max(255).required(),
      description: joi.string().min(3).max(255)
  })

  return schema.validate(favorite)
}

exports.Favorite = Favorite;
exports.validateFavorite = validateFavorite;