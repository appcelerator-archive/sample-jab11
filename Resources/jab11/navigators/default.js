navigator = {
    __mainWindow: new Window({ id: 'MainWindow' }),
    __fadeIn: new Animation({ className: 'FadeIn' }),
    __fadeOut: new Animation({ className: 'FadeOut' }),
    __popOut: new Animation({ className: 'PopOut' }),
    __popIn: new Animation({ className: 'PopIn' }),
    __slideIn: new Animation({ className: 'SlideIn' }),
    __slideOut: new Animation({ className: 'SlideOut' }),
    __store: {},
    init: function(TiAir) {
        this.__mainWindow.opacity = 0;
        this.__mainWindow.open(this.__fadeIn);
    },
    open: function(url, target, evt) {
        var animation = this.__fadeIn;
        target.opacity = 0;
        this.__mainWindow.add(target);
        if (target.navigatorOptions = url.navigatorOptions) {
            switch (target.navigatorOptions.animate) {
                case 'pop':
                    animation = this.__popOut;
                    target.poppedTransform = target.transform =
                            Ti.UI.create2DMatrix()
                                    .translate(evt.globalPoint.x - target.width / 2, evt.globalPoint.y - target.height / 2)
                                    .scale(0.1, 0.1);
                    break;
                case 'tabSlide':
                    animation = this.__slideIn;
                    target.transform = this.__slideOut.transform;
                    break;
                case 'modal':
                    throw 'Not Yet Implemented';
            }
        }
        target.animate(animation);
    },
    close: function(target) {
        var animation = this.__fadeIn;
        if (target.navigatorOptions) {
            switch (target.navigatorOptions.animate) {
                case 'pop':
                    animation = this.__popIn;
                    this.__popIn.transform = target.poppedTransform;
                    break;
                case 'tabSlide':
                    animation = this.__slideOut;
                    break;
                case 'modal':
                    throw 'Not Yet Implemented';
            }
        }
        target.animate(animation, function() {
            this.__mainWindow.remove(target);
        });
    }
};