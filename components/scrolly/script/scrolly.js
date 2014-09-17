/*doc
---
title: Scrolly
category: Javascript
name: scrolly
author: August (based on previous work by JD Cantrell and Derek Reynolds)
---

Trigger an event when an element hits the top of the page (+/- an optional offset)


```js_example
$(document).ready(function () {
  $('foo').scrolly();
});
```

## jQuery Plugin: Scrolly

options              | description
---------------------|----------
`offset`             | vertical offset that will determine where on the page the element is (in relation to top of the window) when `scrolly:atSetPoint` event is fired. (default is 0)
**events**           |
 `scrolly:atSetPoint`| Triggered when the element hits top of the window (+/- the offset that was passed in). Listeners will recieve the event and a boolean flag representing the direction the user was scrolling in `true` == scrolling down the page.

*/

(function ($) {

  var methods = {
    init : function(options) {
      return this.each(function () {
        var scrollData = {};

        options = $.extend({
          offset: 0
        }, options);

        if ($(this).data('scrollyInit') !== true) {
          //Prevent multiple initializations
          $(this).data('scrollyInit', true);

          scrollData.$el = $(this);
          scrollData.$container = $(window);
          scrollData.offset = options.offset;

          // set callback function for scroll event
          scrollData.$container.on('scroll', function(event){
            methods.scrolly(event, scrollData);
          });

          // fire it once to get the page in the right state
          scrollData.$container.triggerHandler('scroll');
        }
      });
    },

    scrolly : function(event, scrollData) {
      // the element is below the top of the screen (or top - an offset)
      var elBelowScrollPoint = (scrollData.$container.scrollTop() < scrollData.offset);

      // the element hit our scroll point (scrolling from bottom of page to top)
      // trigger event and set scrolly as having been deactivated
      if (elBelowScrollPoint && scrollData.$el.data('scrolly')) {
        scrollData.$el.data('scrolly', false);
        scrollData.$el.triggerHandler('scrolly:atSetPoint', [false]);
      }
      // the element has moved above the scroll point and we have not yet registered it
      // trigger event and set scrolly as having been activated
      else if (!elBelowScrollPoint && !scrollData.$el.data('scrolly')) {
        scrollData.$el.data('scrolly', true);
        scrollData.$el.triggerHandler('scrolly:atSetPoint', [true]);
      }

    }
  };


  $.fn.scrolly = function (method) {
    if (typeof method === 'string' && typeof methods[method] === 'function')
    {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    else if (typeof method === 'object' || ! method)
    {
      return methods.init.apply(this, arguments);
    }
    else
    {
      $.error('Method ' +  method + ' does not exist on jQuery.scrolly');
    }
  };
}(jQuery));

