/*doc
---
title: Sticky
category: Javascript
name: sticky
author: August
tested: no where
---

Make an element stick in place on a page. The menu on this page is an example of this.

*Note that this will:*

1. take an element out of the document flow and
2. mess with any inline styles you might have on the element, but you don't do that right? RIGHT?

```js_example
$(document).ready(function () {
  $('.componentMenu').sticky({css: {top: '10px'}, toggleClass: 'foo'});
});
```

## jQuery Plugin: Sticky

options               | description
----------------------|----------
`scrollyOffset`       | An offset parameter that will be passed to the internal call of `$.scrolly()`
`css`                 | Any css that you want applied to the element when it is becomes "sticky". Passing a `top` value is a great way to get custom positioning.
`targetEl`            | You can make another element "sticky" when a user scrolls to the element that `$.sticky()` is called on.
`toggleClass`         | Pass a class that will be applied to the element when it becomes sticky. (great for toggling visibility, etc)
`useComputedWidth`    | If true, will calculate and set the element's width before it is taken out of the page flow.
`screenBottomOffset`  | Screen PageYOffset where it should stop being sticky
*/

(function ($) {
  $.fn.sticky = function (options) {
    options = $.extend({
      scrollyOffset: 0,
      css: null,
      targetEl: null,
      toggleClass: '',
      useComputedWidth: false,
      screenBottomOffset: null
    }, options);

    var $this = $(this),
    thisPosTop = '';

    if ($this.data('stickyInit') !== true) {
      //Prevent multiple initializations
      $this.data('stickyInit', true);

      if (options.useComputedWidth)
      {
        var forceWidthSize = $this.width();
        options.css = $.extend(options.css, {'width': forceWidthSize + 'px'});
      }

      var $targetEl = $(options.targetEl).length ? $(options.targetEl) : $this;
      var targetScroll = $targetEl.offset().top + options.scrollyOffset;

      $this.on('scrolly:atSetPoint', function (event, scrollDown) {
        var $el = $this;
        if (options.css !== null) {
          // apply css when going down the page
          if (scrollDown) {
            $el.css(options.css);
          }
          else {
            // TODO: there has to be a better way than this
            $el.attr("style", "");
          }
        }

        $el.toggleClass('sticky').toggleClass(options.toggleClass);
      });

      // If we have screenBottomOffset defined, we stop scrolling the element when window.pageYOffset hit options.screenBottomOffset defined value.
      // We stop the scrolling by removing the sticky class and changing the position to absolute.
      if (options.screenBottomOffset !== null)
      {
        $(window).scroll(function() {

          if (window.pageYOffset > options.screenBottomOffset && $this.data('scrollLimitInit') !== true)
          {
            thisPosTop = $this.css('top');
            $this.css('top', $this.position().top);
            $this.css('position', 'absolute');
            $this.removeClass('sticky');
            $this.data('scrollLimitInit', true);
          }

          if (window.pageYOffset < options.screenBottomOffset && $this.data('scrollLimitInit') === true)
          {
            $this.addClass('sticky');
            $this.css('top', thisPosTop);
            $this.css('position', '');
            $this.data('scrollLimitInit', false);
          }
        });
      }

      // bind scrolly to this element
      $this.scrolly({offset: targetScroll});
    }
  };
}(jQuery));

