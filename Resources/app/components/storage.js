/**
 * TiStorage Component
 */	
TiGantry.Create('Components', 'Storage', (function() {
	var conn = new TiStorage();
	
	// Database listing
	var dbs = {
		tweetrdone: conn.use('tweetrdone')
	};
	
	// Collection listing
	var colls = {
		tasks: dbs.tweetrdone.collection('tasks')
	};
	
	// Revealing module pattern.  Return only what's needed
	return {
		databases: dbs,
		colls: colls
	};	
})());