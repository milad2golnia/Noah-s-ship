const User = require('./models/user');
const Question = require('./models/question');
const Answer = require('./models/answer');
const Favorite = require('./models/favorite');
const Sale = require('./models/sale');
const sequelize = require('./database');

sequelize.sync({alter: true});

/* 
User.sync();
Favorite.sync();
Question.sync();
Answer.sync();
Sale.sync();
QuestionTopic.sync();
 */