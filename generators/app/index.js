'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');

/**
 * DevDependencies
 */
let devDeps = {};
let babelConfig = {};

/**
 * Mock API Generator
 */
module.exports = class extends Generator {
	initializing() {
		devDeps = this.fs.readJSON(this.templatePath('_package.json')).devDependencies;
		babelConfig = this.fs.readJSON(this.templatePath('babelrc')).env.api;

		this.execInstall = this.options.execInstall || true;
		this.showPrompt = this.options.showPrompt;
		this.veamsFile = this.options.veamsFile || this.fs.readJSON(this.templatePath('veams-cli.json'));
		this.pkgFile = this.options.pkgFile || this.fs.readJSON(this.templatePath('_package.json'));
		this.babelFile = this.options.babelFile || this.fs.readJSON(this.templatePath('babelrc'));
		this.nodemonConfig = this.fs.readJSON(this.templatePath('configs/tasks/nodemon.api.json'));

		if (!this.showPrompt) {
			this.config.set('mockApiServer', true);
		}
	}

	prompting() {
		// Have Yeoman greet the user.
		this.log(
			`${chalk.cyan('\n======================================')}\n` +
			`${chalk.cyan(' *** Starting Mock-Api Generator *** ')}` +
			`${chalk.cyan('\n======================================')}\n`
		);

		const prompts = [
			{
				when: () => this.showPrompt,
				type: 'confirm',
				name: 'mockApiServer',
				message: 'Would you like to scaffold a mock api server instance?',
				default: true
			},
			{
				when: (answers) => answers.mockApiServer || this.config.get('mockApiServer'),
				type: 'input',
				name: 'mockApiSrc',
				message: 'In which folder do you want to create the api server?',
				default: 'src/api'
			},
			{
				when: (answers) => answers.mockApiServer || this.config.get('mockApiServer'),
				type: 'input',
				name: 'mockApiPort',
				message: 'On which port do you want to run the server?',
				default: 8080
			},
			{
				when: (answers) => answers.mockApiServer || this.config.get('mockApiServer'),
				type: 'confirm',
				name: 'mockApiBlueprint',
				message: 'Do you want to add the mock api blueprint to scaffold endpoints easily with Veams?',
				default: true
			}
		];

		return this.prompt(prompts).then(props => {
			// To access props later use this.props.someAnswer;
			this.props = props;
		});
	}

	configuring() {
		if (this.showPrompt) {
			this.config.set('mockApiServer', this.props.mockApiServer);
		}

		if (this.config.get('mockApiServer')) {
			this.config.set('mockApiSrc', this.props.mockApiSrc);
			this.config.set('mockApiPort', this.props.mockApiPort);
			this.config.set('mockApiBlueprint', this.props.mockApiBlueprint);

			/**
			 * Veams File
			 */
			this.veamsFile.paths.api = this.props.mockApiSrc;
			this.veamsFile.ports.api = this.props.mockApiPort;

			if (this.props.mockApiBlueprint) {
				this.veamsFile.blueprints[ 'api' ] = {
					'skipImports': true,
					'path': 'node_modules/@veams/bp-mock-api'
				};

				/**
				 * Add Blueprint Package
				 */
				this.pkgFile.devDependencies[ '@veams/bp-mock-api' ] = '0.0.1';
			}

			/**
			 * Config File for Nodemon
			 */
			this.nodemonConfig.ignore.push(`${this.props.mockApiSrc}/mocks/`);
			this.nodemonConfig.watch.push(`${this.props.mockApiSrc}/`);

			/**
			 * Config file for Babel
			 */
			if (!this.babelFile.env[ 'api' ]) {
				this.babelFile.env[ 'api' ] = babelConfig;
			}

			/**
			 * Update package.json by adding a new task
			 */
			this.pkgFile.scripts[ 'local:api' ] = `cross-env BABEL_ENV=api nodemon ${this.props.mockApiSrc}/index.js --config ./${this.veamsFile.paths.config}/tasks/nodemon.api.json`;

			if (!this.pkgFile.scripts.start) {
				this.pkgFile.scripts.start = `cross-env NODE_ENV=local npm-run-all --parallel local:*`;
			}

			/**
			 * Add dependencies to work with mock API
			 */
			for (let pkgName in devDeps) {
				if (!this.pkgFile.devDependencies[ pkgName ]) {
					this.pkgFile.devDependencies[ pkgName ] = `${devDeps[ pkgName ]}`;
				}
			}
		}

	}

	writing() {
		if (this.config.get('mockApiServer')) {
			this.fs.copy(
				this.templatePath('api'),
				this.destinationPath(this.veamsFile.paths.api)
			);

			this.fs.write(
				this.destinationPath(`${this.veamsFile.paths.config}/tasks/nodemon.api.json`),
				JSON.stringify(this.pkgFile, null, 4)
			);

			if (this.execInstall) {
				this.fs.write(
					this.destinationPath(`veams-cli.json`),
					JSON.stringify(this.veamsFile, null, 4)
				);
				this.fs.write(
					this.destinationPath(`.babelrc`),
					JSON.stringify(this.babelFile, null, 4)
				);
				this.fs.write(
					this.destinationPath(`package.json`),
					JSON.stringify(this.pkgFile, null, 4)
				);
			}
		}
	}

	install() {
		if (this.execInstall) {
			this.installDependencies();
		}
	}
};
