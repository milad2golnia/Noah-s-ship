const Sequelize = require('sequelize');
const sequelize = require('../database');
const Model = Sequelize.Model;

class UserFavorite extends Model {}
UserFavorite.init({
}, { 
    sequelize,
    modelName: 'user_favorite'
});


module.exports = UserFavorite;