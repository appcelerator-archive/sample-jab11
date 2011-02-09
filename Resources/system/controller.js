/**
 * The parent controller
 * @param {string} controller - The controller that is to be loaded
 */
TiGantry.Controller = (function(controller) {
	
	this.controller = null;
	
	// Include the controller file
	Ti.include(TiGantry.TIGANTRY_APPDIR + '/' + TiGantry.TIGANTRY_CONTROLDIR + '/' + controller + '.js');

	// Instantiate the desired controller
	this.controller = new TiGantry.App.Controller[controller]();
	
	// Execute a specific method in the controller
	this.execute = function(methodName, args) {
		this.controller[methodName](args);
	};
	
	// Return a method of the controller (different from execute())
	this.load = function(methodName, args) {
		return this.controller[methodName](args);
	};
	
	// Set the window for the controller
	this.setWindow = function(win) {
		this.controller.window = win;
	};
	
	// return the global controller object
	return this;
});