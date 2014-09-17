/*doc
---
title: Modal
type: component
name: modalJS
category: Javascript
author: Alex I.
---

Modals should be used for important actions or notifications on a page that should not result in a navigation to a new page. Examples include contact forms and login forms.

Class                   | Description
------------------------|-----------------------
`modal`                 | Positions the modal. Required.

Below is an example of a modal using a `box` component as the container.

```html_example
<div id="simpleModal" class="modal box boxBasic boxHighlight backgroundBasic">
  <div class="boxHead boxHeadBasic">
    <p>Ah! I'm trapped in a boxHead!</p>
  </div>
  <div class="boxBody">
    <button class="boxClose"><span role="presentation">&times;</span><span class="hideVisually">Close</span></button>
    <p>This box is highlighted with the little shadows.</p>
  </div>
  <div class="boxFoot boxFootBasic">
    <p>How'd I end up in this footer? Oh...you put a container with boxFoot and a skin like boxFootBasic around me.</p>
  </div>
</div>

<a class="modalLink" href="#">Show the modal</a>
```

```js_example
$(document).ready(function() {
  var container = $('#simpleModal');

  container.modal({
    mode: 'fixed',
    overlay: 'dark',
    closeable: false,
    width: 400
  });

  container.on('modal:close', function () {
    console.log('My modal was closed');
  });

  // attach open event to the .modalLink
  $('.modalLink').click(function(e) {
    e.preventDefault();
    container.modal('open');
  });
});
```

## jQuery Plugin: modal

Modals can be configured for any specific use. Below are the options available when creating your modal.

options         | description
----------------|-----------------------
`closeable`     | If set to true, the modal will be closed if it loses focus or Esc key is pressed. Default: true
`closeSelector` | Modal close handler is bound to elements matching this selector if found in the modal container. Default: '.boxClose'
`mode`          | Display mode. Defaults to `float`. Valid values: `float`, `fixed`, `inline`
                | `float` : the user can scroll the window but the modal stays in the viewport (default mode)
                | `fixed` : doesn't allow any movement on the screen, ie no scrolling
                | `inline` : when the user scrolls the window the modal may move outside the viewport
`overlay`       | Color of overlay. Defaults to no overlay (`neutral`). Valid values: `dark`, `light`, `neutral`
`width`         | Width of the modal. Default defined in `.modal`
**methods**     |
`open`          | Open the modal. Example: `container.modal('open')`;
`close`         | Close the modal. Example: `container.modal('close')`;
**events**      |
`modal:open`    | Triggered when modal is opened.
`modal:close`   | Triggered when modal is closed.

*/

function Modal(options)
{
  var me = this,
      emptyFunc = function(){};

  options = options || {};

  me.MODE_FIXED  = 'fixed';
  me.MODE_FLOAT  = 'float';
  me.MODE_INLINE = 'inline';

  // pie in the sky
  me.element = options.element;

  // display modes
  me.mode = options.mode || me.MODE_FLOAT;

  // flag for preventing deactivation with click on cover
  me.strict = options.strict || false;

  // cover type (dark, light, neutral)
  me.cover = options.cover || 'neutral';

  // active flag
  me.active = false;

  // cover storage
  me.coverElement = $('<div class="modalCover modalCover_'+me.cover+'"></div>');

  me.keyDownHandler = function (e)
  {
    // check for key modifiers
    // skip if any
    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey)
    {
      return;
    }

    // check if any input field is in focus
    if ($('input:focus, textarea:focus, select:focus').length)
    {
      return;
    }

    if (e.which === 27) // escape
    {
      e.preventDefault();
      me.deactivate(true);
    }
  };

  // set listeners
  me.listeners =
  {
    activate  : options.onActivate || emptyFunc, // fires every time modal window activated
    deactivate: options.onDeactivate || emptyFunc  // fires every time modal window deactivated
  };
}

// activates modal window
// callback will be called upon deactivation
Modal.prototype.activate = function Modal_activate()
{
  var me = this;

  if (this.active)
  {
    return;
  }

  // place modal cover
  this.coverElement.insertAfter(this.element);

  // deactivation listener
  // only if modal is not strict
  if (!this.strict)
  {
    this.coverElement.one('click', function()
    {
      me.deactivate(true);
    });
  }

  this.element.addClass('beingModal');

  if (this.mode == this.MODE_FIXED)
  {
    $('body').addClass('underModal');
  }
  else if (this.mode == this.MODE_INLINE)
  {
    this.element.addClass('inlineModal');
    this.element.css('top', $(window).scrollTop() + 'px');
  }

  this.active = true;

  if (!me.strict)
  {
    // listen for escape keyboard event
    $(document).on('keydown', me.keyDownHandler);
  }

  // let others know
  this.listeners.activate.call(this);
};

Modal.prototype.deactivate = function Modal_deactivate(initiatedByUser)
{
  initiatedByUser = (typeof initiatedByUser == 'boolean' ? initiatedByUser : false);

  // cleanup modal stuff
  this.coverElement.remove();
  $('body').removeClass('underModal');

  this.element.removeClass('beingModal');

  this.active = false;

  if (!this.strict)
  {
    // listen for escape keyboard event
    $(document).off('keydown', this.keyDownHandler);
  }

  // let others know
  this.listeners.deactivate.call(this, { initiatedByUser: initiatedByUser });
};

// jQuery plugin wrapper for Modal
(function($) {
  var modals = [],
      modalId = 0,
      methods;

  methods = {
    init: function (options) {
      if (typeof this.data('modalId') === 'number')
      {
        // prevent multiple initializations
        return;
      }

      var modalOptions,
          pluginOptions;

      pluginOptions = $.extend({}, $.fn.modal.defaults, options);

      // these will be passed to Modal constructor
      modalOptions = {
        cover: pluginOptions.overlay,
        mode: pluginOptions.mode,
        strict: !pluginOptions.closeable
      };

      return this.each(function () {
        var modal,
            self = this,
            config;

        // item specific options
        config = {
          element: $(this),
          onActivate: function () {
            $(self).triggerHandler('modal:open', [ modal ]);
            $(self).show();
          },
          onDeactivate: function (params) {
            $(self).triggerHandler('modal:close', [ modal, params ]);
            $(self).hide();
          }
        };

        // merge in the common options for each modal
        $.extend(config, modalOptions);
        modal = new Modal(config);

        // resize and center if width provided
        if (pluginOptions.width)
        {
          $(this).css({
            width: pluginOptions.width + 'px',
            marginLeft: (0 - Math.floor(pluginOptions.width / 2)) + 'px'
          });
        }

        // bind close
        $(this).find(pluginOptions.closeSelector).click(function (e) {
          e.preventDefault();
          modal.deactivate(true);
        });

        // keep reference to modal
        modals[modalId] = modal;
        $(this).data('modalId', modalId);
        modalId++;
      });
    },

    open: function () {
      return this.each(function () {
        var modal = modals[$(this).data('modalId')];

        if (modal)
        {
          modal.activate();
        }
      });
    },

    close: function () {
      return this.each(function () {
        var modal = modals[$(this).data('modalId')];

        if (modal)
        {
          modal.deactivate();
        }
      });
    }
  };

  $.fn.modal = function (method) {
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
      $.error('Method ' +  method + ' does not exist on jQuery.modal');
    }
  };

  $.fn.modal.defaults = {
    overlay: 'neutral',
    closeable: true,
    closeSelector: '.boxClose',
    width: false    // false will use default from Modal
  };

}(jQuery));

