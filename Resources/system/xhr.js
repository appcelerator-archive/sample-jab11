/**
 * XHR Object
 * @param {Object} opts - Options for the XHR request
 */
TiGantry.XHR = (function(opts) {
	// Setup the xhr object
	var xhr = Ti.Network.createHTTPClient();

	/**
		AVAILABLE OPTIONS
		
		timeout 	: int Timeout request
		type		: string GET/POST
		data		: mixed The data to pass
		url			: string The url source to call
		onerror		: funtion A function to execute when there is an XHR error
	*/

	// Set the timeout or a default if one is not provided
	xhr.timeout = (opts.timeout) ? opts.timeout : 10000;	

	// Error Handling
	xhr.onerror = function(e) {
		if(opts.onerror) {
			opts.onerror(e);				
		} else {
			TiGantry.log({
				error: true,
				msg: e
			});
		}
	};


	// Execute when xhr is loaded
	xhr.onload = function() {
		// If successful
		try 
		{
			if(this.responseText == null) {
				TiGantry.log({
					debug: true,
					msg: this
				});
			} else {
				// Store the response
				var data = this.responseText;

				if(opts.callback) {
					// Execute a callback function
					opts.callback(data);					
				} else {
					return data;
				}
			}
		}
		// If not successful
		catch(e) 
		{
			if(opts.onerror) {
				opts.onerror(e);				
			} else {
				TiGantry.log({
					error: true,
					msg: e
				});
			}
		};
	};
	
	// Open the remote connection
	if(opts.type) {
		xhr.open(opts.type, opts.url);	
	} else {
		xhr.open('GET', opts.url);
	}
	

	if(opts.data) {
		// send the data
		xhr.send(opts.data);	
	} else {
		xhr.send(null);
	}
	
});
