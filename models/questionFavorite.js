const Sequelize = require('sequelize');
const sequelize = require('../database');
const Model = Sequelize.Model;

class QuestionFavorite extends Model {}
QuestionFavorite.init({
}, { 
    sequelize,
    modelName: 'question_favorite'
});


module.exports = QuestionFavorite;