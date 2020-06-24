const User = require('./models/user');
const Favorite = require('./models/favorite');
const UserFavorite = require('./models/user_favorite')

User.sync();
Favorite.sync();
UserFavorite.sync();