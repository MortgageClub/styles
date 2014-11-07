;;
$(document).ready(function() {
  $('.boxClose').click(function() {
    $(this).closest('.box').fadeOut('slow');
  });
});
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

/*doc
---
title: Navigation
type: component
name: navigationJS
category: Javascript
author: Vince Lum
---

A Navigation Set is a list that provides an interface to change the current content a user is viewing.

Class           | Description
----------------|-------------
`nav`           | Base navigation class to display inline list.
`navDefault`    | Default skin for navigation item.

```html_example
<ul id="navSet" class="nav navDefault">
  <li><a href="#">Nav one</a></li>
  <li class="intro"><a href="#">Intro paragraph</a></li>
  <li><a href="http://www.google.com/" target="_blank" follow="true" >Google link</a></li>
</ul>
<div id="contentContainer" class="box boxBasic">
  <div class="boxBody mvm">
    Click a list item above.
  </div>
</div>
```

```js_example
$(document).ready(function () {
  $('#navSet').navigationSet({
    selected: false
  });

  // bind to navigation set change
  $('#navSet').on('nav:change', function (e, $li, index) {
    if ($li.hasClass('intro'))
    {
      $.get('index.html', function (data) {
        var description = $(data).find('p').eq(0).text();
        $('#contentContainer .boxBody').html('Gotten via ajax: <p>' + description + '</p>');
      });
    }
    else
    {
      $('#contentContainer .boxBody').text('Clicked: ' + $li.find('a').text());
    }
  });
});
```

## jQuery Plugin: navigationSet

options         | description
----------------|----------
`selected`      | Pre-select a link in the set. false will select none. Default: 0 (first link in the list). `$('.navList').navigationSet({selected: 2 });`
**methods**     |
 `select`       | Select a navigation link. The nav:change event will be triggered as if the link received a click. `$('.navList').navigationSet('select', 1);`
**events**      |
 `nav:change`   | Triggered when the currently selected link changes. Listeners will recieve the event, li that was clicked and the index of the list item. `$('#navSet').on('nav:change', function (e, li, index) { alert(li.text()); });`

*/

