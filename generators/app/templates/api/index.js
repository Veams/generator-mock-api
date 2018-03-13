require('babel-register');
const express = require('./modules/express');
const apiRouter = require('./routes/index');
const config = require('./configs/config');
const winston = require('winston');

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {colorize: true});

const server = express(apiRouter);

setImmediate(() => {
	server.listen(config.port, config.ip, () => {
		winston.log('info', `Api-Mock-Express server listening on http://${config.ip}:${config.port}, in ${config.env} environment.\n`)
	});
});