/**
 * Includes a layout file
 * @param {string} layout - The layout file to include
 */
TiAir.Layout = (function(layout) {
	Ti.include(TiAir.TiAir_APPDIR + '/' + TiAir.TiAir_LAYOUTDIR + '/' + layout + '.js');
	
	return TiAir.App.Layout[layout]();
});