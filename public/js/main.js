(function() {
  // search form
  var form = $('.search-form-wrapper');
  var query = form.find('[name="q"]');
  $('.search-form-toggle').on('click', function(){
    form.toggleClass('opened');
    query.val('').focus();
  });

  // participants filter
  var participants = $('.participants-wrap .participant');
  $('.participants-wrap select').on('change', function () {
    this.value ? participants.hide().filter('[data-roles~=' + this.value + ']').show() : participants.show();
  });

  // info message
  var message = $('.info-message');
  message.find('.close').on('click', function() {
    message.hide();
  });

  // additional action - open info
  $('.additional-action').find('.open').on('click', function() {
    $(this).closest('.additional-action').toggleClass('opened');
  });

  // additional action - print info
  $('.additional-action').find('.print').on('click', function() {
    var printWindow;
    printWindow = window.open();
    printWindow.document.write($('.printed-info').html());
    printWindow.print();
    printWindow.close();
  });

  // social buttons
  var socialUrl = window.location.protocol + "//" + window.location.hostname +
      (window.location.port ? ':' + window.location.port : '')
      + '/blog';
  $('.ya-share2').attr('data-url',socialUrl).attr('data-title', 'Воўчы блог');

})();
