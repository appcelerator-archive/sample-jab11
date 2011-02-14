/**
 * UI object for generating recurring UI's
 */	
TiAir.UI = {
	/**
	 * Main table creation wrapper with optional animation
	 *
	 * @param (array) data - The data to populate the table
	 * @param (object) styles - The styles / properties to pass in to the table
	 * @param (bool) anim - If table will be animated in
	 */
	createTable: function(data, styles, anim) {
		var tableview = Titanium.UI.createTableView(styles);
		tableview.setData(data);

		if(anim == true) {
			//TiAir.Animation.elemSlideIn(tableview, { top: 40 });
		}

		return tableview;
	}
	
};