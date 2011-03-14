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
        className: model.className + 'SegmentedPicker SegmentedPicker'
    });
    if (!picker.layout) {
        picker.layout = 'horizontal';
    }

    this.selected = [];

    function createOption(option, isLeftCap, isRightCap) {
        // based on what they pass in, wrap strings with labels
        var text = typeof option != 'string'
                ? option
                : new Label({
            text: option,
            className: model.className + 'SegmentedPickerText SegmentedPickerText'
        });
        var container = new View({
            className: model.className + 'SegmentedPickerView SegmentedPickerView'
        });
        container.add(text);
        container.text = text;

        // initialize whether or not the view is selected
        container.selected = container.selected || false;

        function syncUI() {
            var append = container.selected ? 'Selected' : 'Deselected';
            var className;
            if (isLeftCap) {
                className = 'SegmentedPickerLeft' + append;
            }
            else if (isRightCap) {
                className = 'SegmentedPickerRight' + append;
            }
            else {
                className = ' SegmentedPickerCenter' + append;
            }
            $(container).applyStyle('View', { className: className });
            $(text).applyStyle('Label', { className: 'SegmentedPickerText' + append });
        }
        syncUI();

        container.select = function() {
            container.selected = true;
            model.onSelect && model.onSelect({ source: container });
            syncUI();
        };
        container.deselect = function() {
            container.selected = false;
            model.onDeselect && model.onDeselect({ source: container });
            syncUI();
        };
        $(container).click(function(evt) {
            container[container.selected ? 'deselect' : 'select']();
        });

        return container;
    }

    for (var i = 0, l = model.options.length; i < l; i++) {
        picker.add(createOption(model.options[i], i == 0, i == l-1));
    }
    return picker;
};