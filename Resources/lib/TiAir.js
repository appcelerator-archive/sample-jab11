/*!
 * Titanium Air by Dawson Toth and Rick Blalock
 * https://github.com/dawsontoth/TiAir
 *
 * Provides a light, dynamic, MVC framework for building Titanium Mobile applications.
 *
 * Portions of this code base are directly taken from or derived from the Appcelerator Redux project by Dawson Toth.
 * https://github.com/dawsontoth/Appcelerator-Titanium-Redux
 *
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

var TiAir = {};
(function(TiAir, context) {

    /**
     * Define our default options. These will take affect if the user does not pass anything to the init function.
     */
    TiAir.options = {
        defaultURL: { controller: 'default', action: 'default' },
        navigator: 'default',
        controllers: [],
        models: [],
        views: {}
    };

    /**
     * The following are private variables, and should not be altered.
     */
    var models = {};
    var views = {};
    var controllers = {}, controllerID, actionID;
    var navigator;
    var openCache = {};

    /**
     * Initializes TiAir, intelligently loading our application.
     * @param options
     */
    TiAir.init = function(options) {
        this.options = this.merge(options, this.options);

        this.initModels();
        this.initViews();
        this.initControllers();

        this.initNavigator();

        if (this.options.defaultURL) {
            this.openURL(this.options.defaultURL);
        }
    };

    /**
     * Initializes the models passed in to TiAir.init.
     */
    TiAir.initModels = function() {
        if (!this.options.models || !this.options.models.length) {
            throw 'TiAir :: Error :: No models passed in to TiAir.init.';
        }
        TiAir.iterateFiles(this.options.models, function(result) {
            if (!result.file.exists()) {
                throw 'TiAir :: Error :: Model passed in to TiAir.init does not exist: ' + result.file.nativePath;
            }
            var model = null;
            eval(result.file.read().toString());
            if (model) {
                TiAir.createModel({
                    id: result.name.split('.').shift(),
                    value: model
                });
            }
            else {
                Ti.API.warn('TiAir :: Warning :: Model ' + result.file.nativePath.split('.') + '');
            }
        }, 'models');
    };

    /**
     * Creates a model.
     * @param args
     */
    TiAir.createModel = function(args) {
        if (args == null) {
            throw 'TiAir :: Error :: No model passed to TiAir.createModel.';
        }
        if (args.id == null) {
            throw 'TiAir :: Error :: No id set on model passed to TiAir.createModel.';
        }
        models[args.id] = args.value;
    };

    /**
     * Retrieves a model by its id.
     * @param id
     */
    TiAir.getModel = function(id) {
        if (models[id]) {
            return models[id];
        }
        throw 'TiAir :: Error :: No model with the id ' + id + ' exists.';
    };

    /**
     * Initializes the navigator passed in to TiAir.init.
     */
    TiAir.initNavigator = function() {
        var navigator = null;
        eval(Ti.Filesystem.getFile('navigators/' + this.options.navigator).read().toString());
        if (navigator) {
            TiAir.createNavigator({
                id: this.options.navigator.split('.').shift(),
                value: navigator
            });
        }
        else {
            throw 'TiAir :: Error :: No navigator found with id ' + this.options.navigator + ' in navigators directory.';
        }
        navigator.init(this);
    };

    /**
     * Creates a navigator.
     * @param args
     */
    TiAir.createNavigator = function(args) {
        if (args == null) {
            throw 'TiAir :: Error :: No navigator passed to TiAir.createNavigator.';
        }
        if (!args.id) {
            throw 'TiAir :: Error :: No id set on navigator passed to TiAir.createNavigator.';
        }
        navigator = args.value;
    };

    /**
     * Gets a particular navigator.
     */
    TiAir.getNavigator = function() {
        return navigator;
    };

    /**
     * Initializes the controllers passed in to TiAir.init.
     */
    TiAir.initControllers = function() {
        if (!this.options.controllers || !this.options.controllers.length) {
            throw 'TiAir :: Error :: No controllers passed in to TiAir.init.';
        }
        TiAir.iterateFiles(this.options.controllers, function(result) {
            if (!result.file.exists()) {
                throw 'TiAir :: Error :: Controller passed in to TiAir.init does not exist: ' + result.file.nativePath;
            }
            var controller = null;
            eval(result.file.read().toString());
            if (controller) {
                TiAir.createController({
                    id: result.name.split('.').shift(),
                    value: controller
                });
            }
        }, 'controllers');
    };

    /**
     * Creates a controller so that it can later be used.
     * @param args
     */
    TiAir.createController = function(args) {
        if (args == null) {
            throw 'TiAir :: Error :: No controller passed to TiAir.createController.';
        }
        if (!args.id) {
            throw 'TiAir :: Error :: No id set on controller passed to TiAir.createController.';
        }
        controllers[args.id] = args.value;
    };

    /**
     * Retrieves a controller based on its id.
     * @param id
     */
    TiAir.getController = function(id) {
        if (controllers[id]) {
            return controllers[id];
        }
        throw 'TiAir :: Error :: No controller with the id ' + id + ' exists.';
    };

    /**
     * Initializes the views passed in to the TiAir.init function.
     */
    TiAir.initViews = function() {
        if (!this.options.views) {
            throw 'TiAir :: Error :: No views passed in to TiAir.init.';
        }
        TiAir.iterateFiles(this.options.views, function(result) {
            if (!result.file.exists()) {
                throw 'TiAir :: Error :: View passed in to TiAir.init does not exist: ' + result.file.nativePath;
            }
            var view = null;
            eval(result.file.read().toString());
            if (view) {
                TiAir.createView({
                    controllerID: result.base.split('/').pop(),
                    id: result.name.split('.').shift(),
                    value: view
                });
            }
        }, 'views');
    };

    /**
     * Creates a view so that it can be later retrieved and displayed.
     * @param args
     */
    TiAir.createView = function(args) {
        if (args == null) {
            throw 'TiAir :: Error :: No view passed to TiAir.createView.';
        }
        if (!args.id) {
            throw 'TiAir :: Error :: No id set on view passed to TiAir.createView.';
        }
        if (!args.controllerID) {
            throw 'TiAir :: Error :: No controllerID set on view passed to TiAir.createView.';
        }
        if (!views[args.controllerID]) {
            views[args.controllerID] = {};
        }
        views[args.controllerID][args.id] = args.value;
    };

    /**
     * Retrieves a view based on the controller and view ids.
     * @param controllerID
     * @param viewID
     */
    TiAir.getView = function(controllerID, viewID) {
        var retVal = (views[controllerID] && views[controllerID][viewID]) || (views.shared && views.shared[viewID]);
        if (retVal == null) {
            throw 'TiAir :: Error :: No view found with id ' + viewID + '; searched in ' + controllerID + ' and shared.';
        }
        return retVal;
    };

    /**
     * Opens a particular URL, mapping any arguments onto a particular controller's action, then calling the navigator.
     * Note that views are cached, so subsequent calls to open an identical URL will load up much quicker.
     * @param url
     */
    TiAir.openURL = function(url) {
        var controller = this.getController(url.controller);
        var hash;
        for (var n in url) {
            hash += n + ':' + url[n] + '/';
        }
        var args = Array().slice.call(arguments);
        var navigator = this.getNavigator();

        var toOpen;
        if (openCache[hash]) {
            toOpen = openCache[hash];
        }
        else {
            // determine which view needs to be loaded
            controllerID = url.controller;
            actionID = url.action;
            if (controller.actions[actionID] == null) {
                throw 'TiAir :: Error :: No action found with id ' + actionID + ' in ' + controllerID;
            }
            // dynamically map arguments in the URL to the arguments in the action
            var actionArgs = [], expectedArgs = controller.actions[actionID].toString().split('(')[1].split(')')[0].split(',');
            if (expectedArgs.length > 0 && expectedArgs[0] != '') {
                for (var i = 0, l = expectedArgs.length; i < l; i++) {
                    actionArgs.push(url[expectedArgs[i].split(' ').join('')]);
                }
            }
            // call the view
            toOpen = controller.actions[actionID].apply(controller.actions, actionArgs);
            if (url.cache) {
                openCache[hash] = toOpen;
            }
        }

        if (toOpen != null) {
            args.splice(1, 0, toOpen);
            navigator.open.apply(navigator, args);
        }
    };

    /**
     * Closes the particular view, passing the request on to the navigator.
     * @param view The view that should be closed.
     */
    TiAir.close = function(view) {
        this.getNavigator().close(view);
    };

    /**
     * Returns a view, mixing in any model data.ll throw an error if called otherwise.
     * @param {...number} var_args An optional string in the form "viewName" or "controller/viewName", followed by an optional model.
     */
    context.AirView = function() {
        if (!controllerID || !actionID) {
            throw 'TiAir :: Error :: View called from outside of a controller or action.';
        }
        var viewID, model;
        // no arguments? show the view with the same id as the action, then.
        if (arguments.length == 0) {
            viewID = actionID;
        }
        else {
            if (typeof arguments[0] === 'string') {
                var url = arguments[0].split('/');
                if (url.length == 1) {
                    viewID = url[0];
                }
                else {
                    controllerID = url[0];
                    viewID = url[1];
                }
                model = arguments.length > 1 && arguments[1];
            }
            else {
                viewID = actionID;
                model = arguments[0];
            }
        }
        var view = TiAir.getView(controllerID, viewID);
        return typeof view === 'function' ? view(model || {}) : view;
    };

    /**
     * Returns a view, mixing in any model data.
     * @param id The id of the model to retrieve
     */
    context.AirModel = function(id) {
        var model = TiAir.getModel(id);
        return typeof model === 'function' ? model() : model;
    };

    /**
     * Returns the response from an action.
     * @param url The url of the action to call
     * @param {...number} var_args Any arguments that should be passed to the action.
     */
    context.AirAction = function(url) {
        var controller = TiAir.getController(url.controller);
        actionID = url.action;
        if (controller.actions[actionID] == null) {
            throw 'TiAir :: Error :: No action found with id ' + actionID + ' in ' + controllerID;
        }
        var currentActionID = actionID;
        // dynamically map arguments in the URL to the arguments in the action
        var actionArgs = [], expectedArgs = controller.actions[actionID].toString().split('(')[1].split(')')[0].split(',');
        if (expectedArgs.length > 0 && expectedArgs[0] != '') {
            for (var i = 0, l = expectedArgs.length; i < l; i++) {
                var expectedArg = expectedArgs[i].split(' ').join('');
                actionArgs.push(url[expectedArg]);
            }
        }

        // call the action
        var retVal = controller.actions[actionID].apply(controller.actions, actionArgs);
        actionID = currentActionID;
        return retVal;
    };

    /**
     * Merges the properties of the two objects. Taken from redux.
     * @param {Object} original
     * @param {Object} overrider
     */
    TiAir.merge = function merge(original, overrider) {
        if (original == null) {
            return overrider || {};
        }
        if (overrider == null) {
            return original;
        }
        for (var index in overrider) {
            if (overrider.hasOwnProperty(index)) {
                if (typeof original[index] == 'undefined') {
                    original[index] = overrider[index];
                } else if (typeof overrider[index] == 'object') {
                    original[index] = merge(original[index], overrider[index]);
                }
            }
        }
        return original;
    };

    /**
     * Iterates through the files represented in the passed in enumerable.
     * @param arr An array, object, or object of arrays to iterate over.
     * @param callback A function that will be called once for each value in the enumerable.
     */
    TiAir.iterateFiles = function iterateFiles(arr, callback, base) {
        if (arr.length) {
            // arrays contain file names; pass our results to the callback
            for (var i = 0, l = arr.length; i < l; i++) {
                callback({
                    file: (base && Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, base, arr[i]))
                            || Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, arr[i]),
                    name: arr[i],
                    base: base
                });
            }
        }
        else {
            // but objects contain child properties with arrays of child file names (the properties are folders)
            for (var p in arr) {
                // recurse on it, setting it as the base
                iterateFiles(arr[p], callback, base + '/' + p);
            }
        }
    };

})(TiAir, this);