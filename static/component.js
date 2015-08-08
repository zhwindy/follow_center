(function() {
  Vue.component('follow', {
    props: ['followed', 'god_id'],
    template: '<button v-on="click:toggleFollow" type="button" class="btn btn-sm" aria-label="Left Align"></button>',
    ready: function() {
      if (this.followed === 1) {
        return this.showFollow();
      } else {
        return this.showUnfollow();
      }
    },
    methods: {
      showFollow: function() {
        var target;
        target = this.$el;
        $(target).text('Following');
        return $(target).removeClass('btn-default').addClass('btn-warning');
      },
      showUnfollow: function() {
        var target;
        target = this.$el;
        $(target).html('<span class="fa fa-heart yellow" aria-hidden="true">+</span>Follow');
        return $(target).removeClass('btn-warning').addClass('btn-default');
      },
      toggleFollow: function() {
        var parm, target;
        target = this.$el;
        if (this.followed === 0) {
          parm = JSON.stringify({
            god_id: this.god_id
          });
          return $.ajax({
            url: '/follow',
            type: 'POST',
            data: parm,
            success: (function(_this) {
              return function(data, status, response) {
                _this.loading = false;
                if (data.error !== '0') {
                  if (data.error === 'must login') {
                    return window.location.href = "/login";
                  } else {
                    throw new Error(data.error);
                  }
                } else {
                  bz.showSuccess5('Follow 成功');
                  _this.showFollow();
                  return _this.followed = 1;
                }
              };
            })(this),
            error: function() {}
          });
        } else {
          parm = JSON.stringify({
            god_id: this.god_id
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
                  _this.showUnfollow();
                  return _this.followed = 0;
                }
              };
            })(this),
            error: function() {}
          });
        }
      }
    }
  });

  Vue.component('twitter', {
    props: ['message'],
    computed: {
      avatar: function() {
        var avatar;
        avatar = btoa(btoa(this.message.avatar));
        return '/sp/' + avatar;
      },
      medias: function() {
        return _.map(message.extended_entities.media, function(d) {
          return '/sp/' + btoa(btoa(d.media_url_https));
        });
      }
    },
    template: '<div id="twitter_(%message.id%)" class="box box-solid item"> <div class="box-header"> <h2 class="box-title"> <a href="/user?god_name=(%message.user_name%)"> <img v-attr="src:avatar" class="direct-chat-img"> <div class="name"> (%message.name%) </div> </a> </h2> <div class="box-tools pull-right"> <a class="a-icon" target="_blank" href="(%message.href%)"> <span class="round-icon bg-icon-blue"> <i class="fa fa-twitter"></i> </span> </a> <a href="/message?t=(%message.m_type%)&id=(%message.id%)"> <sub>(%message.created_at%)</sub> </a> </div> </div> <div class="box-body"> <p class="description_bz">(%message.text%)</p> <a v-repeat="url:medias" href="(%url%)"> <img v-attr="src:url" class="img-responsive" > <br> </a> </div> </div>'
  });

  Vue.component('github', {
    template: ''
  });

  Vue.component('instagram', {
    template: ''
  });

}).call(this);
