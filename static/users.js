(function() {
  $(function() {
    var v_users;
    return v_users = new Vue({
      created: function() {
        return bz.setOnErrorVm(this);
      },
      el: '#v_users',
      methods: {
        toggleFollow: function(e, god_id) {
          var parm, target;
          target = e.target;
          log(god_id);
          if ($(target).hasClass('btn-default')) {
            parm = JSON.stringify({
              god_id: god_id
            });
            return $.ajax({
              url: '/follow',
              type: 'POST',
              data: parm,
              success: (function(_this) {
                return function(data, status, response) {
                  _this.loading = false;
                  if (data.error !== '0') {
                    throw new Error(data.error);
                  } else {
                    bz.showSuccess5('Follow 成功');
                    $(target).text('Following');
                    return $(target).removeClass('btn-default').addClass('btn-warning');
                  }
                };
              })(this),
              error: function() {}
            });
          } else {
            parm = JSON.stringify({
              god_id: god_id
            });
            return $.ajax({
              url: '/unfollow',
              type: 'POST',
              data: parm,
              success: (function(_this) {
                return function(data, status, response) {
                  _this.loading = false;
                  if (data.error !== '0') {
                    throw new Error(data.error);
                  } else {
                    bz.showSuccess5('Unfollow 成功');
                    $(target).html('<span class="fa fa-heart yellow" aria-hidden="true">+</span>Follow');
                    return $(target).removeClass('btn-warning').addClass('btn-default');
                  }
                };
              })(this),
              error: function() {}
            });
          }
        }
      }
    });
  });

}).call(this);
