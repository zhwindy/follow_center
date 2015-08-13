(function() {
  $(function() {
    var router, routes, v_messages;
    v_messages = new Vue({
      el: '#v_messages',
      data: {
        user_info: '',
        user_infos: {},
        messages: null,
        loading: false,
        current_message_id: null,
        god_name: null
      },
      ready: function() {
        return this.bindScroll();
      },
      methods: {
        freshData: function(parm) {
          this.loading = true;
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
        all: function() {
          var parm;
          this.god_name = null;
          parm = JSON.stringify({
            limit: 30
          });
          return this.freshData(parm);
        },
        more: function() {
          var parm;
          this.loading = true;
          parm = JSON.stringify({
            offset: this.messages.length + 1,
            god_name: this.god_name
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
          this.god_name = god_name;
          parm = JSON.stringify({
            god_name: god_name
          });
          return this.freshData(parm);
        },
        getUserInfo: function(user_name) {
          var parm;
          if (this.user_infos[user_name]) {
            this.user_info = this.user_infos[user_name];
            return;
          }
          parm = JSON.stringify({
            user_name: user_name
          });
          return $.ajax({
            url: '/user_info',
            type: 'POST',
            data: parm,
            success: (function(_this) {
              return function(data, status, response) {
                _this.user_info = data.user_info;
                _this.user_infos[user_name] = data.user_info;
                return _this.loading = false;
              };
            })(this)
          });
        },
        bindScroll: function() {
          var v;
          v = this;
          return $(window).scroll(function() {
            var $top;
            if (($(document).height() - $(this).scrollTop() - $(this).height()) < 10) {
              v.more();
            }
            $top = $('#v_messages').offset().top;
            return $('#v_messages .box').each(function() {
              var user_name;
              if ($(this).offset().top >= $top + $(window).scrollTop()) {
                user_name = $(this)[0].__vue__.message.user_name;
                v.getUserInfo(user_name);
                return false;
              }
            });
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
