const Sequelize = require('sequelize');
const sequelize = require('../database');
const User = require('./user')
const {Answer} = require('./answer')
const Model = Sequelize.Model;

class Sale extends Model {}
Sale.init({

price: {
    type: Sequelize.FLOAT,
    allowNull: false,
    validate: {
        min: 1,
        notEmpty: true
    }
},

point: {
    type: Sequelize.FLOAT,
    allowNull: true,
    validate: {
        min: 1,
        max: 5,
        notEmpty: false
    }
}

}, { 
    sequelize,
    modelName: 'sale'
});

Sale.belongsTo(User);
Sale.belongsTo(Answer);

module.exports = Sale;