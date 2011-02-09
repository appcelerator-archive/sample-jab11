/**
 * TiGantry - The global framework object
 */
var TiGantry = {};

/**
 * TiGantry.init - Setup Global TiGantry settings
 * @param {string} version
 * @param {string} codename
 * @param {string} appname
 * @param {string} appdir
 * @param {string} controldir
 * @param {string} layoutdir
 */
TiGantry.init = (function(version, codename, appname, appdir, controldir, layoutdir) {
	TiGantry.TIGANTRY_VERSION 		= version;		// The app version
	TiGantry.TIGANTRY_CODENAME 		= codename;		// The app codename
	TiGantry.TIGANTRY_APPNAME 		= appname;		// The app name
	TiGantry.TIGANTRY_APPDIR		= appdir;		// The app dir
	TiGantry.TIGANTRY_CONTROLDIR	= controldir;	// The controller dir
	TiGantry.TIGANTRY_LAYOUTDIR		= layoutdir;	// The layout dir
	
	// Setup Default App Namespaces
	TiGantry.App = {
		Controller	: {},
		Layout		: {},
		Components	: {},
		Events		: {}		
	};
	
	// Intro log files (inspired by Fred Spencer...of course)	
	TiGantry.log({ msg: '*** TiGantry Framework Initialized ***', info: true });
	TiGantry.log({ msg: '*** AUTHOR: Rick Blalock & Dawson Toth', info: true });
	TiGantry.log({ msg: '*** APP Name: ' + appname, info: true });
	TiGantry.log({ msg: '*** Version: ' + version + ' ' + codename, info: true });	
});

// Include core framework libraries
Ti.include(
	'system/object.js',
	'system/controller.js',
	'system/layout.js',
	'system/xhr.js',	
	'system/animation.js'
);

/**
 * Sets the app theme by including the styles file from the themes dir
 * @param {string} theme - Name of the theme directory
 */
TiGantry.setTheme = (function(theme) {
	Ti.include(TiGantry.TIGANTRY_APPDIR + '/themes/' + theme + '/styles.js');	
});

/**
 * Log Helper
 * @author Fred Spencer (unashamedly borrowed from Integrity because Fred is the man)
 * @param {object} params - Parameters to pass to the log function
 */
TiGantry.log = (function(params) { 
	if (typeof(params) === 'object' && params !== null) {
		if (params.error) { Ti.API.error(params.msg); } 
		if (params.debug) { Ti.API.debug(params.msg); } 
		if (params.info) { Ti.API.info(params.msg); }

		if (!params.error && !params.debug && !params.info) { Ti.API.info(params); }
	} else if (params === null){
		Ti.API.error(params); // just print the message: API.log(msg);
	} else {
		Ti.API.info(params); // just print the message: API.log(msg);
	}			
});


