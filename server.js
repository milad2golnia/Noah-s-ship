const express = require('express');
const morgan = require('morgan');
const debug = require('debug');
const auth = require('./routers/authentication');
const user = require('./routers/user');
const favorite = require('./routers/favorite');
const sale = require('./routers/sale');
const CO = require('./middleWares/crossOrigin');
const question = require('./routers/question');
const answer = require('./routers/answer');
const gateway = require('./middleWares/auth');
const cors = require('cors');
const dbSync = require('./index');
const app = express();

const share = express.static("public");
app.use(share);

if(process.env.NODE_ENV == "development"){
	app.use(morgan('tiny'));
}

app.use(express.json());
app.use(CO);
app.options('*', cors()) 

app.use('/auth/', auth);
app.use('/user/', user);

app.use(gateway);

app.use('/question/', question);
app.use('/favorite/', favorite);
app.use('/answer/', answer);
app.use('/sale/', sale);

const log = debug('app::start');

const port = process.env.port || 3001;

app.listen(port, async()=>{
	log(`Server started on port ${port}`);
})
