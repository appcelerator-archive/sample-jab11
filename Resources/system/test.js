/**
 * Core Testing Helper
 */
TiGantry.Test = (function(funcName, testFunc) {
	var message = '** TIGANTRY TEST - ';
	var result = testFunc();
	
	if(result == true) {
		TiGantry.log({
			info: true,
			msg: message + funcName + ': PASSED - **' 
		});		
	} else {
		TiGantry.log({
			error: true,
			msg: message + funcName + ': FAILED - **'
		});
	}
});