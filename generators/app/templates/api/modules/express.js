const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

module.exports = (apiRoutes) => {
	const app = express();

	app.use(bodyParser.urlencoded({extended: false}));
	app.use(bodyParser.json());
	app.use(morgan('dev'));

	/**
	 * Register routes and start express server
	 */
	app.use(apiRoutes);

	/**
	 * Not found response
	 */
	app.use('*', (req, res) => {
		res.status(404).end();
	});

	return app;
};
