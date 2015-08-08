(function() {
  $(function() {
    var v_user;
    return v_user = new Vue({
      el: '#v_messages',
      data: {
        messages: []
      },
      ready: function() {
        return $.ajax({
          url: '/messages_app',
          type: 'POST',
          success: (function(_this) {
            return function(data, status, response) {
              _this.loading = false;
              return _this.messages = data.messages;
            };
          })(this)
        });
      }
    });
  });

}).call(this);
