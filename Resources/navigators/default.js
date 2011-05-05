navigator = {
    __mainWindow: new Window({ id: 'MainWindow' }),
    __animations: {
        fade: {
            visible: new Animation({ className: 'FadeIn' }),
            hidden: new Animation({ className: 'FadeOut' })
        },
        pop: {
            visible: new Animation({ className: 'PopOut' }),
            hidden: new Animation({ className: 'PopIn' })
        },
        slide: {
            visible: new Animation({ className: 'SlideIn' }),
            hidden: new Animation({ className: 'SlideOut' })
        }
    },
    __store: {},
    init: function(TiAir) {
        for (var key in this.__animations) {
            $(this.__animations[key].visible).complete(function(evt) {
                evt.source.target.fireEvent('open', evt);
            });
            $(this.__animations[key].hidden).complete(function(evt) {
                navigator.__mainWindow.remove(evt.source.target);
            });
        }

        this.__mainWindow.opacity = 0;
        this.__mainWindow.open(this.__animations.fade.visible);
    },
    open: function(url, target, evt) {
        if (Ti.Android) {
            // if we're on Android, open the target straight away.
            this.__mainWindow.add(target);
            return;
        }
        // but on iPhone, we add some flair / animation to the opening.
        var animation = this.__animations.fade.visible;
        target.opacity = 0;
        this.__mainWindow.add(target);
        if (target.navigatorOptions = url.navigatorOptions) {
            switch (target.navigatorOptions.animate) {
                case 'pop':
                    animation = this.__animations.pop.visible;
                    var x = (evt.globalPoint && evt.globalPoint.x && (evt.globalPoint.x - target.width / 2))
                            || (Ti.Platform.DisplayCaps.platformWidth / 2);
                    var y = (evt.globalPoint && evt.globalPoint.y && (evt.globalPoint.y - target.height / 2))
                            || (Ti.Platform.DisplayCaps.platformHeight / 2);
                    target.poppedTransform = target.transform =
                            Ti.UI.create2DMatrix()
                                    .translate(x, y)
                                    .scale(0.1, 0.1);
                    break;
                case 'tabSlide':
                    animation = this.__animations.slide.visible;
                    target.transform = this.__animations.slide.hidden.transform;
                    break;
                case 'modal':
                    throw 'Not Yet Implemented';
            }
        }
        animation.target = target;
        target.animate(animation, function() {
            warn('open fired!');
            target.fireEvent('open');
        });
    },
    close: function(target) {
        if (Ti.Android) {
            // if we're on Android, close the target straight away.
            this.__mainWindow.remove(target);
            return;
        }
        // but on iPhone, we add some flair / animation to the closing.
        var animation = this.__animations.fade.hidden;
        if (target.navigatorOptions) {
            switch (target.navigatorOptions.animate) {
                case 'pop':
                    animation = this.__animations.pop.hidden;
                    this.__animations.pop.hidden.transform = target.poppedTransform;
                    break;
                case 'tabSlide':
                    animation = this.__animations.slide.hidden;
                    break;
                case 'modal':
                    throw 'Not Yet Implemented';
            }
        }
        animation.target = target;
        target.animate(animation);
    }
};