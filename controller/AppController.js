
'use strict';

var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	fs = require('fs'),
	util = require('util'),
	extend = util._extend,
	Utils = require('../lib/Utils'),
	AppControllerSingleton;

/**
 *
 * @class AppController
 * @param {object} options
 * @constructor
 *
 */
function AppController(options) {
	this.init(options);
}

AppController.prototype = extend(AppController.prototype, Utils.prototype);
AppController.prototype = extend(AppController.prototype, {

	constructor : AppController,

	_defaults: {
		restPath: './rest',
		title: 'Api mock server',
		version: 1,
		urlBase: 'http://localhost:3001',
		urlPath: '/rest/v1',
		port: 3001,
		contentType: 'application/json',
		accessControlExposeHeaders: 'X-Total-Count',
		accessControlAllowOrigin: '*',
		accessControlAllowMethods: 'GET, POST, PUT, OPTIONS, DELETE, PATCH, HEAD',
		accessControlAllowHeaders: 'origin, x-requested-with, content-type'
	},

	/**
	 *
	 * @method init
	 * called by constructor
	 * @param {object} options
	 * @param {string} options.dirName
	 * @param {object} options.swaggerImport
	 * @param {string|undefined} options.jsVersion
	 * @public
	 */
	init: function (options) {

		options = extend(this._defaults, options || {});

		this.options = options;
		this.app = app;

		if (!this.options.dirName) {
			console.error('options.dirName is required (dirName: __dirname)');
			return;
		}

		if (this.options.swaggerImport) {
			this.options.swaggerImport.dirName = this.options.dirName;
		}

		app.listen(options.port, function () {
			if (process.env.NODE_ENV !== 'test') {
				console.log('server started at port ' + options.port);
			}
		});

		app.use('/src', express.static(__dirname + '/../src'));
		app.use('/node_modules', express.static(__dirname + '/../node_modules'));
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true }));
		app.set('view engine', 'ejs');
		app.set('views', __dirname + '/../views');

	}

});

AppControllerSingleton = (function () {
	var instance;

	function createInstance(options) {
		return new AppController(options);
	}

	return {
		getInstance: function (options) {
			if (!instance && options) {
				instance = createInstance(options);
			}
			return instance;
		}
	};
})();

module.exports = AppControllerSingleton;