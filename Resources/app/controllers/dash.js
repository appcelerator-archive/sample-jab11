/**
 * List controller
 */
TiGantry.Create('Controller', 'Dash', function() {
	var Controller = this;
	this.window = TiGantry.App.Windows.main;

	this.Layout = TiGantry.Layout('dash');

	this.init = (function(isHome) {
		var win = this.window;
		
		this.actionButton();
		
		win.addEventListener('focus', function() {
			var data = Controller.setData();
	
			var table = TiGantry.UI.createTable(data, TiGantry.Styles.dash.table);
			
			win.add(table);			
		});
		
		if(isHome == null) {
			TiGantry.App.Tabs.activeTab.open(win, { animated:true });
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
		TiGantry.App.Events.addItem(addButton);
	});
	
});