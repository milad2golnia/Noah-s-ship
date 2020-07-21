const Sequelize = require('sequelize');
const sequelize = require('../database');
const Question = require('./question')
const Answer = require('./answer')
const Model = Sequelize.Model;

class Sale extends Model {}
Sale.init({

question: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
        model: Question,
        key: 'id',
    }
},

answer: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
        model: Answer,
        key: 'id',
    }
},

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

module.exports = Sale;