# generator-mock-api (`@veams/generator-mock-api`)
> Main-Generator :: Veams generator to scaffold a mock api server in ExpressJS.

This generator can standalone as Main-Generator or in combination with other Main-Generators. 

## Main-Generators in Veams 

Main-Generators are responsible to provide custom prompts, save the answers in a configuration file and scaffold files based on the configuration.

Main-Generators can be used standalone but also in a composable way, means they can be very useful in conjunction with other main generators.

## Installation with Veams

You only need to install [`@veams/cli`](https://github.com/Veams/cli). When in place, every Main-Generator is automatically available for you!

**We recommend to go with that installation process!**

## Installation without Veams

You can also install the generator as standalone one by executing the following command: 

### NPM 

```bash
npm install @veams/generator-mock-api --dev
```

### Yarn 

```bash
yarn add @veams/generator-mock-api
```

## Usage without Veams

Now you can start to scaffold projects by executing `yo`:

``` bash 
yo mock-api
```

## Usage in other Main-Generators

To combine `@veams/generator-mock-api` with another Main-Generator you have to install the package (see `Installation without Veams`).

Now you can start to work with it in your main generator. 

This is pretty easy, let's just compose them:

**Main Generator** 

``` js
module.exports = class extends Generator {

    initializing() {
		this.pkgFile = this.fs.readJSON(this.templatePath('_package.json'));
		this.veamsFile = this.fs.readJSON(this.templatePath('veams-cli.json'));
		this.babelFile = this.fs.readJSON(this.templatePath('babelrc'));
	}
	
	prompting() {
		// Have Yeoman greet the user.
		this.log(`Welcome to the my main generator ${chalk.red('generator-single-page-app')}!`);
		
		this.composeWith(require.resolve('generator-mock-api'), {
            veamsFile: this.veamsFile,
            babelFile: this.babelFile,
            pkgFile: this.pkgFile,
            execInstall: false,
            showPrompt: true
        });
	}

	configuring() {
		this.config.save();
	}

	writing() {
		this.fs.copyTpl(
			this.templatePath('dummyfile.txt.ejs'),
			this.destinationPath('dummyfile.txt'),
			{
				setup: this.config.getAll()
			}
		);
	}

	install() {
		this.installDependencies();
	}
};

```

You can also see, that we pass a few specific options to `@veams/generator-mock-api`. Let's figure out what you can do. 

### Options

* `veamsFile` {Object} [`veams-cli.json`] - _Veams object containing the generic config object for @veams/cli. 
When your main generator has included a `veams-cli.json` in the scaffold process, you should pass this to `@veams/generator-mock-api`. Otherwise it will use and create a fallback file._ 
* `babelFile` {Object} [`.babelrc`] - _Babel configuration file which gets extended to work with plugins and more in the mock server instance. When not provided a fallback file will be used and created._
* `pkgFile` {Object} [`package.json`] - _Packages file which gets extended. When not provided a fallback file will be used and created._
* `execInstall` {Boolean} [`true`] - _Execute install process in `@veams/generator-mock-api`._
* `showPrompt` {Boolean} [`false`] - _Show additional prompt when used in combination with other Main-Generators._
* 

### Saved configuration object (`generator-mock-api`)

The generator saves your answers under a specific namespace. 
The namespace is called `generator-mock-api`. You can see these values in `yo-rc.json` or `setup.json`.

## Getting To Know Yeoman

Yeoman is used to simplify the creation of generators ...

 * Yeoman has a heart of gold.
 * Yeoman is a person with feelings and opinions, but is very easy to work with.
 * Yeoman can be too opinionated at times but is easily convinced not to be.
 * Feel free to [learn more about Yeoman](http://yeoman.io/).


## License

MIT © [Sebastian Fitzner]()
