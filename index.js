const User = require('./models/user');
const Question = require('./models/question');
const Answer = require('./models/answer');
const Favorite = require('./models/favorite');
const Sale = require('./models/sale');
const Transaction = require('./models/transaction');
const sequelize = require('./database');

sequelize.sync({alter: true});
