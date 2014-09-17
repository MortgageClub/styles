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
