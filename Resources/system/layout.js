/**
 * Includes a layout file
 * @param {string} layout - The layout file to include
 */
// TODO The idea here is have multiple static methods that make it easy to deal
// with the layout, styles, etc.  The below function should probably be a setLayout call
TiAir.Layout = (function(layout) {
	Ti.include(TiAir.TiAir_APPDIR + '/' + TiAir.TiAir_LAYOUTDIR + '/' + layout + '.js');
	
	return TiAir.App.Layout[layout]();
});