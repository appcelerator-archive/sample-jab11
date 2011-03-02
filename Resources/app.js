/*
 * Include the libraries we will use. These libraries are NOT dependent on each other.
 */
Ti.include('TiStorage.js');
Ti.include('redux.js');
Ti.include('TiAir.js');

Ti.UI.backgroundImage = 'jab11/content/images/loading.withoutbar.png';
var used = [
    Ti.UI.createView, Ti.UI.createLabel, Ti.UI.createImageView, Ti.UI.createButton,
    Ti.UI.createWindow, Ti.UI.createWebView, Ti.UI.createAnimation, Ti.Map.createView,
    Ti.UI.create2DMatrix, Ti.UI.createScrollView, Ti.UI.createTableView, Ti.UI.createTableViewRow
];

/*
 * Include our various styles. We chose to use redux for this project, but TiAir has no dependency on redux.
 */
includeRJSS(
        'jab11/content/styles/common.rjss',
        'jab11/content/styles/default.rjss',
        'jab11/content/styles/about.rjss');
/*
 * Call the init function. This will intelligently load our application, and call the default controller's action.
 */
TiAir.init({
    applicationDirectory: 'jab11',
    theme: 'default',
    defaultURL: { controller: 'default', action: 'list' }
});