(function ($) {
    function disableLink(li)
    {
      var link = $(li).find('a');

      link.hide();
      $(li).append('<span class="active">' + link.html() + '</span>');
    }

    function enableLink(li)
    {
      $(li).find('.active').remove();
      $(li).find('a').show();
    }

    var methods = {
      init: function (options)
      {
        return this.each(function () {
          var tabBodies,
              bodySelector,
              tabSet = this,
              methods = {},
              config = $.extend({
                selected: 0          // which list item is selected, 0 indexed
              }, options);

          if ($(this).data('navInit') !== true) {
            //Prevent multiple initializations
            $(this).data('navInit', true);

            // select the tab, false means none are selected
            if (config.selected !== false)
            {
              disableLink($(this).find('>li').eq(config.selected));
              $(this).data('selected', config.selected);
            }

            bodySelector = $(this).data('body');

            // bind to change event to do stuff
            $(this).on('click', 'li a', function (e) {
              var listItem = $(this).parent('li'),
                  current = $(tabSet).data('selected');

              // unselect other tabs
              if (typeof current !== 'undefined' && !isNaN(current))
              {
                enableLink($(tabSet).find('>li').eq(current));
              }

              disableLink(listItem);

              $(tabSet).trigger('nav:change', [listItem, listItem.index()]);

              // keep track of our selected link
              $(tabSet).data('selected', listItem.index());

              // links can just work normally
              if ($(this).attr('follow') !== 'true')
              {
                e.preventDefault();
              }
            });
          }
        });
      },
      select: function (index)
      {
        return this.each(function () {
          var selected = $(this).find('>li').eq(index),
              current = $(this).data('selected');

          if (index === false)
          {
            // unselect active link
            enableLink($(this).find('>li').eq(current));
          }
          else if (selected.find('.active').length < 1)
          {
            selected.find('>a').trigger('click');
          }
        });
      }
    };

    // make it a jquery plugin
    $.fn.navigationSet = function (method)
    {
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
        $.error('Method ' +  method + ' does not exist on jQuery.navigationSet');
      }
    };

}(jQuery));
/*doc
---
title: PhotoPlayer
category: Javascript
name: photoPlayer
author: Jake Fournier
---

A simple photo player with optional thumbnails.  Images will be vertically and horizontally centered.

The photo player can optionally display "interstitials" between thumbnails. Each interstitial is just an HTML string, and it conceptually groups subsequent photos, up to the next interstitial. This is
useful for, for example, displaying photo sets where you want to delineate where one photo set ends and the next one begins.

Interstitials are not displayed in the large photo display, only in the thumbnail strip. Each interstitial is completely described by a "photo index" -- the zero-based index of the thumbnail photo before which
it is displayed -- and the id of a div that contains the HTML markup to be displayed for the interstitial. The div must contain a child div with the class interstitialThumbnail (used to size the interstitial).

``` html
<div id="interstitial1">
 <div class="h7 interstitialThumbnail blm">
    This is the text for the first interstitial
 </div>
</div>
```

**NOTE:** You can provide the primary/first photo in the initial markup as the example below shows.  This is good practice for usability as we want the photo to show up ASAP and it's good for SEO since the search engines will have a photo to crawl and index.

This is the standard photoplayer:

```html_example
<div id="photoPlayerStandard" class="photoPlayer" style="width: 650px;"
  data-photos='{"photos":[{"standard_url" : "http:\/\/www.instasrc.com\/640x480\/future", "thumbnail_url" : "http:\/\/www.instasrc.com\/70x50\/future", "caption" : "The Future is now"}, {"standard_url" : "http:\/\/www.fillmurray.com\/640\/480", "thumbnail_url" : "http:\/\/www.fillmurray.com\/70\/50", "caption" : ""},{"standard_url" : "http:\/\/placekitten.com\/640\/480", "thumbnail_url" : "http:\/\/www.placekitten.com\/70\/50", "caption" : "Meow"}, {"standard_url" : "http:\/\/www.placedog.com\/640\/480", "thumbnail_url" : "http:\/\/www.placedog.com\/70\/50", "caption" : "This dog speaking"}]}'
  data-interstitials='[{"photoIndex" : "0", "divId" : "interstitial1" }, {"photoIndex" : "6", "divId" : "interstitial2" }]'
>
  <div class="photoPlayerCurrentItemContainer overlayContainer">
    <div class="photoPlayerCurrentItem">
      <img src="http://instasrc.com/640x480/future" alt="SEO Friendly text" />
     </div>
    <div class="hideFully photoPlayerPreviousButton h1 overlayLeft overlayLowlight overlayMiddle clickable">
      <i class="iconLeftOpen"></i>
    </div>
    <div class="hideFully photoPlayerNextButton h1 txtR overlayRight overlayLowlight overlayMiddle clickable">
      <i class="iconRightOpen"></i>
    </div>
    <div class="hideFully photoPlayerCaption overlayLowlight overlayBottom txtC pvs overlayFullWidth"></div>
  </div>
  <div class="photoPlayerThumbnailContainer">
    <div class="photoPlayerThumbnails"></div>
  </div>
</div>
```


```js_example
var config = {
  showThumbnails: true,
  size:
    {width: '640px', height: '480px'},
  maxSize:
    {maxWidth: '640px', maxHeight: '480px'},
  thumbnailMaxSize:
    {maxWidth: '70px', maxHeight: '50px'}
};
$('#photoPlayerStandard').truliaPhotoPlayer(config);
```


## data-photos json format

This is the format your data should be in before being json_encoded and passed to the data-photos attribute:

```js_example
photoData = {
  photos: [
    {
      standard_url: 'http://lorempixel.com/640/480/',
      thumbnail_url : 'http://lorempixel.com/64/48/',
      caption: 'Sandwiches, everyone loves them. Sandwiches.'
    },
    {
      standard_url: 'http://lorempixel.com/640/480/',
      thumbnail_url : 'http://lorempixel.com/64/48/',
      caption: 'Code Monkey not crazy, just proud.'
    }
  ]
}
```
## data-interstitials json format

This is the format your data should be in before being json_encoded and passed to the data-interstitials attribute:

```js_example
interstitialData = [
 {
   "photoIndex" : "0",
   "divId" : "interstitial1"
 },
 {
   "photoIndex" : "6",
   "divId" : "interstitial2"
 }
]
```

You may also skin the photo player differently using other TXL classes:

```html_example
<div id="photoPlayerSmall" class="photoPlayer" style="width: 360px;" data-photos='{"photos":[{"standard_url" : "http:\/\/www.instasrc.com\/360x270\/future"}, {"standard_url" : "http:\/\/www.fillmurray.com\/360\/270"},{"standard_url" : "http:\/\/placekitten.com\/360\/270"}, {"standard_url" : "http:\/\/www.placedog.com\/360\/270"}]}'>
  <div class="photoPlayerCurrentItemContainer overlayContainer">

    <div class="photoPlayerCurrentItem">
      <img src="http://instasrc.com/640x480/future" alt="SEO Friendly text" />
    </div>

    <div class="hideFully photoPlayerPreviousButton h4 overlayLeft overlayLowlight overlayMiddle clickable">
      <i class="iconLeftOpen"></i>
    </div>

    <div class="hideFully photoPlayerNextButton txtR h4 overlayRight overlayLowlight overlayMiddle clickable">
      <i class="iconRightOpen"></i>
    </div>

    <div class="overlayLeft overlayBottom overlayLowlight phs">
      <i class="iconPicture"></i> 3
    </div>

    <div class="txtC overlayHighlight overlayTop overlayFullWidth"><b>None</b> of these people are real!</div>

  </div>
</div>
```

```js_example
var config = {
  showThumbnails: false,
  size: {width: '360px', height: '270px'},
  maxSize: {maxWidth: '360px', maxHeight: '270px'},
};
$('#photoPlayerSmall').truliaPhotoPlayer(config);
```

## jQuery Plugin: truliaPhotoPlayer

options                | description                                                                       | Default Value
-----------------------|-----------------------------------------------------------------------------------|------------------------
`showThumbnails`       | True or false if the thumbnail strip is displayed or not.                         | `false`
`size`                 | Main photo container width and height.                                            | `640x480 px`
`maxSize`              | Max width and height the main photo can be. Centered in container defined by size | `640x480 px`
`thumbnailMaxSize`     | Max width and height for the thumbnail images.                                    | `70x50 px`
`selected`             | Which image is current selected.  Index starting at zero.                         | `0`
`currentCountSelector` | CSS selector of the container that will hold the current photo number **x** of XX | `.photoPlayerCounterCurrent`
`maxCountSelector`     | CSS selector of the container that will hold the max photo number. x of **XX**    | `.photoPlayerCounterMax`
`photoOnClick`         | Callback for when the photo is clicked or false to disable going to next photo.   | `null`
'isModal'              | True or false if the photo player is displayed inside of a modal.                 | `false`
'sideBarWidth'         | Width reserved for a side bar panel.                                              | `0`

*/

