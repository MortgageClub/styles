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
