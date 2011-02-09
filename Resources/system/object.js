/**
 * Create a new namespace / object
 * @param {string} type - The type of object this will belong
 * @param {string} name - The name of the object to create
 * @param {function} callback - The callback function
 */
TiGantry.Create = (function(type, name, callback) {
	// If the object exists, don't recreate it
	// TODO Need a warning message to let the dev know he's trying to recreate something?
	// TODO Test this...does this even work right?
	if(TiGantry.App[type][name] != null) { 
		TiGantry.log({
			msg: type + ': ' + name + ' used', 
			info: true
		});
		return null; 
	} else {
		// Create the new object
		TiGantry.App[type][name] = callback;
		
		TiGantry.log({
			msg: type + ': ' + name + ' created', 
			info: true
		});
		
		return TiGantry.App[type][name];		
	}
});