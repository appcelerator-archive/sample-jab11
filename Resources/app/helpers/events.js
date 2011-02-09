/**
 * Events helper / wrapper
 */

/**
 * Add item event
 */
TiGantry.Create('Events', 'addItem', function(elem) {
	elem.addEventListener('click', function() {
		// Just filler stuff
		TiGantry.App.Components.Storage.colls.users.create({ 
			'first_name': 'Rick',
			'last_name': 'Blalock'
		});		
		
		alert('Stored New Item');

		Ti.API.info(TiGantry.App.Components.Storage.colls.users.find());
	});
});