/*doc

---
title: Tooltips
name: tooltip
type: component
category: Javascript
author: August Flanagan, JD Cantrell, Vince Lum
---

Tooltips are a way to give the user a little more information when they focus on a form field, or hover over a particular element on the screen.

There are a few ways to use tooltips. The easiest being:

```html_example
  <span id="tooltipExample1" data-tooltip="I am a tooltip">i have a tooltip</span>
```

```js_example
$(document).ready(function () {
  $('#tooltipExample1').tooltip();
});
```

 Tooltips are versatile, and there are a lot of options you can pass to the tooltip function. Here's a list of all the options.

  option                    |    description
 ---------------------------|--------------------------------------
 `anchor`                   | Position to anchor the tooltip relative to the target (Default: right). Valid values: `top`, `right`, `bottom`, `left`, `righttop`, `topright`, `bottomright`
 `selector`                 | Selector for a pre-rendered tooltip element to use. false to automatically generate tooltip (Default: false).
 `trigger`                  | 'hover' to bind the tooltip to mouseenter/mouseleave events (Default: hover).
 `skin`                     | Skin to use for the tooltip (Default: tooltipLight). Valid values: `tooltipLight`, `tooltipDark`
 `delay`                    | Delay in ms before the tooltip appears after hover (Default: 200).
 `offset`                   | Offset of the tooltip formatted as string '5x10' (Default: 0x0).
 `hasStem`                  | If the tooltip should have a stem (Default: true).
 `content`                  | Provide the content for the tooltip (Default: Uses content data attribute of target element).
 `css`                      | Add custom css properties to the tooltip. For example: { zIndex: 5 }  (Default: {})


To make things easy you can also define the `anchor` and `skin` options as data attributes. For example

```html_example
  <span id="tooltipExample2Top" data-tooltip="I am a tooltip" data-tooltip-anchor="top" data-tooltip-skin="tooltipDark">i have a dark top tooltip</span>
  <br />
  <span id="tooltipExample2TopRight" data-tooltip="I am a tooltip" data-tooltip-anchor="topright" data-tooltip-skin="tooltipDark">i have a dark topright tooltip</span>
  <br />
  <span id="tooltipExample2Right" data-tooltip="I<br>am<br>a<br>tooltip" data-tooltip-anchor="right" data-tooltip-skin="tooltipDark">i have a dark right tooltip</span>
  <br />
  <span id="tooltipExample2RightTop" data-tooltip="I<br>am<br>a<br>tooltip" data-tooltip-anchor="righttop" data-tooltip-skin="tooltipDark">i have a dark righttop tooltip</span>
```

```js_example
$(document).ready(function () {
  $('#tooltipExample2Top').tooltip();
  $('#tooltipExample2TopRight').tooltip();
  $('#tooltipExample2Right').tooltip();
  $('#tooltipExample2RightTop').tooltip();
});
```

To pass options to the tooltip function just pass a javascript object (hash) like this:

```html_example
  <a id="tooltipExample3" href="#">i have a dark top tooltip</a>
  <br />
  <a id="tooltipExample4" href="#">i have a light bottom stemless tooltip</a>
```

```js_example
$(document).ready(function () {
  $('#tooltipExample3').tooltip({anchor: 'top', skin: 'tooltipDark', content: 'some content'});
  $('#tooltipExample4').tooltip({anchor: 'bottom', skin: 'tooltipLight', hasStem: false, content: 'some content'});
});
```


In addition to the options that can be passed to initialize a tooltip there are also a number of methods that can be called

methods            | description
-------------------|-------------------------
`toggle`           | Toggle the tooltip visibility. `$('.foo').tooltip('toggle');`
`enable`           | Show the tooltip when the hover event is triggered. `$('.foo').tooltip('enable');`
`disable`          | Don't show the tooltip when the hover event is triggered. `$('.foo').tooltip('disable');`
`show`             | Force the tooltip to show.  `$('.foo').tooltip('show');`
`hide`             | Hide a showing tooltip. `$('.foo').tooltip('hide');`
`remove`           | Remove the tooltip from DOM and remove triggers. `$('.foo').tooltip('remove');`
`content`          | Set the tooltip contents. `$('.foo').tooltip('content', 'My tip contents');`

 */

