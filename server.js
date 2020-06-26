const express = require('express');
const morgan = require('morgan');
const debug = require('debug');



const app = express();

if(process.env.NODE_ENV == "development"){
	app.use(morgan('tiny'));
}


const log = debug('app::start');

const port = process.env.port || 3000;

app.listen(port, async()=>{
	log(`Server started on port ${port}`);
})
