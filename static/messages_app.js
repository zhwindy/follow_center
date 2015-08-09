(function() {
  $(function() {
    var v_user;
    return v_user = new Vue({
      el: '#v_messages',
      data: {
        messages: false,
        loading: true
      },
      ready: function() {
        var parm;
        parm = JSON.stringify({
          limit: 30
        });
        return $.ajax({
          url: '/messages_app',
          type: 'POST',
          data: parm,
          success: (function(_this) {
            return function(data, status, response) {
              _this.loading = false;
              return _this.messages = data.messages;
            };
          })(this)
        });
      },
      methods: {
        more: function() {
          var parm;
          this.loading = true;
          parm = JSON.stringify({
            offset: this.messages.length + 1
          });
          return $.ajax({
            url: '/messages_app',
            type: 'POST',
            data: parm,
            success: (function(_this) {
              return function(data, status, response) {
                var i, len, message, ref;
                ref = data.messages;
                for (i = 0, len = ref.length; i < len; i++) {
                  message = ref[i];
                  _this.messages.push(message);
                }
                return _this.loading = false;
              };
            })(this)
          });
        }
      }
    });
  });

}).call(this);
