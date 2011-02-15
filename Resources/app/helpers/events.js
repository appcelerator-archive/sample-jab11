/**
 * Events helper / wrapper
 */

// TODO - Maybe events should be separated from 'helpers' and placed elsewhere.  If we decide
// to make a central event architechture in the framework and for the app?

/**
 * Add item event
 */
TiAir.Create('Events', 'addItem', function(elem) {
	elem.addEventListener('click', function() {
		// Just filler stuff
		TiAir.App.Components.Storage.colls.users.create({ 
			'first_name': 'Rick',
			'last_name': 'Blalock'
		});		
		
		alert('Stored New Item');

		Ti.API.info(TiAir.App.Components.Storage.colls.users.find());
	});
});