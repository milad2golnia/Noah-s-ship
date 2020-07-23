const Sequelize = require('sequelize');


//managing arguments
const myArgs = process.argv.slice(2);
let logStatus = myArgs[0];
if(!logStatus)
  logStatus = false;

const sequelize = new Sequelize('noahshipdb', 'postgres', '3530682K', {
  host: 'localhost',
  dialect: 'postgres',
  // disable logging; default: console.log
  logging: logStatus

});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize
