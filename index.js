const User = require('./models/user');
const Favorite = require('./models/favorite');
const UserFavorite = require('./models/user_favorite');
const Question = require('./models/question');
const Answer = require('./models/answer');
const Sale = require('./models/sale');
const Topic = require('./models/topic');
const QuestionTopic = require('./models/question_topic');
const AnswerTopic = require('./models/answer_topic');

User.sync();
Favorite.sync();
UserFavorite.sync();
Question.sync();
Answer.sync();
Sale.sync();
Topic.sync();
QuestionTopic.sync();
AnswerTopic.sync();