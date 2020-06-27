const express = require('express');
const morgan = require('morgan');
const debug = require('debug');
const auth = require('./routers/authentication');
const user = require('./routers/user');


const app = express();

if(process.env.NODE_ENV == "development"){
	app.use(morgan('tiny'));
}

app.use(express.json());
app.use('/auth/', auth);
app.use('/user/', user);
const log = debug('app::start');

const port = process.env.port || 3000;

app.listen(port, async()=>{
	log(`Server started on port ${port}`);
})
