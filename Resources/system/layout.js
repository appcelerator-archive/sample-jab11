/**
 * Includes a layout file
 * @param {string} layout - The layout file to include
 */
TiGantry.Layout = (function(layout) {
	Ti.include(TiGantry.TIGANTRY_APPDIR + '/' + TiGantry.TIGANTRY_LAYOUTDIR + '/' + layout + '.js');
	
	return TiGantry.App.Layout[layout]();
});