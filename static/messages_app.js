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
        god_name: null,
        last: null
      },
      ready: function() {
        return this.bindScroll();
      },
      methods: {
        saveLast: function() {
          var parm;
          parm = JSON.stringify({
            last_time: this.last.created_at,
            last_message_id: this.last.m_type + '_' + this.last.id
          });
          return $.ajax({
            url: '/save_last',
            type: 'POST',
            data: parm,
            success: (function(_this) {
              return function(data, status, response) {};
            })(this)
          });
        },
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
          this.user_info = '';
          parm = JSON.stringify({
            limit: 30
          });
          return this.freshData(parm);
        },
        more: function() {
          var parm;
          if (this.loading) {
            return;
          }
          this.loading = true;
          parm = JSON.stringify({
            offset: this.messages.length + 1,
            god_name: this.god_name,
            limit: 50
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
          this.freshData(parm);
          return this.getUserInfo(god_name);
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
            if (($(document).height() - $(this).scrollTop() - $(this).height()) === 0) {
              v.more();
            }
            $top = $('#v_messages').offset().top;
            return $('#v_messages .box').each(function() {
              var message;
              if ($(this).offset().top + $(this).height() >= $top + $(window).scrollTop()) {
                message = $(this)[0].__vue__.message;
                if (v.last === null || v.last.created_at < message.created_at) {
                  v.last = message;
                  v.saveLast();
                  log(v.last);
                }
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
