(function ($) {
  var btnClassRegexp = /(btn(Default|Primary|Danger))/g;

  function updateView($label, selectedText, $input) {
    $label.html(selectedText);
    // if we have a combobox set the val of the input to the selection
    if ($input.length) {
      $input.val(selectedText);
    }
  }

  var methods = {
    init: function (options) {

      var labelTextFn = function ($el, $select, $label, $input) {
        return $select.find(':selected').text();
      };

      if (options && options.labelTextFn) {
        labelTextFn = options.labelTextFn;
      }

      return this.each(function () {
        var $el = $(this);
        if ($el.data('selectInit') !== true) {
          var $label = $el.find('.selectLabel'),
              $select = $el.find('select'),
              $input = $el.find('input'),
              $display = $el.find('.selectDisplay'),
              btnClass = $display.attr('class').match(btnClassRegexp),
              hoverClass = 'btnDefaultHover';

          if (btnClass && btnClass.length) {
            hoverClass = btnClass.pop() + 'Hover';
          }

          //Prevent multiple initializations
          $el.data('selectInit', true);
          $el.data('labelTextFn', labelTextFn);

          $select.on('change', function () {
            updateView($label, labelTextFn($el, $select, $label, $input), $input);
          });

          $select.on('mouseenter mouseleave', function () {
            $display.toggleClass(hoverClass);
          });
        }
      });
    },

    refresh: function () {
      return this.each(function () {
        var $el = $(this);
        if ($el.data('selectInit')) {
          var $label = $el.find('.selectLabel'),
              $select = $el.find('select'),
              $input = $el.find('input');
          updateView($label, $el.data('labelTextFn')($el, $select, $label, $input), $input);
        }
      });
    },

    set: function(value)
    {
      return this.each(function() {
        var $el = $(this),
          $label = $el.find('.selectLabel'),
          $select = $el.find('select'),
          $input = $el.find('input');

        if ($select.length && $el.data('selectInit')) {
          $select.val(value);
          $input.val(value);
          updateView($label, $el.data('labelTextFn')($el, $select, $label, $input), $input);
        }
      });
    }
  };

  $.fn.truliaSelect = function (method) {
    if (typeof method === 'string' && typeof methods[method] === 'function') {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    }
  };

}(jQuery));
