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