(function ($) {
  var photoPlayers = {};
  var config = {
    showThumbnails: false,
    selected: 0,
    thumbnailSize : {width: '70px', height: '50px'},
    interstitialSize : {width: '200px', height: '50px'},
    thumbnailImgContainerSize : {width: '94px'},
    size : {width: '640px', height: '480px'},
    maxSize : {maxWidth: '640px', maxHeight: '480px'},
    currentCountSelector : '.photoPlayerCounterCurrent',
    maxCountSelector : '.photoPlayerCounterMax',
    photoOnClick: null,
    isModal: false,
    sideBarWidth: 0
  };

  var DIRECTION_NEXT = 'next',
    DIRECTION_PREVIOUS = 'previous';

  var methods =
  {
    init: function (options)
    {
      return this.each(function () {
        var containerId = $(this).attr('id');

        photoPlayers[containerId] = {
          'container' : $(this),
          'photoData' : $(this).data('photos'),
          'interstitials' : $(this).data('interstitials'),  // contains .photoIndex and .divId fields
          'orients'   : {},
          'config' : $.extend({}, config, options)
        };

        var playerData = photoPlayers[containerId];

        photoPlayers[containerId].numPhotos = (playerData.photoData && playerData.photoData.photos ? playerData.photoData.photos.length : 0);
        photoPlayers[containerId].selectedItem = playerData.config.selected;

        var selectedItem = playerData.selectedItem,
            container = playerData.container,
            photoData = playerData.photoData,
            numPhotos = playerData.numPhotos;

        //photo player base markup
        if (numPhotos === 1)
        {
          container.find('.photoPlayerPreviousButton,.photoPlayerNextButton').addClass('hideFully');
        }
        else {
          container.find('.photoPlayerPreviousButton,.photoPlayerNextButton').removeClass('hideFully');
        }

        //setup thumbnails
        var thumbnailStrip = $(this).find('.photoPlayerThumbnails');
        if (playerData.config.showThumbnails && thumbnailStrip.length)
        {
          $(playerData.container).truliaPhotoPlayer('updateThumbnailDisplay');

          // position and size the thumbnail strip
          var thumbnailStrip = $(this).find('.photoPlayerThumbnails');
          thumbnailStrip.find('.photoPlayerThumbnailImg').css(playerData.config.thumbnailSize);
          thumbnailStrip.find('.thumbnailImgContainer').css(playerData.config.thumbnailImgContainerSize);

          // style the interstitials

          // set size for each interstitial "thumbnail" and make it display in a line with the other thumbnails
          thumbnailStrip.find('.interstitialThumbnail').css(playerData.config.interstitialSize);
          thumbnailStrip.find('.interstitialThumbnail').css({ 'display': 'inline-block', 'text-indent': '0px' });

          // do not display the "hand" pointer over interstitial thumbnails, because they are not clickable
          thumbnailStrip.find('.interstitialThumbnailImg').css({ 'cursor': 'default' });

          // thumbnails are displayed in a single line
          thumbnailStrip.find('.thumbnailImgContainer').css({ 'display': 'inline-block' });

          // inactive thumbnails are overlayed with a "glaze" layer for photo players with interstitials, but we want that layer to pass through mouse events to the underlying thumbnail
          thumbnailStrip.find('.inactiveThumbnailOverlay').css({ 'pointer-events': 'none' });

          // remove the glaze layer over the first set of photos
          thumbnailStrip.find('[data-interstitial-index=0]').children('span').removeClass('overlayDefault overlayFull inactiveThumbnailOverlay');
        }

        //populate the current selected item as the main photo if it's empty
        //we don't replace it if it's there because that can cause a "flash" as it reloads the same image
        if (selectedItem >= 0 && selectedItem < numPhotos && container.find('.photoPlayerCurrentItem img').length < 1)
        {
          if (playerData.config.isModal)
          {
            container.find('.photoPlayerCurrentItem').css('background-image', 'url(' + photoData.photos[selectedItem].standard_url + ')');
          }
          else
          {
            container.find('.photoPlayerCurrentItem').html('<img src="' + photoData.photos[selectedItem].standard_url + '" />');
          }
        }

        //assign container sizes
        if (playerData.config.isModal)
        {
          container.find('.photoPlayerCurrentItemContainer').css(playerData.config.size);
        }
        else
        {
          container.find('.photoPlayerCurrentItemContainer').css(playerData.config.size).css('margin', 'auto');
        }
        container.find('.photoPlayerCurrentItem').css(playerData.config.size);
        container.find('.photoPlayerCurrentItem img').css(playerData.config.maxSize);

        //UI counts
        $(playerData.config.currentCountSelector).html(selectedItem + 1);
        $(playerData.config.maxCountSelector).html(numPhotos);

        $(playerData.container).truliaPhotoPlayer('update');

        //BIND EVENTS
        //TODO: revisit.. this global document event kind of sucks
        $(document).keyup(function (e) {

          // check for key modifiers and skip if any
          if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey)
          {
            return;
          }

          // check if any form inputs that use keys are focused
          if ($('input:focus, textarea:focus, select:focus').length)
          {
            return;
          }

          //since keystrokes associates with all photo player objects only
          //do the visible ones
          if (!container.is(':visible'))
          {
            return;
          }

          if (e.keyCode === 37) // left arrow
          {
            container.truliaPhotoPlayer(DIRECTION_PREVIOUS);
          }
          else if (e.keyCode === 39) // right arrow
          {
            container.truliaPhotoPlayer(DIRECTION_NEXT);
          }

        });

        //clicking on thumbnails
        $('.photoPlayerThumbnails img', this).bind('click', function (e) {
          e.preventDefault();
          container.truliaPhotoPlayer('selectItem', $(this).data('image-index'));
        });

        // clicking on the current photo goes to the next one
        if (typeof playerData.config.photoOnClick === 'function')
        {
          $('.photoPlayerCurrentItem', container).bind('click', playerData.config.photoOnClick);
        }
        else if (playerData.config.photoOnClick !== false)
        {
          if (playerData.config.isModal)
          {
            $('.photoPlayerCurrentItem', container).bind('click', function (e) {
              e.preventDefault();
              container.truliaPhotoPlayer('changePhotoOnMouseClickPosition', e, $(this), container);
            });
          }
          else
          {
            $('.photoPlayerCurrentItem', container).bind('click', function (e) {
              e.preventDefault();
              // go to the next item
              container.truliaPhotoPlayer('changePhoto', container.truliaPhotoPlayer('nextItem'), DIRECTION_NEXT);
              // let others know that photo was changed by clicking on the current photo
              container.triggerHandler('photo:current', {'index' : playerData.selectedItem});
            });
          }
        }

        // button actions:
        // next
        $('.photoPlayerNextButton', container).bind('click', function (e) {
          e.preventDefault();
          container.truliaPhotoPlayer(DIRECTION_NEXT);
        });
        // previous
        $('.photoPlayerPreviousButton', container).bind('click', function (e) {
          e.preventDefault();
          container.truliaPhotoPlayer(DIRECTION_PREVIOUS);
        });

        $(window).resize(function(){
          if (playerData.config.isModal)
          {
            var playerHeight = $(window).innerHeight() - 50;
            var playerHeightStr = playerHeight + '';

            var playerWidth = $(window).innerWidth() - playerData.config.sideBarWidth;
            var playerWidthStr = playerWidth + '';

            playerData.config.size = {'width' : playerWidthStr, 'height' : playerHeightStr};

            container.find('.photoPlayerCurrentItemContainer').css(playerData.config.size);
            container.find('.photoPlayerCurrentItem').css(playerData.config.size);
          }
        });

        var currentImg = '.photoPlayerCurrentItem';
        if (!playerData.config.isModal)
        {
          currentImg = '.photoPlayerCurrentItem img';
        }

        container.find(currentImg).on('load', function (e) {
          var playerData = photoPlayers[container.attr('id')];
          var orient = 'portrait';

          if (playerData.orients[playerData.selectedItem])
          {
            orient = playerData.orients[playerData.selectedItem];
          }
          else
          {
            //must remove classes before doing width/height comparision
            $(this).removeClass('landscape portrait');

            if (this.width > this.height)
            {
              orient = 'landscape';
            }
            else
            {
              orient = 'portrait';
            }

            playerData.orients[playerData.selectedItem] = orient;
          }
          $(this).removeClass('landscape portrait').addClass(orient);
        });

        // notify on each created instance
        container.trigger('player:init', {'instance' : playerData});
      });
    },

    changePhotoOnMouseClickPosition : function (event, imgContainer, photoPlayerContainer)
    {
      var pWidth = imgContainer.width();
      var pOffset = imgContainer.offset();
      var x = event.pageX - pOffset.left;

      if(pWidth/2 > x)
      {
        photoPlayerContainer.truliaPhotoPlayer(DIRECTION_PREVIOUS);
      }
      else
      {
        photoPlayerContainer.truliaPhotoPlayer(DIRECTION_NEXT);
      }
    },

    // returns the index of the last interstitial displayed before the thumbnail at
    // at the given index
    interstitialIndexFromPhotoIndex : function (thumbnailIndex)
    {
      var playerData = photoPlayers[this.attr('id')],
        interstitialArr = playerData.interstitials;

      if (!interstitialArr)
      {
        return -1;
      }

      var index = 0;
      var numInterstitials = interstitialArr.length;
      while (index < numInterstitials && interstitialArr[index].photoIndex <= thumbnailIndex)
      {
        index++;
      }
      return (index-1);
    },

    changePhoto : function (index, direction)
    {
      var playerData = photoPlayers[this.attr('id')],
        eventBeforeChange;

      if (index >= 0 && index <= (playerData.numPhotos - 1))
      {
        // check with others if it's ok to update the photo
        // do jQuery trickery, since we need to keep event object for inspection after it's been triggered
        eventBeforeChange = $.Event('photo:beforechange');
        $(this).triggerHandler(eventBeforeChange, {'new' : index, 'old' : playerData.selectedItem, 'direction' : direction });

        if (eventBeforeChange.isDefaultPrevented())
        {
          playerData.directionPrevented = direction;
          return;
        }

        if (playerData.interstitials)
        {
          // change the highlighting on the thumbnails if the interstitial index has changed
          var newInterstitialIndex = $(playerData.container).truliaPhotoPlayer('interstitialIndexFromPhotoIndex', index);
          var oldInterstitialIndex = $(playerData.container).truliaPhotoPlayer('interstitialIndexFromPhotoIndex', playerData.selectedItem);

          if (oldInterstitialIndex !== newInterstitialIndex)
          {
            var container = playerData.container,
              thumbnailContainer = container.find('.photoPlayerThumbnails');

            // remove the glaze over the new interstitial index
            thumbnailContainer.children('[data-interstitial-index=' + newInterstitialIndex + ']').children('span').removeClass('overlayDefault overlayFull inactiveThumbnailOverlay');

            // add the glaze back to the old interstitial index
            thumbnailContainer.children('[data-interstitial-index=' + oldInterstitialIndex + ']').children('span').addClass('overlayDefault overlayFull inactiveThumbnailOverlay');
          }
        }

        playerData.directionPrevented = null;
        playerData.selectedItem = index;
        $(playerData.container).truliaPhotoPlayer('update');
        $(this).triggerHandler('photo:change', {'index' : playerData.selectedItem});
      }
    },

    updateThumbnailDisplay : function()
    {
      var photoData = $(this).data('photos'),
        interstitialArr = $(this).data('interstitials'),
        thumbnailStrip = $(this).find('.photoPlayerThumbnails'),
        thumbnailImageHtml = '';

      var numPhotos = photoData.photos.length;
      var nextInterstitialIndex = 0;
      var numInterstitials = (interstitialArr? interstitialArr.length : 0);
      for (var i=0; i < numPhotos; i++)
      {
        var item = photoData.photos[i];
        if (nextInterstitialIndex < numInterstitials && i === interstitialArr[nextInterstitialIndex].photoIndex)
        {
          // we should add the interstitial text -- take it from the div referenced in the interstitial
          thumbnailImageHtml += $("#" + interstitialArr[nextInterstitialIndex].divId).html();
          nextInterstitialIndex++;
        }

        if (numInterstitials === 0)
        {
          // use the old code where we don't overlay anything on top of each thumbnail
          thumbnailImageHtml += '<img class="photoPlayerThumbnailImg" data-image-index="' + i + '" ' +
            ' src="' + item.thumbnail_url + '">';
        }
        else
        {
          // we want to overlay a layer on top of each photo that is removed for the thumbnails corresponding to
          // the active interstitial
          thumbnailImageHtml +=
            '<div class="thumbnailImgContainer overlayContainer" ' +
              ' data-interstitial-index="' + (nextInterstitialIndex-1) + '">' +  // we do a -1 here because nextInterstitialIndex has already been incremented
              '<img class="photoPlayerThumbnailImg" data-image-index="' + i + '"' +
              ' src="' + item.thumbnail_url + '">' +
              '<span class="overlayDefault overlayFull inactiveThumbnailOverlay"></span>' +
              '</div>';
        }
      }

      thumbnailStrip.prepend(thumbnailImageHtml);
    },

    selectItem : function (index)
    {
      var playerData = photoPlayers[this.attr('id')];
      if (playerData)
      {
        $(playerData.container).truliaPhotoPlayer('changePhoto', index, null);
        $(this).triggerHandler('photo:select', {'index' : playerData.selectedItem});
      }
    },
    next : function ()
    {
      var playerData = photoPlayers[this.attr('id')];
      if (playerData)
      {
        $(playerData.container).truliaPhotoPlayer('changePhoto', $(playerData.container).truliaPhotoPlayer('nextItem'), DIRECTION_NEXT);
        $(this).triggerHandler('photo:next', {'index' : playerData.selectedItem});
      }
    },
    previous : function ()
    {
      var playerData = photoPlayers[this.attr('id')];
      if (playerData)
      {
        $(playerData.container).truliaPhotoPlayer('changePhoto', $(playerData.container).truliaPhotoPlayer('previousItem'), DIRECTION_PREVIOUS);
        $(this).triggerHandler('photo:previous', {'index' : playerData.selectedItem});
      }
    },
    nextItem : function ()
    {
      var playerData = photoPlayers[this.attr('id')];

      if (playerData)
      {
        var next = playerData.selectedItem;

        if (playerData.directionPrevented !== DIRECTION_PREVIOUS)
        {
          if (playerData.directionPrevented === DIRECTION_NEXT || (next + 1) > (playerData.numPhotos - 1))
          {
            next = 0;
          }
          else
          {
            next += 1;
          }
        }
        return next;
      }

      return 0;
    },
    previousItem : function ()
    {
      var playerData = photoPlayers[this.attr('id')];

      if (playerData)
      {
        var previous = playerData.selectedItem;

        if (playerData.directionPrevented !== DIRECTION_NEXT)
        {
          if (playerData.directionPrevented === DIRECTION_PREVIOUS || (previous - 1) < 0)
          {
            previous = playerData.numPhotos - 1;
          }
          else
          {
            previous -= 1;
          }
        }
        return previous;
      }

      return 0;
    },
    /**
     * Get the data for the current photo in the player
     */
    getItem : function (index)
    {
      var playerData = photoPlayers[this.attr('id')];
      index = (typeof index === 'undefined' ? playerData.selectedItem : index);
      return playerData.photoData.photos[index];
    },
    update : function ()
    {
      var playerData = photoPlayers[this.attr('id')],
          photoItem = playerData.photoData.photos[playerData.selectedItem],
          container = playerData.container,
          selectedItem = playerData.selectedItem,
          currentItem = container.find('.photoPlayerCurrentItem img');

      if (playerData.config.isModal)
      {
        currentItem = container.find('.photoPlayerCurrentItem');
      }

      if (playerData.config.showThumbnails)
      {
        var thumbnailContainer = container.find('.photoPlayerThumbnails'),
          thumbnailImages = thumbnailContainer.find('.photoPlayerThumbnailImg'),
          interstitialWidth = thumbnailContainer.find('.interstitialThumbnail').outerWidth(true),
          pageWidth = thumbnailContainer.width();

        // the width of a selected photo is different than that of an unselected photo (due to the border). We use the unselected
        // photo width in the calculation
        var unselectedPhotoWidth = -1;
        for (var i = 0; i < thumbnailImages.length; i++)
        {
          var thumbnailImg = $(thumbnailImages[i]);
          if (!thumbnailImg.hasClass('photoPlayerThumbnailCurrent'))  // this is a selected photo
          {
            unselectedPhotoWidth = thumbnailImg.outerWidth(true);
            break;
          }
        }

        //set selected thumbnail and move viewport the correct amount of indentation
        var indentLeft = $(playerData.container).truliaPhotoPlayer('getLeftIndent', pageWidth, unselectedPhotoWidth, interstitialWidth);
        thumbnailContainer.css('text-indent', -indentLeft + 'px');

        thumbnailContainer.find('img').removeClass('photoPlayerThumbnailCurrent');
        thumbnailContainer.find('img[data-image-index=' + selectedItem + ']').addClass('photoPlayerThumbnailCurrent');
      }

      if (playerData.config.isModal)
      {
        currentItem.css('background-image', 'url(' + photoItem.standard_url + ')');
      }
      else
      {
        currentItem.attr({'alt' : photoItem.caption, 'src' : photoItem.standard_url});
      }

      if (photoItem.caption)
      {
        container.find('.photoPlayerCaption').removeClass('hideFully').html(photoItem.caption).show();
      }
      else
      {
        container.find('.photoPlayerCaption').addClass('hideFully');
      }

      //update counter
      $(playerData.config.currentCountSelector).html(selectedItem + 1);
    },

    getLeftIndent : function (pageWidth, photoWidth, interstitialWidth)
    {
      var playerData = photoPlayers[this.attr('id')],
        selectedItem = playerData.selectedItem,
        photoData = playerData.photoData,
        interstitialArr = playerData.interstitials;

      if (!interstitialArr)
      {
        // all elements are the same width, so it's a simple arithmetic calculation
        var numCellsPerPage = parseInt(pageWidth/photoWidth, 10),
          currentPage = Math.ceil((selectedItem + 1)/numCellsPerPage),
          leftItem = (currentPage - 1) * numCellsPerPage;

        return leftItem * photoWidth;
      }

      // special case: if we are at the first photo, we don't include the width of the preceding
      // interstitial, because then that interstitial will never be seen
      if (selectedItem === 0)
      {
        return 0;
      }

      // figure out the width of all the photos before the selected one
      var photoWidthSum = selectedItem * photoWidth;

      // figure out the width of the interstitials that need to be displayed before this photo
      var numInterstitials = interstitialArr.length;
      var interstitialWidthSum = 0;
      for (var i = 0; i < interstitialArr.length; i++)
      {
        if (interstitialArr[i].photoIndex <= selectedItem)
        {
          interstitialWidthSum += interstitialWidth;
        }
        else
        {
          break;  // the interstitial array is sorted in increasing order of photo index
        }
      }

      return photoWidthSum + interstitialWidthSum;
    }
  };

  // make it a jquery plugin
  $.fn.truliaPhotoPlayer = function (method)
  {
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
      $.error('Method ' +  method + ' does not exist on jQuery.truliaPhotoPlayer');
    }
  };
}(jQuery));
/*doc
---
title: Rating
name: rating
category: Javascript
---

The rating component is a list of radio buttons in the background. The JavaScript hides the radio buttons off screen and turns the label into stars or bars. If the JavaScript doesn't get executed, it'll default back to a list of radio buttons so it is still accessible.

Class           | Description
--------------- | -----------
`rating`        | Base class. Required. Skins and subclasses that extend rating should add their classname to this element.
`ratingGroup`   | Subnode of rating. This class gets added via JavaScript and is used to style the rating elements.
`ratingValue`   | Subnode of rating. The JavaScript will take the text within `label` tag and inject it into this wrapper.
`ratingStar`    | Skin class. Optional. Uses sprite for the stars
`ratingBar`     | Skin class. Optional. Uses CSS3 for the bars


```html_example
<form class="form" method="post" action="">
  <div class="field">
    <label class="fieldLabel labelLeft">Rate this area</label>
    <span class="fieldItem rating ratingStar">
      <ul>
        <li>
          <input type="radio" name="star" id="star1" value="1">
          <label for="star1">
            <span>Terrible</span>
          </label>
        </li>
        <li>
          <input type="radio" name="star" id="star2" value="2">
          <label for="star2">
            <span>Poor</span>
          </label>
        </li>
        <li>
          <input type="radio" name="star" id="star3" value="3">
          <label for="star3">
            <span>Average</span>
          </label>
        </li>
        <li>
          <input type="radio" name="star" id="star4" value="4">
          <label for="star4">
            <span>Good</span>
          </label>
        </li>
        <li>
          <input type="radio" name="star" id="star5" value="5">
          <label for="star5">
            <span>Excellent</span>
          </label>
        </li>
      </ul>
      <span class="ratingValue" data-rating-title="Rate it"></span>
    </span>
  </div>
  </form>
```


```html_example
<form class="form" method="post" action="">
  <div class="field">
    <label class="fieldLabel labelLeft">Rate this area</label>
    <span class="fieldItem rating ratingBar">
      <ul>
        <li>
          <input type="radio" name="bar" id="bar1" value="1">
          <label for="bar1">
            <span>Terrible</span>
          </label>
        </li>
        <li>
          <input type="radio" name="bar" id="bar2" value="2">
          <label for="bar2">
            <span>Poor</span>
          </label>
        </li>
        <li>
          <input type="radio" name="bar" id="bar3" value="3">
          <label for="bar3">
            <span>Average</span>
          </label>
        </li>
        <li>
          <input type="radio" name="bar" id="bar4" value="4">
          <label for="bar4">
            <span>Good</span>
          </label>
        </li>
        <li>
          <input type="radio" name="bar" id="bar5" value="5">
          <label for="bar5">
            <span>Excellent</span>
          </label>
        </li>
      </ul>
      <span class="ratingValue" data-rating-title="Rate it"></span>
    </span>
  </div>
  </form>
```


```js_example
$(function() {
  $('.ratingBar').rating();
  $('.ratingStar').rating();
});
```
*/

