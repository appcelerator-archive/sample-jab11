/**
 * Events helper / wrapper
 */

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