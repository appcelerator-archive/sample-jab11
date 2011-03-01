navigator = {
    __mainWindow: new Window({ id: 'MainWindow' }),
    __fadeIn: new Animation({ className: 'FadeIn' }),
    __fadeOut: new Animation({ className: 'FadeOut' }),
    __popOut: new Animation({ className: 'PopOut' }),
    __popIn: new Animation({ className: 'PopIn' }),
    __store: {},
    init: function(TiAir) {
        this.__mainWindow.open({ animate: this.__fadeIn });
    },
    open: function(url, target, evt) {
        var animation = this.__fadeIn;
        target.opacity = 0;
        if (url.navigatorOptions) {
            switch (url.navigatorOptions.animate) {
                case 'pop':
                    animation = this.__popOut;
                    target.poppedTransform = target.transform = Ti.UI.create2DMatrix().translate(evt.globalPoint.x - target.width / 2, evt.globalPoint.y - target.height / 2).scale(0.1, 0.1);
                    break;
            }
        }
        this.__mainWindow.add(target);
        target.animate(animation);
        // TODO: branch logic based on target and result
    },
    close: function(target) {
        var animation = this.__fadeIn;
        if (target.poppedTransform) {
            animation = this.__popIn;
            this.__popIn.transform = target.poppedTransform;
        }
        target.animate(animation, function() {
            this.__mainWindow.remove(target);
        });
    }
};