$.fn.rating = function () {
  this.each(function () {
    var $this = $(this),
      $list = $('ul', $this),
      $rating = $('li', $list),
      $valueWrapper = $('.ratingValue', $this),
      $valueWrapperText =  $valueWrapper.attr('data-rating-title'),
      value;

    $list.addClass('ratingGroup');
    $valueWrapper.text($valueWrapperText);

    $rating.mouseover(function () {
      var $thisRating = $(this);

      $thisRating.nextAll("li").removeClass("ratingOn");
      $thisRating.prevAll("li").addClass("ratingOn");
      $thisRating.addClass("ratingOn");

      value = $thisRating.text();
      $valueWrapper.text(value);
    });

    $list.mouseleave(function () {
      var $thisList = $(this);

      $thisList.children("li").removeClass("ratingOn");
      $thisList.find("li input:checked").parent("li").trigger("mouseover");

      if (!($('.ratingOn', $list).length)) {
        $valueWrapper.text($valueWrapperText);
      }
    });

    $("input:checked", $this).parent("li").trigger("mouseover");
  });
};
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

/*doc
---
title: Tabs
name: tabs
category: Javascript
author: Vince Lum
---

Tabs are built by combining a number of other basic components and tying it all together with a clean jquery plugin.
The basic components used to build tabs are the **box** and the **tab** components.

Class           | Description
----------------|-------------
`tabs`          | Base tab class to display inline list.
`tabDefault`    | Default skin for tabs.
`tabPrimary`    | Primary skin for tabs.
`tabColumns`    | Primary skin for tabs with equally-spaced columns, using `col cols12` for 2 tabs.

```html_example
<div class="box boxBasic">
  <div class="boxHead">
    <ul id="tabsExample" class="tabs tabDefault" data-body="#tabContents">
      <li>
        <a href="#">
          <span class="iconList"></span>Tab one</a>
      </li>
      <li>
        <a href="#">
          <span class="iconMap"></span>Tab two</a>
      </li>
      <li>
        <a href="#">Tab three</a>
      </li>
      <li>
        <a href="#">Tab four</a>
      </li>
    </ul>
    <hr class="mvn" />
  </div>
  <div class="boxBody">
    <ul id="tabContents" class="tabBody">
      <li class="active">
        <p>Lorem ipsum occaecat eiusmod Ut et sit sint quis qui labore in exercitation esse. Lorem ipsum in aliquip
          esse anim aliquip ullamco sit dolor in deserunt eu labore. Lorem ipsum magna officia in laborum fugiat
          proident cupidatat in ex aliquip velit officia nulla aliquip ut. Lorem ipsum nostrud ad Ut nulla velit
          qui esse tempor Excepteur consectetur pariatur enim.</p>
      </li>
      <li>Lorem ipsum nisi non eiusmod adipisicing est est deserunt reprehenderit. Lorem ipsum sunt sit dolor
        dolore est reprehenderit id aliqua anim eu quis Duis id Duis anim eiusmod.</li>
      <li>Lorem ipsum officia culpa in aliqua labore dolor eu exercitation mollit reprehenderit.</li>
      <li>Lorem ipsum in aliqua dolor culpa ut velit nisi ex cupidatat eu do Ut commodo. Lorem ipsum nisi nulla
        culpa magna Excepteur irure ut. Lorem ipsum reprehenderit ut esse nulla minim quis. Lorem ipsum tempor
        sed dolor pariatur non dolor consectetur sed Ut anim ullamco.</li>
    </ul>
  </div>
</div>

```

```html_example

<div class="box boxTabPrimary">
  <div class="boxHead">
    <ul id="tabsExample2" class="tabs tabPrimary" data-body="#tabContents2">
      <li>
       <a href="#"><span class="iconList"></span>Tab one</a>
      </li>
      <li>
        <a href="#"><span class="iconMap"></span>Tab two</a>
      </li>
      <li>
        <a href="#">Tab three</a>
      </li>
      <li>
        <a href="#">Tab four</a>
      </li>
    </ul>
  </div>
  <div class="boxBody">
    <ul id="tabContents2" class="tabBody">
      <li class="active">
        <p>Lorem ipsum occaecat eiusmod Ut et sit sint quis qui labore in exercitation esse. Lorem ipsum in aliquip
          esse anim aliquip ullamco sit dolor in deserunt eu labore. Lorem ipsum magna officia in laborum fugiat
          proident cupidatat in ex aliquip velit officia nulla aliquip ut. Lorem ipsum nostrud ad Ut nulla velit
          qui esse tempor Excepteur consectetur pariatur enim.</p>
      </li>
      <li>Lorem ipsum nisi non eiusmod adipisicing est est deserunt reprehenderit. Lorem ipsum sunt sit dolor
        dolore est reprehenderit id aliqua anim eu quis Duis id Duis anim eiusmod.</li>
      <li>Lorem ipsum officia culpa in aliqua labore dolor eu exercitation mollit reprehenderit.</li>
      <li>Lorem ipsum in aliqua dolor culpa ut velit nisi ex cupidatat eu do Ut commodo. Lorem ipsum nisi nulla
        culpa magna Excepteur irure ut. Lorem ipsum reprehenderit ut esse nulla minim quis. Lorem ipsum tempor
        sed dolor pariatur non dolor consectetur sed Ut anim ullamco.</li>
    </ul>
  </div>
</div>

```

```html_example
<p>The tabColumns style is an opaque container meant to be used over an image or background, like on the homepage.
To divide tabs, use col colsX.</p>

<div class="backgroundHighlight mal pal">

  <div class="box boxTabColumns">
    <div class="boxHead">

        <ul id="tabsExample3" class="tabs tabColumns" data-body="#tabContents3">
          <li class="col cols12">
           <a href="#"><span class="iconList"></span>Tab one</a>
          </li>
          <li class="col cols12">
            <a href="#"><span class="iconMap"></span>Tab two</a>
          </li>
        </ul>

      <div class="boxBody">
        <ul id="tabContents3" class="tabBody">
          <li class="active">
            <p>Lorem ipsum occaecat eiusmod Ut et sit sint quis qui labore in exercitation esse. Lorem ipsum in aliquip
            esse anim aliquip ullamco sit dolor in deserunt eu labore. Lorem ipsum magna officia in laborum fugiat
            proident cupidatat in ex aliquip velit officia nulla aliquip ut. Lorem ipsum nostrud ad Ut nulla velit
            qui esse tempor Excepteur consectetur pariatur enim.</p>
          </li>
          <li>Lorem ipsum in aliqua dolor culpa ut velit nisi ex cupidatat eu do Ut commodo. Lorem ipsum nisi nulla
            culpa magna Excepteur irure ut. Lorem ipsum reprehenderit ut esse nulla minim quis. Lorem ipsum tempor
            sed dolor pariatur non dolor consectetur sed Ut anim ullamco.</li>
        </ul>
      </div>
    </div>
  </div>

</div>

```

```js_example
$(document).ready(function () {
  $('#tabsExample').truliaTabs();
  $('#tabsExample2').truliaTabs();
  $('#tabsExample3').truliaTabs();
});
```

## jQuery Plugin: truliaTabs

Options         | Description
----------------|----------
`selected`      | Pre-select a tab. `false` will select none. Default is 0 (first link in the list) `$('.tabs').truliaTabs({selected: 3 });`
`body`          | Selector for tab body `ul`. Tab clicks will navigate to their respective positions in the element specified by this selector. (You can also specify this using a `data-body` attribute on the tabs `ul` element)
**Methods**     |
 `select`       | Select a tab. The `nav:change` event will be triggered as if the tab received a click `$('.tabs').truliaTabs('select', 2);`
 **Events**     |
`nav:change`    | Triggered when the currently selected tab changes. Use this to implement dynamic tabs, etc. Listeners will receive the parameters `event, li, index` (the event, tab `li` that was clicked and the index of the tab item).
`tab:show`      | Triggered after the tab content has been shown. The event also gets the tab passed in.
`tab:hide`      | Triggered after the tab content has been hidden. The event also gets the tab passed in.

*/

