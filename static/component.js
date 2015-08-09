(function() {
  var autoLink,
    slice = [].slice;

  autoLink = function() {
    var k, linkAttributes, option, options, pattern, v;
    options = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    pattern = /(^|[\s\n]|<br\/?>)((?:https?|ftp):\/\/[\-A-Z0-9+\u0026\u2019@#\/%?=()~_|!:,.;]*[\-A-Z0-9+\u0026@#\/%=~()_|])/gi;
    if (!(options.length > 0)) {
      return this.replace(pattern, "$1<a href='$2'>$2</a>");
    }
    option = options[0];
    linkAttributes = ((function() {
      var results;
      results = [];
      for (k in option) {
        v = option[k];
        if (k !== 'callback') {
          results.push(" " + k + "='" + v + "'");
        }
      }
      return results;
    })()).join('');
    return this.replace(pattern, function(match, space, url) {
      var link;
      link = (typeof option.callback === "function" ? option.callback(url) : void 0) || ("<a href='" + url + "'" + linkAttributes + ">" + url + "</a>");
      return "" + space + link;
    });
  };

  String.prototype['autoLink'] = autoLink;

  Vue.config.debug = true;

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
        if (this.message.extended_entities) {
          return _.map(this.message.extended_entities.media, function(d) {
            return '/sp/' + btoa(btoa(d.media_url_https));
          });
        }
      },
      text: function() {
        return this.message.text.autoLink({
          target: "_blank",
          rel: "外部链接,请谨慎打开"
        });
      }
    },
    template: '<div id="twitter_(%message.id%)" class="box box-solid item">\n    <div class="box-header">\n        <h2 class="box-title">\n            <a href="/user?god_name=(%message.user_name%)">\n                <img v-attr="src:avatar" class="direct-chat-img">\n                <div class="name">\n                    (%message.name%)\n                </div>\n            </a>\n        </h2>\n        <div class="box-tools pull-right">\n            <a class="a-icon" target="_blank" href="(%message.href%)">\n                <span class="round-icon bg-icon-blue">\n                    <i class="fa fa-twitter"></i>\n                </span>\n            </a>\n            <a href="/message?t=(%message.m_type%)&id=(%message.id%)">\n                <sub v-dateformat="\'yyyy-MM-dd hh:mm:ss\': message.created_at"></sub>\n            </a>\n        </div>\n    </div>\n    <div class="box-body">\n        <p class="description_bz" v-html="text"></p>\n        <template v-repeat="url:medias">\n            <img v-attr="src:url" class="img-responsive" >\n            <br>\n        </template>\n    </div>\n</div>'
  });

  Vue.component('github', {
    props: ['message'],
    computed: {
      avatar: function() {
        return this.message.avatar;
      },
      repo_url: function() {
        var repo_url;
        repo_url = this.message.content.repo.url.replace('api.github.com/repos', 'github.com');
        return repo_url;
      },
      repo_name: function() {
        return this.message.content.repo.name;
      },
      repo_link: function() {
        var repo_link;
        repo_link = "<a href='" + this.repo_url + "' target='_blank'>" + this.repo_name + "</a>";
        return repo_link;
      },
      type: function() {
        return this.message.content.type;
      },
      commits: function() {
        return this.message.content.payload.commits;
      }
    },
    template: '<div id="github_(%message.id%)" class="box box-solid item">\n    <div class="box-header">\n        <h2 class="box-title">\n            <a href="/user?god_name=(%message.user_name%)">\n                <img v-attr="src:avatar" class="direct-chat-img">\n                <div class="name">\n                    (%message.name%)\n                </div>\n            </a>\n        </h2>\n        <div class="box-tools pull-right">\n            <a class="a-icon" target="_blank" href="(%repo_url%)">\n                <span class="round-icon bg-icon-black">\n                    <i class="fa fa-github"></i>\n                </span>\n            </a>\n            <a href="/message?t=(%message.m_type%)&id=(%message.id%)">\n                <sub v-dateformat="\'yyyy-MM-dd hh:mm:ss\': message.created_at"></sub>\n            </a>\n        </div>\n    </div>\n    <div class="box-body">\n    (%type%) <a href=\'(%repo_url%)\' target=\'_blank\'>(%repo_name%)</a>\n      <li v-repeat="commits">\n          <a target="_blank" href="(%url.replace(\'api.github.com/repos\', \'github.com\')%)">\n              (%message%)\n          </a>\n      </li>\n    </div>\n</div>'
  });

  Vue.component('instagram', {
    computed: {
      avatar: function() {
        var avatar;
        avatar = btoa(btoa(this.message.avatar));
        return '/sp/' + avatar;
      },
      img_url: function() {
        var img_url;
        img_url = btoa(btoa(this.message.extended_entities.url));
        return '/sp/' + img_url;
      }
    },
    template: '<div id="instagram_(%message.id%)" class="box box-solid item">\n    <div class="box-header">\n        <h2 class="box-title">\n            <a href="/user?god_name=(%message.user_name%)">\n                <img v-attr="src:avatar" class="direct-chat-img">\n                <div class="name">\n                    (%message.name%)\n                </div>\n            </a>\n\n        </h2>\n        <div class="box-tools pull-right">\n            <a class="a-icon" target="_blank" href="(%message.href%)">\n                <span class="round-icon bg-icon-orange">\n                    <i class="fa fa-instagram"></i>\n                </span>\n            </a>\n            <a href="/message?t=(%message.m_type%)&id=(%message.id%)">\n                <sub v-dateformat="\'yyyy-MM-dd hh:mm:ss\': message.created_at"></sub>\n            </a>\n        </div>\n    </div>\n    <div class="box-body">\n        <p class="description_bz">(%message.text%)</p>\n        <img v-attr="src:img_url" class="img-responsive">\n        <br>\n    </div>\n</div>'
  });

}).call(this);