(function ($) {
  var fixIE = "",
      ieVersion;
  if ((typeof document.all !== "undefined") && navigator.userAgent.match(/MSIE ([78])/)) {
    ieVersion = RegExp.$1;
    fixIE = '<span class="before ie ie' + ieVersion + '"></span>'; // generate <span class="before ie ie7"></span> (ie7 or ie8 class is generated)
  }

  //this contains all tooltips
  var tooltip_set = null;

  //event handlers
  var _showHandler = function () {
    var data = $(this).data('tooltip-config');
    if (data.disabled) {
      return;
    }

    data.hover_state = 'in';
    if (data.delay) {
      setTimeout(function () {
        if (data.hover_state === 'in') {
          showTooltip(data);
        }
      }, data.delay);
    }
    else {
      showTooltip(data);
    }
  };

  var _hideHandler = function () {
    var data = $(this).data('tooltip-config');
    data.hover_state = 'out';
    if (data.delay) {
      setTimeout(function () {
        if (data.hover_state === 'out') {
          hideTooltip(data);
        }
      }, data.delay);
    }
    else {
      hideTooltip(data);
    }
  };

  var _toggleHandler = function () {
    var data = $(this).data('tooltip-config');
    if (!data.hover_state || data.hover_state === 'out') {
      _showHandler.call(this);
    }
    else {
      _hideHandler.call(this);
    }
  };

  //exported functions
  var showTooltip = function (data) {
    //hide all other tooltips
    if (tooltip_set && !data.tooltip.is(':visible')) {
      tooltip_set.hide();

      var stemSize, width, height, targetHeight, tooltipHeight;

      //TODO: respect position, animation and delay
      var pos = data.target.offset();
      var offset = data.offset.split('x');
      if (offset.length > 0) {
        offset[0] = parseInt(offset[0], 10);
      }

      if (offset.length > 1) {
        offset[1] = parseInt(offset[1], 10);
      }

      // set the correct stem size for positioning calculations
      // this includes 1px of positioning space
      if (data.hasStem) {
        stemSize = 7;
      }
      else {
        stemSize = 1;
      }

      var targetWidth = 0;

      switch (data.anchor) {
      case 'right':
        width = data.target.outerWidth(true);
        height = data.target.outerHeight();

        data.tooltip.css({
          position: 'absolute',
          top: (pos.top - height / 2) - offset[1],
          left: (pos.left + width + stemSize) + offset[0] // move left the width of the target + stem + user defined offset
        });
        break;
      case 'left':
        width = data.tooltip.outerWidth(true);
        height = data.target.outerHeight();

        data.tooltip.css({
          position: 'absolute',
          display: 'none',
          visibility: 'visible',
          top: (pos.top - height / 2 - 2) - offset[1],  // -2 is really annoying, but fixes the layout in chrome, firefox
          left: (pos.left - width - stemSize) - offset[0] // negative left (i.e. right) the width of the tooltip + stem + user defined offset
        });
        break;
      case 'bottom':
        height = data.target.outerHeight(true);
        data.tooltip.css({
          position: 'absolute',
          top: (pos.top + height + stemSize) + offset[1],  // move down the height of the target + stem + user defined offset
          left: (pos.left - stemSize) + offset[0]
        });
        break;
      case 'top':
        height = data.tooltip.outerHeight(true);
        data.tooltip.css({
          position: 'absolute',
          top: (pos.top - height - stemSize) - offset[1], // move up the height of the tooltip + stem + user defined offset
          left: (pos.left - stemSize) + offset[0],
          display: 'none',
          visibility: 'visible'
        });
        break;
      case 'righttop':
        width = data.target.outerWidth(true);
        targetHeight = data.target.outerHeight(true);
        tooltipHeight = data.tooltip.outerHeight(true);

        data.tooltip.css({
          position: 'absolute',
          top: (pos.top - tooltipHeight + targetHeight + stemSize) - offset[1],
          left: (pos.left + width + stemSize) + offset[0] // move left the width of the target + stem + user defined offset
        });
        break;
      case 'topright':
        height = data.tooltip.outerHeight(true);
        width = data.tooltip.outerWidth(true);
        targetWidth = data.target.outerWidth(true);

        data.tooltip.css({
          position: 'absolute',
          top: (pos.top - height - stemSize) - offset[1],
          left: (pos.left - width + targetWidth) - offset[0],
          display: 'none',
          visibility: 'visible'
        });
        break;
      case 'bottomright':
        height = data.target.outerHeight(true);
        width = data.tooltip.outerWidth(true);
        targetWidth = data.target.outerWidth(true);

        data.tooltip.css({
          position: 'absolute',
          top: (pos.top + height + stemSize) + offset[1],  // move down the height of the target + stem + user defined offset
          left: (pos.left - width + targetWidth + stemSize) - offset[0],
          display: 'none',
          visibility: 'visible'
        });
        break;
      }

      data.tooltip.fadeIn();

      // hide tooltip on mouseleave if trigger is hover
      if (data.trigger === 'hover')
      {
        data.tooltip.on('mouseenter.tooltip', function () {
          data.hover_state = 'in';
        });

        data.tooltip.on('mouseleave.tooltip', function () {
          hideTooltip(data);
        });
      }
    }
  };

  var updateOptionFromDatas = function (link, options, optionProp, dataName) {
    var data = $(link).data(dataName);
    if (typeof data !== 'undefined') {
      options[optionProp] = data;
    }
  };

  var hideTooltip = function (data) {
    data.tooltip.fadeOut();
  };

  var methods = {
    init: function (defaultOptions) {
      defaultOptions = $.extend({
        anchor:        'right', // Tooltip will be anchored relative to the target. e.g. `'right' => [target] <[tooltip]`
        selector:      false,
        trigger:       'hover',
        skin:          'tooltipLight',
        delay:         200,
        offset:        '0x0',
        content:       '',
        hasStem:       true,
        css:           {}
      }, defaultOptions);

      return this.each(function () {
        var data = $(this).data('tooltipConfig');
        var tooltipEl;
        //copy the options object
        var options = $.extend({}, defaultOptions);

        //update options.anchor from data-tooltipe-anchor
        updateOptionFromDatas(this, options, "anchor", "tooltipAnchor");
        //update options.skin from data-tooltip-skin
        updateOptionFromDatas(this, options, "skin", "tooltipSkin");

        if (!data) {
          if (options.selector !== false) {
            tooltipEl = $(options.selector).addClass(options.skin);
          }
          else {
            var content = options.content || $(this).data('tooltip');
            tooltipEl = $('<span class="' + 'tooltip ' +  options.skin + '">' + fixIE + content + '</span>');
            if (ieVersion)
            {
              tooltipEl.addClass('ie' + ieVersion);
            }
            $('body').append(tooltipEl);
          }

          if (tooltip_set === null) {
            tooltip_set = $(tooltipEl);
          }
          else {
            tooltip_set.add(tooltipEl);
          }

          // Stem classnames correspond to where the stem is relative to the tooltip.
          var anchorStemPositions = {
            right:  'Left',
            left:   'Right',
            bottom: 'Top',
            top:    'Bottom',
            righttop: 'LeftBottom',
            topright: 'BottomRight',
            bottomright: 'TopRight'
          };

          // by default tooltips have a stem. you can turn it off by passing hasStem: false as an option
          // we also want to check whether we should be showing a compact stem or not.
          if (options.hasStem) {
            tooltipEl.addClass('tooltipStem' + anchorStemPositions[options.anchor]);
          }

          tooltipEl.css(options.css);

          data = {
            target: $(this),
            tooltip: tooltipEl,
            trigger: options.trigger,
            delay: options.delay,
            anchor: options.anchor,
            offset: options.offset,
            hasStem: options.hasStem
          };

          $(this).data('tooltip-config', data);
          if (options.trigger === 'hover') {
            $(this).on('mouseenter.tooltip', _showHandler);
            $(this).on('mouseleave.tooltip', _hideHandler);
          }
          else if (options.trigger === 'click') {
            $(this).on('click.tooltip', _toggleHandler);
          }
        }
      });
    },

    toggle: function () {
      return this.each(function () {
        var data = $(this).data('tooltip-config');
        if (data && data.tooltip && data.tooltip.text()) {
          if (data.tooltip.is(':visible')) {
            hideTooltip(data);
          }
          else {
            showTooltip(data);
          }
        }
      });
    },

    enable: function () {
      return this.each(function () {
        var data = $(this).data('tooltip-config');
        if (data && data.tooltip && data.tooltip.text()) {
          data.disabled = false;
          $(this).data('tooltip-config', data);
        }
      });
    },

    disable: function () {
      return this.each(function () {
        var data = $(this).data('tooltip-config');
        if (data && data.tooltip && data.tooltip.text()) {
          data.disabled = true;
          $(this).data('tooltip-config', data);
        }
      });
    },

    show: function () {
      return this.each(function () {
        var data = $(this).data('tooltip-config');
        if (data && data.tooltip && data.tooltip.text()) {
          showTooltip(data);
        }
      });
    },

    hide: function () {
      return this.each(function () {
        var data = $(this).data('tooltip-config');
        if (data && data.tooltip) {
          hideTooltip(data);
        }
      });
    },

    remove: function () {
      return this.each(function () {
        var data = $(this).data('tooltip-config');
        if (data && data.tooltip) {
          data.tooltip.remove();
          $(this).off('.tooltip');
          $(this).removeData('tooltip-config');
        }
      });
    },

    // Give an html string or jQuery object and the tooltip content will
    // be updated.
    content: function (html) {
      return this.each(function () {
        var data = $(this).data('tooltip-config');
        if (data.tooltip) {
          data.tooltip.html(html);
        }
      });
    }
  };

  // ## $.tooltip()
  //
  // Custom jQuery tooltip plugin that can handle anchoring a tooltip to any
  // element.
  //
  // Most of the implementation for this plugin is above. This is simply the
  // code for adding it to the jQuery namespace.
  //
  // ### TODO:
  //
  // * Add support for anchoring to mouse.
  $.fn.tooltip = function (method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    }
    else {
      $.error('Method ' + method + ' does not exist on jQuery.tooltips');
    }
  };

}(jQuery));
