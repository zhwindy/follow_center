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
        last: null,
        last_messsage_id: ''
      },
      created: function() {
        return this.bindScroll();
      },
      methods: {
        childElDone: function(message_id, el) {
          if (this.god_name === null && this.last_message_id === message_id) {
            log(el);
            _.delay(this.scrollToLastMessage, 2000, el);
            return bz.showNotice5('正在定位到上次查看的信息,请不要操作');
          }
        },
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
        scrollToLastMessage: function(target) {
          var y;
          y = $(target).offset().top;
          return window.scrollTo(0, y);
        },
        all: function() {
          this.god_name = null;
          this.user_info = '';
          this.loading = true;
          return $.ajax({
            url: '/all',
            type: 'POST',
            success: (function(_this) {
              return function(data, status, response) {
                _this.last_message_id = data.last_message_id;
                _this.messages = data.messages;
                return _this.loading = false;
              };
            })(this)
          });
        },
        more: function() {
          var parm, url;
          if (this.loading || this.message === null) {
            return;
          }
          if (this.god_name) {
            url = '/god';
            parm = JSON.stringify({
              offset: this.messages.length + 1,
              god_name: this.god_name
            });
          } else {
            url = '/more';
            parm = JSON.stringify({
              offset: this.messages.length + 1
            });
          }
          this.loading = true;
          return $.ajax({
            url: url,
            type: 'POST',
            data: parm,
            success: (function(_this) {
              return function(data, status, response) {
                _this.messages = _.uniq(_.union(_this.messages, data.messages), false, function(item, key, a) {
                  return item.row_num;
                });
                return _this.loading = false;
              };
            })(this)
          });
        },
        god: function(god_name) {
          var parm;
          this.loading = true;
          this.god_name = god_name;
          parm = JSON.stringify({
            god_name: god_name
          });
          $.ajax({
            url: '/god',
            type: 'POST',
            data: parm,
            success: (function(_this) {
              return function(data, status, response) {
                _this.messages = data.messages;
                return _this.loading = false;
              };
            })(this)
          });
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
                if (v.god_name !== null) {
                  return false;
                }
                message = $(this)[0].__vue__.message;
                if (v.last === null || v.last.created_at < message.created_at) {
                  v.last = message;
                  v.saveLast();
                }
                return false;
              }
            });
          });
        }
      }
    });
    routes = {
      '/god/:god_name': v_messages.god,
      '/': v_messages.all
    };
    router = Router(routes);
    return router.init('/');
  });

}).call(this);
