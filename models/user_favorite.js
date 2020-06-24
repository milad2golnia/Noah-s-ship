const Sequelize = require('sequelize');
const sequelize = require('../database');
const User = require('./user');
const Favorite = require('./favorite');
const Model = Sequelize.Model;

class UserFavorite extends Model {}
UserFavorite.init({

  user: {
    type: Sequelize.STRING,
    primaryKey: true,
    references: {
        model: User,
        key: 'email',
    }
  },

  favorite: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      references: {
          model: Favorite,
          key: 'id'
      }
  }

}, { 
    sequelize,
    modelName: 'user_favorite'
   });

module.exports = UserFavorite;