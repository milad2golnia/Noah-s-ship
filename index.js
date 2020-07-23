const user = require('./models/user');
const question = require('./models/question');
const answer = require('./models/answer');
const favorite = require('./models/favorite');
const sale = require('./models/sale');
const sequelize = require('./database');

sequelize.sync({alter: true});


User.sync();
Favorite.sync();
UserFavorite.sync();
Question.sync();
Answer.sync();
Sale.sync();
QuestionTopic.sync();
