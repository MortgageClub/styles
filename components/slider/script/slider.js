/*doc
---
title: Slider
name: slider
category: Javascript
author: Alex I. and JD
---

```html_example
<div id="income_slider" class="slider" data-min="1" data-value="5" data-max="10" data-step=".01">
  <span class="sliderLine"></span>
  <span class="sliderHandle"></span>
  <input type="hidden" id="medianIncome" name="medianIncome">
</div>
<div id="income_display">$5 / hour</div>
```

Here's an example of the slider on a `heatMapBar`:

```html_example
<div id="commute_slider" class="slider" data-min="5" data-value="45" data-max="60" data-step="5" data-direction="rtl">
  <span class="sliderLine heatMapBar"></span>
  <span class="sliderHandle"></span>
  <input type="hidden" id="commuteTime" name="commuteTime">
</div>
<div id="commute_time_display">45 min</div>

```

```js_example
$(document).ready(function () {
  $('#income_slider').truliaSlider();
  $('#medianIncome').on('change', function (event) {
    $('#income_display').html('$' + parseFloat($(this).val()).toFixed(2) + '/ hour');
  });

  $('#commute_slider').truliaSlider();
  $('#commuteTime').on('change', function (event) {
    $('#commute_time_display').html($(this).val() + ' min');
  });
});
```

This slider is similar to HTML5's `<input type="range">`, but it should
work in all browsers. You may use the slider as is without any
javascript, but in that case it will be up to you to use css to set the
handle's left position correctly. If there is an input inside the
`slider` class element it will get set to current value of the slider.
You can use the input element to listen to value changes to the slider.
If starting the slider in hidden state, call set when showing the slider
the first time.

method          | description
----------------|------------------------
`set`        | Set the value of the slider
*/
;(function ($) {
  var getWidths = function (slider, handle, stops) {
    return {
      width: (slider.width() - handle.width()),
      stopSize: (slider.width() - handle.width()) / stops
    };
  };

  var transformCoordinate = function (rawX, data) {
    var widths = getWidths(data.slider.slider, data.slider.handle, data.slider.stops),
        direction = data.direction === 'rtl' ? -1 : 1,
        leftValue = data.direction === 'rtl' ? data.max : data.min,
        rightValue = data.direction === 'rtl' ? data.min : data.max,
        value, x;
    if (rawX <= 0) {
      value = leftValue;
      x = 0;
    }
    else if (rawX >= (widths.width)) {
      value = rightValue;
      x = widths.width;
    }
    else {
      //now calculate the nearest stop position
      if (data.step) {
        var idx = Math.round(rawX / widths.stopSize);
        value =  idx * data.step * direction + leftValue;
        x =  idx * widths.stopSize;
      }
      else {
        value = (rawX / (widths.width)) * (rightValue - leftValue) + leftValue;
        x = rawX;
      }
    }
    return {left: x, value: value};
  };

  var transformValue = function (value, data) {
    var x,
        direction = data.direction === 'rtl' ? -1 : 1,
        leftValue = data.direction === 'rtl' ? data.max : data.min,
        rightValue = data.direction === 'rtl' ? data.min : data.max,
        widths = getWidths(data.slider.slider, data.slider.handle, data.slider.stops);

    if (value === Math.min(leftValue, rightValue, value)) {
      value = Math.min(leftValue, rightValue);
      x = data.direction === 'rtl' ? widths.width : 0;
    }
    else if (value === Math.max(leftValue, rightValue, value)) {
      value = Math.max(leftValue, rightValue);
      x = data.direction === 'rtl' ? 0 : widths.width;
    }
    else {
      if (data.step) {
        x =  ((value - leftValue) / data.step) * widths.stopSize * direction;
      }
      else {
        x = ((value - leftValue) * (rightValue - leftValue)) / widths.width * direction;
      }
    }

    data.slider.handle.css({left: x});
    data.slider.input.val(value).trigger('change');
  };

  var getPageX = function(event) {
    var eventPageX;
    if(self.isTouch) {
      var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
      eventPageX = touch.pageX;
    } else {
      eventPageX = event.pageX;
    }

    return eventPageX;
  };

  this.isTouch      = ('ontouchstart' in window);
  this.START_EVENT  = this.isTouch ? 'touchstart' : 'mousedown';
  this.MOVE_EVENT   = this.isTouch ? 'touchmove' : 'mousemove';
  this.END_EVENT    = this.isTouch ? 'touchend' : 'mouseup';
  var self = this;

  var methods = {
    init: function () {
      return this.each(function () {

        var slider = $(this);
        var handle = slider.find('.sliderHandle');

        var data = slider.data();
        var stops = Math.floor((data.max - data.min) / data.step);

        //update data
        data.slider = {
          stops: stops,
          slider: slider,
          handle: handle,
          input: slider.find('input'),
          offset: 0
        };

        //store our data
        $(this).data(data);

        var moveHandle = function (event) {
          var pos = slider.offset();
          var eventPageX = getPageX(event);
          var val = transformCoordinate(eventPageX - pos.left - data.slider.offset, data);
          data.slider.input.val(val.value).trigger('change');
          data.slider.handle.css({left: val.left });
        };

        data.slider.handle.on(self.START_EVENT, function (event) {
          var eventPageX = getPageX(event);

          data.slider.offset = eventPageX - data.slider.handle.offset().left;
          $(document)
          .on(self.MOVE_EVENT + '.slider', moveHandle)
          .on(self.END_EVENT + '.slider', function (event) {
            $(this).off(self.MOVE_EVENT + '.slider', moveHandle);
          });
        }).on('click', function (event) {
          event.stopPropagation();
        });

        slider.on('click', moveHandle);

        if (data.value) {
          transformValue(data.value, data);
        }
      });
    },

    set: function (value) {
      transformValue(value, $(this).data());
    }
  };

  $.fn.truliaSlider = function (method) {
    if (typeof method === 'string' && typeof methods[method] === 'function') {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    }
  };

}(jQuery));
