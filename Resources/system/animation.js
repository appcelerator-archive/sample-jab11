/**
 * Animation helper
 */
TiAir.Animation = {
	/**
	 * Element Slide In
	 *
	 * @param {object} elem - The Ti object to animate
	 * @param {object} position - Any positioning props
	 */	
	elemSlideIn: function(elem, position) {
		var a = Ti.UI.createAnimation();
		var positionProps = Object.keys(position);
		
		for (var i = 0; i < positionProps.length ; i++) {
			a[positionProps[i]] = position[positionProps[i]];
		};
		
		a.opacity 	= 1;
		a.duration 	= 500;
		
		elem.animate(a);
	},
	
	/**
	 * Element Slide Out
	 *
	 * @param {object} elem - The Ti object to animate
	 * @param {object} position - Any positioning props
	 */	
	elemSlideOut: function(elem, position) {
		var a = Ti.UI.createAnimation();
		var positionProps = Object.keys(position);
		
		for (var i = 0; i < positionProps.length ; i++) {
			a[positionProps[i]] = position[positionProps[i]];
		};
		
		a.opacity 	= 0;
		a.duration 	= 500;
		
		elem.animate(a);
	}
};