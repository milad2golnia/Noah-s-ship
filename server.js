const express = require('express');
const morgan = require('morgan');
const debug = require('debug');
const auth = require('./routers/authentication');
const user = require('./routers/user');
const favorite = require('./routers/favorite');
const CO = require('./middleWares/crossOrigin');
const syncDB = require('./index');
const question = require('./routers/question');
const gateway = require('./middleWares/auth');
const cors = require('cors');


const app = express();

const share = express.static("public");
app.use(share);

if(process.env.NODE_ENV == "development"){
	app.use(morgan('tiny'));
}

app.use(express.json());
app.use(gateway);
app.use(CO);

const corsOpts = {
	origin: '*',
  
	methods: [
	  'GET',
	  'POST',
	],
  
	allowedHeaders: [
	  'Content-Type',
	],
  };
app.use(cors(corsOpts))

app.use('/auth/', auth);
app.use('/user/', user);
app.use('/question/', question);
app.use('/favorite/', favorite);

const log = debug('app::start');

const port = process.env.port || 3001;

app.listen(port, async()=>{
	log(`Server started on port ${port}`);
})
