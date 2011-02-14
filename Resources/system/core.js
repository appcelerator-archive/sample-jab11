/**
 * TiAir - The global framework object
 */
var TiAir = {};

/**
 * TiAir.init - Setup Global TiAir settings
 * @param {string} version
 * @param {string} codename
 * @param {string} appname
 * @param {string} appdir
 * @param {string} controldir
 * @param {string} layoutdir
 */
TiAir.init = (function(version, codename, appname, appdir, controldir, layoutdir) {
	TiAir.TiAir_VERSION 		= version;		// The app version
	TiAir.TiAir_CODENAME 		= codename;		// The app codename
	TiAir.TiAir_APPNAME 		= appname;		// The app name
	TiAir.TiAir_APPDIR			= appdir;		// The app dir
	TiAir.TiAir_CONTROLDIR		= controldir;	// The controller dir
	TiAir.TiAir_LAYOUTDIR		= layoutdir;	// The layout dir
	
	// Setup Default App Namespaces
	TiAir.App = {
		Controller	: {},
		Layout		: {},
		Components	: {},
		Events		: {}		
	};
	
	// Intro log files (inspired by Fred Spencer...of course)	
	TiAir.log({ msg: '*** TiAir Framework Initialized ***', info: true });
	TiAir.log({ msg: '*** AUTHOR: Rick Blalock & Dawson Toth ***', info: true });
	TiAir.log({ msg: '*** APP Name: ' + appname + ' ***', info: true });
	TiAir.log({ msg: '*** Version: ' + version + ' ' + codename + ' ***', info: true });	
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
TiAir.setTheme = (function(theme) {
	Ti.include(TiAir.TiAir_APPDIR + '/themes/' + theme + '/styles.js');	
});

/**
 * Log Helper
 * @author Fred Spencer (unashamedly borrowed from Integrity because Fred is the man)
 * @param {object} params - Parameters to pass to the log function
 */
TiAir.log = (function(params) { 
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


