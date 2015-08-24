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
        last_message_id: '',
        gods: null
      },
      created: function() {
        this.bindScroll();
        return this.getGods();
      },
      ready: function() {},
      methods: {
        setUnreadCount: function() {
          var index;
          index = _.findIndex(this.messages, (function(_this) {
            return function(d) {
              var message_id;
              message_id = d.m_type + '_' + d.id;
              return message_id === _this.last_message_id;
            };
          })(this));
          if (index === -1 || index === 0) {
            document.title = "Follow Center";
          } else {
            document.title = "(" + index + ")Follow Center";
          }
          return index;
        },
        getGods: function() {
          if (this.gods) {
            return;
          }
          return $.ajax({
            url: '/gods',
            type: 'POST',
            success: (function(_this) {
              return function(data, status, response) {
                return _this.gods = data.gods;
              };
            })(this)
          });
        },
        childElDone: function(message_id, el) {
          var count;
          if (this.god_name === null && this.last_message_id === message_id) {
            count = this.setUnreadCount();
            bz.showNotice5(count + "条未读信息");
            if (count !== 0) {
              return _.delay(this.scrollToLastMessage, 500, el);
            }
          }
        },
        saveLast: function() {
          var parm;
          this.last_message_id = this.last.m_type + '_' + this.last.id;
          parm = JSON.stringify({
            last_time: this.last.created_at,
            last_message_id: this.last.m_type + '_' + this.last.id
          });
          return $.ajax({
            url: '/save_last',
            type: 'POST',
            data: parm,
            success: (function(_this) {
              return function(data, status, response) {
                return _this.setUnreadCount();
              };
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
        "new": function() {
          if (this.loading) {
            return;
          }
          if (this.god_name) {
            return;
          }
          this.loading = true;
          return $.ajax({
            url: '/all',
            type: 'POST',
            success: (function(_this) {
              return function(data, status, response) {
                _this.last_message_id = data.last_message_id;
                if (data.messages.length !== 1) {
                  _this.messages = _.uniq(_.union(data.messages, _this.messages), false, function(item, key, a) {
                    return item.row_num;
                  });
                  _this.setUnreadCount();
                }
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
                _this.loading = false;
                return window.scrollTo(0, 0);
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
            $top = $('#v_messages').offset().top;
            if ($(this).scrollTop() === 0) {
              v["new"]();
            } else if (($('#v_messages .col-md-8').height() + $top - $(this).scrollTop() - $(this).height()) <= 0) {
              v.more();
            }
            return $('#v_messages .col-md-8 .box').each(function() {
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
