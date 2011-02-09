/**
 * List Layout
 *
 * @dependencies - Styles
 */
TiGantry.Create('Layout', 'dash', function() {
	// Assign a styles pointer for what's used here
	var Styles = TiGantry.Styles.dash;
	
	/**
	 * Creates a standard row, formatted for this layout
	 *	 
	 * @param {string} title - Text string	
	 */
	var createRow = function(title) {
		// Create and assign the the table row object
		var row = Titanium.UI.createTableViewRow(Styles.row);
		row.title = title;	
		
		return row;	
	};
	
	// Revealing module pattern.  Only return what is to be used and assigned from the controller
	return {
		createRow: createRow
	};
});