/*!
 * Titanium Air by Dawson Toth and Rick Blalock
 * http://www.appcelerator.com/
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
        applicationDirectory: 'app',
        pluginsDirectory: null,
        defaultURL: { controller: 'default', action: 'default' }
    };

    /**
     * Initializes TiAir, intelligently loading our application.
     * @param options
     */
    TiAir.init = function(options) {
        this.options = this.merge(options, this.options);
        this.initPlugins();
        this.initModels();
        this.initControllers();
        this.initViews();

        if (this.options.defaultURL) {
            this.openURL(this.options.defaultURL);
        }
    };

    TiAir.initPlugins = function() {
        if (TiAir.options.pluginsDirectory) {
            // TODO: init plugins
        }
    };
    /*
     The following functions manage our models.
     */
    var models = {};
    TiAir.initModels = function() {
        TiAir.iterateDirectory('models', function(result) {
            var model = null;
            eval(result.file.read().toString());
            if (model) {
                TiAir.createModel({
                    id: result.name.split('.').shift(),
                    value: model
                });
            }
        });
    };
    TiAir.createModel = function(args) {
        if (args == null) {
            throw 'TiAir :: Error :: No model passed to TiAir.createModel.';
        }
        if (args.id == null) {
            throw 'TiAir :: Error :: No id set on model passed to TiAir.createModel.';
        }
        models[args.id] = args.value;
    };
    TiAir.getModel = function(id) {
        if (models[id]) {
            return models[id];
        }
        throw 'TiAir :: Error :: No model with the id ' + id + ' exists.';
    };

    /*
     The following functions manage our controllers.
     */
    var controllers = {}, controllerID, actionID;
    TiAir.initControllers = function() {
        TiAir.iterateDirectory('controllers', function(result) {
            var controller = null;
            eval(result.file.read().toString());
            if (controller) {
                TiAir.createController({
                    id: result.name.split('.').shift(),
                    value: controller
                });
            }
        });
    };
    TiAir.createController = function(args) {
        if (args == null) {
            throw 'TiAir :: Error :: No controller passed to TiAir.createController.';
        }
        if (!args.id) {
            throw 'TiAir :: Error :: No id set on controller passed to TiAir.createController.';
        }
        controllers[args.id] = args.value;
    };
    TiAir.getController = function(id) {
        if (controllers[id]) {
            return controllers[id];
        }
        throw 'TiAir :: Error :: No controller with the id ' + id + ' exists.';
    };

    /*
     The following functions manage our views.
     */
    var views = {};
    TiAir.initViews = function() {
        TiAir.iterateDirectory('views', function(result) {
            TiAir.iterateDirectory('views/' + result.name, function (subResult) {
                var view = null;
                eval(subResult.file.read().toString());
                if (view) {
                    TiAir.createView({
                        controllerID: result.name,
                        id: subResult.name.split('.').shift(),
                        value: view
                    });
                }
            });
        });
    };
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
    TiAir.getView = function(controllerID, viewID) {
        var retVal = (views[controllerID] && views[controllerID][viewID]) || (views._shared && views._shared[viewID]);
        if (retVal == null) {
            throw 'TiAir :: Error :: No view found with id ' + viewID + '; searched in ' + controllerID + ' and _shared.';
        }
        return retVal;
    };

    TiAir.openURL = function(url) {
        var controller = this.getController(url.controller);
        controllerID = url.controller;
        actionID = url.action;

        if (controller.actions[actionID] == null) {
            throw 'TiAir :: Error :: No action found with id ' + actionID + ' in ' + controllerID;
        }

        var result = controller.actions[actionID]();
        // was something returned from the action?
        if (result != null) {
            // is it a window?
            var type = result.toString();
            if (type.split('Window').length > 1) {
                result.open();
            }
        }

        controllerID = null;
        actionID = null;
    };

    /**
     * Returns a view, mixing in any model data. Only operates from inside a controller,
     * and will throw an error if called otherwise.
     * @param {...number} var_args
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
                viewID = arguments[0];
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
     * Returns a view, mixing in any model data. Only operates from inside a controller,
     * and will throw an error if called otherwise.
     * @param id The id of the model to retrieve
     */
    context.AirModel = function(id) {
        var model = TiAir.getModel(id);
        return typeof model === 'function' ? model() : model;
    };

    /*
     * The following are utility functions that accomplish common programming tasks.
     */

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

    TiAir.iterateDirectory = function iterateDirectory(path, callback) {
        var dir = Ti.Filesystem.getFile(this.options.applicationDirectory, path);
        if (!dir.exists()) {
            throw 'TiAir.iterateDirectory :: ' + path + ' directory not found in ' + this.options.applicationDirectory;
        }
        var dirs = dir.getDirectoryListing();
        for (var i = 0, l = dirs.length; i < l; i++) {
            // ignore hidden files
            if (dirs[i].substr(0, 1) !== '.') {
                var file = Ti.Filesystem.getFile(dir.nativePath, dirs[i]);
                callback({
                    name: dirs[i],
                    path: file.nativePath,
                    file: file
                });
            }
        }
    };

})(TiAir, this);