(function() {
  $(function() {
    var router, routes, v_messages;
    v_messages = new Vue({
      el: '#v_messages',
      data: {
        messages: null,
        loading: false
      },
      ready: function() {},
      methods: {
        all: function() {
          var parm;
          this.loading = true;
          parm = JSON.stringify({
            limit: 30
          });
          return $.ajax({
            url: '/messages_app',
            type: 'POST',
            data: parm,
            success: (function(_this) {
              return function(data, status, response) {
                _this.messages = data.messages;
                return _this.loading = false;
              };
            })(this)
          });
        },
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
        },
        showTheGod: function(god_name) {
          var parm;
          this.loading = true;
          parm = JSON.stringify({
            god_name: god_name
          });
          return $.ajax({
            url: '/messages_app',
            type: 'POST',
            data: parm,
            success: (function(_this) {
              return function(data, status, response) {
                log(data.messages);
                _this.messages = data.messages;
                return _this.loading = false;
              };
            })(this)
          });
        }
      }
    });
    routes = {
      '/god/:god_name': v_messages.showTheGod,
      '/': v_messages.all
    };
    router = Router(routes);
    return router.init('/');
  });

}).call(this);
