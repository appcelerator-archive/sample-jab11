/**
 * TiStorage Component
 */	
TiAir.Create('Components', 'Storage', (function() {
	var conn = new TiStorage();
	
	// Database listing
	var dbs = {
		tweetrdone: conn.use('jab11')
	};
	
	// Collection listing
	var colls = {
		users: dbs.tweetrdone.collection('users')
	};
	
	// Revealing module pattern.  Return only what's needed
	return {
		databases: dbs,
		colls: colls
	};	
})());