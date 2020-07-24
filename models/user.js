const Sequelize = require('sequelize');
const sequelize = require('../database');
const {Favorite} = require('./favorite');
const Model = Sequelize.Model;

class User extends Model {}
User.init({

  email: {
    type: Sequelize.STRING,
    primaryKey: true,
    validate: {
      isEmail: true
    }
  },

  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [3, 255],
      notEmpty: true,
    }
  },

  phone: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: true,
    validate: {
      is: /^(09)\d{9}$/
    }
  },

  password: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {
      len: [8, 255],
      notEmpty: false
    }
  },

  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },

  isSupervisor: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }

}, { 
    sequelize,
    modelName: 'user'
});

User.belongsToMany(Favorite, {through: 'userFavorite'});
Favorite.belongsToMany(User, {through: 'userFavorite'});

module.exports = User;