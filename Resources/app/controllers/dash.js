/**
 * List controller
 */
TiAir.Create('Controller', 'Dash', function() {
	var Controller = this;
	this.window = TiAir.App.Windows.main;

	this.Layout = TiAir.Layout('dash');

	this.init = (function(isHome) {
		var win = this.window;
		
		this.actionButton();
		
		win.addEventListener('focus', function() {
			var data = Controller.setData();
	
			var table = TiAir.UI.createTable(data, TiAir.Styles.dash.table);
			
			win.add(table);			
		});
		
		if(isHome == null) {
			TiAir.App.Tabs.activeTab.open(win, { animated:true });
		}
	});
	
	// Set the data for the list
	this.setData = (function() {
		var data = [
			{ title: 'Joomla and Beyond App Coming Soon!' }
		];

		var rows = [];
		
		for(var i = 0; i < data.length; i++) {
			rows.push(this.Layout.createRow(data[i].title));
		}		
		
		return rows;
	});
	
	// Handle the add / creation button
	this.actionButton = (function() {
		var addButton = Ti.UI.createButton({systemButton: Ti.UI.iPhone.SystemButton.ADD});
		this.window.rightNavButton = addButton;
		TiAir.App.Events.addItem(addButton);
	});
	
});