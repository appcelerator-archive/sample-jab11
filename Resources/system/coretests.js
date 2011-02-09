/**
 * Simple tests for the core framework
 */
TiGantry.CoreTests = function() {
	
	TiGantry.init(
		'0.1',			
		'test',		
		'testapp',	
		'system/tests',			
		'controllers',	
		'layouts'	
	);

	var controllerName = 'testcontroller';
	var testcontroller = TiGantry.Controller(controllerName);
	
	// Controller can be loaded
	TiGantry.Test('Load Controller', function() {
		if(typeof testcontroller == 'object') {
			return true;
		} else {
			return false;
		}
	});
	
	// Controller can return something from method
	TiGantry.Test('Load Method', function() {
		if(testcontroller.load('init')) {
			return true;
		} else {
			return false;
		}
	});
	
	// Create an object member of the framework
	TiGantry.Test('Create New TiGantry Object', function() {
		var testNewObject = TiGantry.Create('Controller', 'NewObjectTest', null);
		
		if(typeof TiGantry.App.Controller.NewObjectTest == 'object') {
			return true;
		} else {
			return false;
		}		
	});
	
	// GET XHR Request
	(function() {
		TiGantry.XHR({
			timeout: 5000,
			type: 'get',
			url: 'http://google.com',
			callback: function(data) {
				TiGantry.Test('GET XHR Request', function() {
					return true;
				});	
			},
			onerror: function(e) {
				TiGantry.Test('GET XHR Request', function() {
					return false;
				});	
			}
		});
	})();

};