const express = require('express');
const morgan = require('morgan');
const debug = require('debug');
const auth = require('./routers/authentication');
const user = require('./routers/user');
const CO = require('./middleWares/crossOrigin');
const syncDB = require('./index');
const question = require('./routers/question');
const gateway = require('./middleWares/auth');


const app = express();

const share = express.static("public");
app.use(share);

if(process.env.NODE_ENV == "development"){
	app.use(morgan('tiny'));
}

app.use(express.json());
app.use(CO);
app.use('/auth/', auth);
app.use('/user/', user);
app.use(gateway);
app.use('/question/', question);
const log = debug('app::start');

const port = process.env.port || 3001;

app.listen(port, async()=>{
	log(`Server started on port ${port}`);
})
