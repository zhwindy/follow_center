(function() {
  $(function() {
    var router, routes, v_messages;
    v_messages = new Vue({
      el: '#v_messages',
      data: {
        user_info: '',
        user_infos: {},
        messages: [],
        loading: false,
        new_loading: false,
        old_loading: false,
        current_message_id: null,
        god_name: null,
        last_message: null,
        last_message_id: '',
        gods: null,
        unreadCount: 0
      },
      created: function() {
        this.bindScroll();
        return this.getGods();
      },
      ready: function() {},
      methods: {
        main: function() {
          this.god_name = null;
          this.user_info = '';
          return this["new"]();
        },
        "new": function() {
          this.new_loading = true;
          return $.ajax({
            url: '/new',
            type: 'POST',
            success: (function(_this) {
              return function(data, status, response) {
                if (data.messages.length !== 0) {
                  _this.messages = _.uniq(_.union(_this.messages, data.messages), false, function(item, key, a) {
                    return item.row_num;
                  });
                  _this.setTitleUnreadCount(data.messages.length);
                } else {
                  if (_this.messages.length === 0) {
                    _this.old();
                  }
                }
                return _this.new_loading = false;
              };
            })(this)
          });
        },
        old: function() {
          var el, parm;
          if (this.$.c_messages.length !== 0) {
            el = this.$.c_messages[0].$el;
          } else {
            el = null;
          }
          log(el);
          parm = JSON.stringify({
            offset: this.messages.length
          });
          this.old_loading = true;
          return $.ajax({
            url: '/old',
            type: 'POST',
            data: parm,
            success: (function(_this) {
              return function(data, status, response) {
                _this.messages = _.uniq(_.union(data.messages.reverse(), _this.messages), false, function(item, key, a) {
                  return item.row_num;
                });
                _this.old_loading = false;
                if (el !== null) {
                  return _.delay(_this.scrollTo, 500, el, -50);
                }
              };
            })(this)
          });
        },
        god_old: function() {
          var parm, url;
          url = '/god';
          return parm = JSON.stringify({
            offset: this.messages.length + 1,
            god_name: this.god_name
          });
        },
        setTitleUnreadCount: function(count) {
          this.unreadCount = count;
          if (count === 0) {
            return document.title = "Follow Center";
          } else {
            return document.title = "(" + count + ") Follow Center";
          }
        },
        saveLast: function(last_message) {
          var parm;
          this.last_message_id = last_message.m_type + '_' + last_message.id;
          parm = JSON.stringify({
            last_time: last_message.created_at,
            last_message_id: last_message.m_type + '_' + last_message.id
          });
          return $.ajax({
            url: '/save_last',
            type: 'POST',
            data: parm,
            success: (function(_this) {
              return function(data, status, response) {
                _this.last_message = last_message;
                if (data.count === 1) {
                  return _this.setTitleUnreadCount(_this.unreadCount - 1);
                }
              };
            })(this)
          });
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
              return _.delay(this.scrollTo, 500, el);
            }
          }
        },
        scrollTo: function(target, offset) {
          var y;
          if (offset == null) {
            offset = 0;
          }
          y = $(target).offset().top;
          y = y + offset;
          return window.scrollTo(0, y);
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
              if (v.old_loading === false) {
                v.old();
              }
            } else if (($('#v_messages .col-md-8').height() + $top - $(this).scrollTop() - $(this).height()) <= 0) {
              if (v.new_loading === false) {
                v["new"]();
              }
            }
            return $('#v_messages .col-md-8 .box').each(function() {
              var message;
              if ($(this).offset().top + $(this).height() >= $top + $(window).scrollTop()) {
                if (v.god_name !== null) {
                  return false;
                }
                message = $(this)[0].__vue__.message;
                if (v.last_message === null || v.last_message.created_at < message.created_at) {
                  v.saveLast(message);
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
      '/': v_messages.main
    };
    router = Router(routes);
    return router.init('/');
  });

}).call(this);
