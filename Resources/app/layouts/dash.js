/**
 * List Layout
 */
TiAir.Create('Layout', 'dash', function() {
	// Assign a styles pointer for what's used here
	var Styles = TiAir.Styles.dash;
	
	/**
	 * Creates a standard row, formatted for this layout
	 *	 
	 * @param {string} title - Text string	
	 */
	var createRow = function(title) {
		var row = Titanium.UI.createTableViewRow(Styles.row);
		row.title = title;	
		
		return row;	
	};
	
	// Revealing module pattern
	return {
		createRow: createRow
	};
});