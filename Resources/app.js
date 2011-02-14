(function() {
	
	// Include framework files
	Ti.include('system/core.js');
	
	// Set app preferences
	TiAir.init(
		'0.1',			// App version
		'Zergling',		// App version name
		'jab11',		// Name of app
		'app',			// Location of app directory
		'controllers',	// Location of controllers directory
		'layouts'		// Location of layouts directory	
	);
	
	// Set the theme
	TiAir.setTheme('default');
	
	// Include app files - Plugins first, then components, helpers, and anything else
	Ti.include(
		'app/plugins/TiStorage.js',
		'app/components/storage.js',  
		'app/helpers/ui.js', 
		'app/helpers/events.js'
	); 
	
	// Object that stores all the app windows
	TiAir.App.Windows = {
		main: Ti.UI.createWindow(TiAir.Styles.mainWindow)
	};
	
	// Set the main window data title
	TiAir.App.Windows.main.title = 'Joomla and Beyond';
	
	// ----- Build the tabs ----- //
	TiAir.App.Tabs = Ti.UI.createTabGroup();
	
	var window_tab = Ti.UI.createTab({  
	    title: 'Joomla and Beyond',
	    window: TiAir.App.Windows.main
	});
	
	// Load the default controller
	var list = TiAir.Controller('Dash');
	list.execute('init', true);
	
	// Add the tabs to the window
	TiAir.App.Tabs.addTab(window_tab);
	TiAir.App.Tabs.open();

})();

// *** For testing only.  Comment out the controllers loaded above to avoid errors.  REMOVE FOR PRODUCTION //
//(function() {
//	Ti.include('system/test.js');
//	Ti.include('system/coretests.js');
//	TiAir.CoreTests();	
//})();
// *** //