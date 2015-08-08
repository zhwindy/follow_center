(function() {
  $(function() {
    var v_user;
    return v_user = new Vue({
      el: '#v_messages',
      data: {
        messages: [],
        loading: true
      },
      ready: function() {
        var parm;
        parm = JSON.stringify({
          bigzhu: 1
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
                var i, len, message, ref, results;
                _this.loading = false;
                ref = data.messages;
                results = [];
                for (i = 0, len = ref.length; i < len; i++) {
                  message = ref[i];
                  log(message);
                  results.push(_this.messages.push(message));
                }
                return results;
              };
            })(this)
          });
        }
      }
    });
  });

}).call(this);