(function ($) {
  var methods =
  {
    init: function (options)
    {
      return this.each(function () {
        var tabBodies,
            bodySelector,
            currentBody,
            config = $.extend({
              selected: 0,
              body: ''
            }, options);

        if ($(config.body).length) {
          bodySelector = $(config.body);
        } else {
          bodySelector = $(this).data('body');
        }

        // if data.body is specified, listen for clicks and tab accordingly
        if (bodySelector)
        {
          if (config.selected !== false)
          {
            currentBody = $(bodySelector).find('>li').eq(config.selected);
          }

          $(this).navigationSet({
            selected: config.selected
          });

          // hide unselected
          $(bodySelector).find('>li').not(currentBody).hide();

          $(this).on('nav:change.tabSet', function (e, li, index) {

            tabBodies = $(bodySelector);

            // change active body list item
            var currentTab = tabBodies.find('>li:visible');
            currentTab.hide();
            $(this).triggerHandler('tab:hide', currentTab);
            tabBodies.each(function () {
              var tab = $(this).find('>li').eq(index);
              tab.show();
              $(this).triggerHandler('tab:show', tab);
            });


          });
        }
      });
    },
    select: function (index)
    {
      return $(this).navigationSet('select', index);
    }
  };

  // make it a jquery plugin
  $.fn.truliaTabs = function (method)
  {
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
      $.error('Method ' +  method + ' does not exist on jQuery.truliaTabs');
    }
  };

}(jQuery));
$(document).ready(function() {
  $('.tagClose').click(function() {
    var $closeBtn = $(this);

    if ($closeBtn.attr('role') === 'close') {
      $closeBtn.closest('.tag').addClass('hideFully');
      $closeBtn.trigger('tag:close');
    }
  });

  $('.tagAction').click(function() {
    $(this).trigger('tag:action');
  });
});
/*doc
---
title: Toggle
name: toggle
type: component
category: Javascript
author: August Flanagan and JD Cantrell
---

Toggles should be used display show/hide comment. For example, showing/hiding a additional information on the search results page.
You can set the default as either active or inactive by either including (or not including) the class `toggleActive` on your trigger element,
and setting (or not setting) the class `hideVisually` on the container that you are toggling. By default the toggle will not be active.

Here's how you kick this off:

```html_example
<a href="#toggleArrow1" class="toggle toggleArrow " data-toggle-text="Fewer Options">More Options</a>
<div id="toggleArrow1" class="hideVisually">Yo, I got some content to show you. Lorem ipsum occaecat eiusmod Ut et sit sint quis qui labore in exercitation
  esse. Lorem ipsum in aliquip esse anim aliquip ullamco sit dolor in deserunt eu labore. Lorem ipsum magna
  officia in laborum fugiat proident cupidatat in ex aliquip velit officia nulla aliquip ut. Lorem ipsum
  nostrud ad Ut nulla velit qui esse tempor Excepteur consectetur pariatur enim.
</div>
```

```js_example
$(document).ready(function () {
  $('.toggle').truliaToggle();
});
```

Below are some methods you can also call on the toggle component and events you can listen to:

method          | description
----------------|------------------------
`toggle`        | Toggle the tooltip. Optional boolean argument to force active. Example: `$('.toggle').truliaToggle('toggle', true)`
**events**      |
`toggle`        | Listen to this event to perform an action when the toggle has changed state `$('.toggle').on('toggle', function (e, active) { if (active) ... })`

*/

