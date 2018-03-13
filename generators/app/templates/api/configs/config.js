import * as path from 'path';
const envConfig = require(`${process.cwd()}/environments/environment.${process.env.NODE_ENV}`);
const veamsConfig = require(`${process.cwd()}/veams-cli`);

const config = {
	veams: veamsConfig,
	env: process.env.NODE_ENV || 'dev',
	ip: process.env.IP || '0.0.0.0',
	mockPath: 'mocks',
	port: process.env.PORT || veamsConfig.ports.api,
	root: path.join(__dirname, '..'),
	startPath: '/'
};

module.exports = Object.assign(config, envConfig);