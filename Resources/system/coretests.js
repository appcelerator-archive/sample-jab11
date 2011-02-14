/**
 * Simple tests for the core framework
 */
TiAir.CoreTests = function() {
	
	TiAir.init(
		'0.1',			
		'test',		
		'testapp',	
		'system/tests',			
		'controllers',	
		'layouts'	
	);

	var controllerName = 'testcontroller';
	var testcontroller = TiAir.Controller(controllerName);
	
	// Controller can be loaded
	TiAir.Test('Load Controller', function() {
		if(typeof testcontroller == 'object') {
			return true;
		} else {
			return false;
		}
	});
	
	// Controller can return something from method
	TiAir.Test('Load Method', function() {
		if(testcontroller.load('init')) {
			return true;
		} else {
			return false;
		}
	});
	
	// Create an object member of the framework
	TiAir.Test('Create New TiAir Object', function() {
		var testNewObject = TiAir.Create('Controller', 'NewObjectTest', null);
		
		if(typeof TiAir.App.Controller.NewObjectTest == 'object') {
			return true;
		} else {
			return false;
		}		
	});
	
	// GET XHR Request
	(function() {
		TiAir.XHR({
			timeout: 5000,
			type: 'get',
			url: 'http://google.com',
			callback: function(data) {
				TiAir.Test('GET XHR Request', function() {
					return true;
				});	
			},
			onerror: function(e) {
				TiAir.Test('GET XHR Request', function() {
					return false;
				});	
			}
		});
	})();

};