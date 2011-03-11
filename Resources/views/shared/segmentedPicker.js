/*
 {
 style: '',
 selectMultiple: true,
 onSelect: function() {
 },
 onDeselect: function() {
 },
 options: ['Facebook', 'Twitter']
 }

 */

view = function(model) {
    var picker = new View({
        className: 'SegmentedPicker'
    });
    if (!picker.layout) {
        picker.layout = 'horizontal';
    }

    this.selected = [];

    function createOption(option) {
        // based on what they pass in, wrap strings with labels
        var view = typeof option != 'string'
                ? option
                : new Label({
            text: option,
            className: 'SegmentedPickerText'
        });

        // initialize whether or not the view is selected
        view.selected = view.selected || false;

        function syncUI() {
            $(view).applyStyle('Label', {
                className: 'SegmentedPickerText' + (view.selected ? 'Selected' : 'Deselected')
            });
        }
        syncUI();

        view.select = function() {
            view.selected = true;
            model.onSelect && model.onSelect({ source: view });
            syncUI();
        };
        view.deselect = function() {
            view.selected = false;
            model.onDeselect && model.onDeselect({ source: view });
            syncUI();
        };
        $(view).click(function(evt) {
            view[view.selected ? 'deselect' : 'select']();
        });

        return view;
    }

    for (var i = 0, l = model.options.length; i < l; i++) {
        picker.add(createOption(model.options[i]));
    }
    return picker;
};