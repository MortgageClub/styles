$(document).ready(function() {
  $('.boxClose').click(function() {
    $(this).closest('.box').fadeOut('slow');
  });
});
