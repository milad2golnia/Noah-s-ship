const Sequelize = require('sequelize');
const sequelize = require('../database');
const User = require('../models/user');
const Model = Sequelize.Model;

class Transaction extends Model {}
Transaction.init({

  tracking: {
    type: Sequelize.STRING,
    primaryKey: true,
    validate: {
      len: [1, 16],
      notEmpty: false
    }
  },

  price: {
    type: Sequelize.FLOAT,
    allowNull: false,
    validate: {
        min: -400000,
        max: 400000,
        notEmpty: false
    }
  },

  isCompleted: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }


}, { 
    sequelize,
    modelName: 'transaction'
});

Transaction.belongsTo(User);

module.exports = Transaction;