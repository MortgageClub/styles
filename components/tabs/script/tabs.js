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