(function ($) {
  var setArrow = function ($el) {
    if ($el.hasClass('toggleArrow')) {
      $el.toggleClass('toggleArrowActive');
    }
  };

  var methods = {
    init: function () {
      return this.each(function () {
        if ($(this).data('toggleInit') !== true) {
          //Prevent multiple initializations
          $(this).data('toggleInit', true);

          $(this).click(function (event) {
            event.preventDefault();
            methods.toggle.apply(this);
          });
        }
      });
    },

    toggle: function (activate) {
      return $(this).each(function () {
        var $toggle,
            data,
            container,
            toggled = false;

        $toggle = $(this);

        container = $($toggle.attr('href'));

        if (activate || activate === false) {
          // forced state toggle
          toggled = container.hasClass('hideVisually') === activate;
          $toggle.toggleClass('toggleActive', activate);
          container.toggleClass('hideVisually', !activate);
        }
        else {
          // toggle
          toggled = true;
          $toggle.toggleClass('toggleActive');
          container.toggleClass('hideVisually');
        }

        if (toggled) {
          // update arrow status
          setArrow($toggle);

          // update the label
          data = $toggle.data();
          if (data.toggleText) {
            var show = data.toggleText;

            //store our current text
            $toggle.data('toggleText', $toggle.text());

            //switch to our toggle text
            $toggle.text(show);
          }

          $toggle.trigger('toggle', [(activate || $toggle.hasClass('toggleActive'))]);
        }
      });
    }
  };

  $.fn.truliaToggle = function (method) {
    if (typeof method === 'string' && typeof methods[method] === 'function') {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    }
    else {
      $.error('Method ' +  method + ' does not exist on jQuery.truliaToggle');
    }
  };

}(jQuery));
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
;;
