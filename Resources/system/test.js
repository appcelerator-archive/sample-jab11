/**
 * Core Testing Helper
 */
TiAir.Test = (function(funcName, testFunc) {
	var message = '** TiAir TEST - ';
	var result = testFunc();
	
	if(result == true) {
		TiAir.log({
			info: true,
			msg: message + funcName + ': PASSED - **' 
		});		
	} else {
		TiAir.log({
			error: true,
			msg: message + funcName + ': FAILED - **'
		});
	}
});