(function (factory) {
    if (typeof exports === "object" && exports &&
        typeof module === "object" && module && module.exports === exports) {
        // Browserify. Attach to jQuery module.
        factory(require("jquery"));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    'use strict';

    var pluginName = 'optionalInput';

    var events = {
        CHANGE: 'optional-input.change'
    };

    var placeholder = '';

    function Plugin($el, options) {

        this.value = _setValue;

        var _el = $el;
        var _options = options,
            _checkbox = null,
            _savedValue = null,
            _value = _options.value;

        init();

        function updateValue() {
            var newVal = !_checkbox.is(':checked') ? null : _el.val();
            if(newVal !== _value) {
                _value = newVal;
                _el.trigger(events.CHANGE, [_value]);
            }
        }

        function init() {

            _checkbox = $('<input type="checkbox">');

            _el.attr('placeholder', _options.lang.placeholder);

            _checkbox.css({
                position: 'absolute',
                padding: '0',
                margin: '0'
            });

            var wrapper = _el.wrap('<div></div>').parent();
            wrapper.css('position', 'relative');
            wrapper.css('display', _el.css('display'));
            wrapper.append(_checkbox);

            var wrapperHeight = wrapper.innerHeight();
            var checkboxMargin =  parseInt(_checkbox.css('margin-left'));
            var checkboxLeft = parseInt((wrapperHeight - _checkbox.innerHeight()) / 2) - checkboxMargin;
            var checkboxHeight = _checkbox.outerHeight(true);
            var textIndent = _checkbox.innerHeight() + parseInt(_el.css('padding-left')) + 2*checkboxMargin + (checkboxMargin < 1 ? 1 : 0);

            _checkbox.css('top', parseInt((wrapperHeight - checkboxHeight) / 2) + 'px');
            _checkbox.css('left', checkboxLeft + 'px');

            _el.css('-webkit-box-sizing', 'border-box');
            _el.css('-moz-box-sizing', 'border-box');
            _el.css('box-sizing', 'border-box');

            _el.css('text-indent', textIndent + 'px');

            _checkbox.on('change', _onCheckChange);
            _el.on('change', _onInputChange);

            _setValue(_options.value);

        }

        function _setValue(val) {

            if (arguments.length === 0) {
                return _value;
            }

            if (val === null) {
                _setChecked(false);
                _setInputState(false);
            } else {
                _setInputState(true);
                _setChecked(true);
                _el.val(val);
            }

            updateValue();

        }

        function _setChecked(isChecked) {
            _checkbox.prop('checked', !!isChecked);
        }

        function _setInputState(isChecked) {
            if (!isChecked) {
                _savedValue = _el.val();
                _el.attr('placeholder', _options.lang.placeholder);
                _el.val('');
                _el.attr('disabled', 'disabled');
            } else {
                _el.attr('disabled', null);
                _el.attr('placeholder', null);
                _el.val(_savedValue);
            }
        }

        function _onCheckChange() {
            var isChecked = _checkbox.is(':checked');
            _setInputState(isChecked);
            if (isChecked) {
                _el.focus();
            }
            updateValue();
        }

        function _onInputChange() {
            updateValue();
        }

    }

    $.fn[pluginName] = function(opt) {

        var args = Array.prototype.slice.call(arguments, 1);
        var method = 'init';

        var options = $.extend({}, $.fn[pluginName].defaults);
        if (typeof opt === 'string') {
            method = opt;
        } else if ($.isPlainObject(opt)) {
            options = $.extend(options, opt);
        }

        if (method === 'value') {
            var plugin = this.data(pluginName+'.plugin');
            if ((plugin instanceof Plugin)) {
                if (args.length > 0) {
                    plugin.value.call(plugin, args[0]);
                } else {
                    return plugin.value.call(plugin)
                }
            }
            return this;
        }

        return this.filter('input').each(function() {

            var $el = $(this);
            var plugin = $el.data(pluginName + '.plugin');

            if (method === 'init' && !(plugin instanceof Plugin)) {
                plugin = new Plugin($el, options);
                $el.data(pluginName+'.plugin', plugin);
            } else if (plugin instanceof Plugin) {
                if (typeof plugin[method] === 'function') {
                    plugin[method].call(plugin, args);
                }
            }

            return this;

        });
    };

    $.fn[pluginName].defaults = {
        value: null,
        lang: {
            placeholder: 'Not set'
        }
    }

}));
