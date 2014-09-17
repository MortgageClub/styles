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
