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

  Vue.transition('fade', {
    enter: function(el, done) {
      $(el).css('opacity', 0).animate({
        opacity: 1
      }, 2000, done);
    },
    enterCancelled: function(el) {
      $(el).stop();
    },
    leave: function(el, done) {
      $(el).animate({
        opacity: 0
      }, 2000, done);
    },
    leaveCancelled: function(el) {
      $(el).stop();
    }
  });

  Vue.component('follow', {
    props: ['followed', 'god_id'],
    template: '<button v-on="click:toggleFollow" type="button" class="btn btn-sm" aria-label="Left Align"></button>',
    ready: function() {
      this.$watch('followed', function() {
        if (this.followed === 1) {
          return this.showFollow();
        } else {
          return this.showUnfollow();
        }
      });
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
        if (this.followed === 1) {
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
            })(this)
          });
        } else {
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
            })(this)
          });
        }
      }
    }
  });

  Vue.component('twitter', {
    props: ['message'],
    ready: function() {
      var message_id;
      message_id = this.message.m_type + '_' + this.message.id;
      return this.$parent.childElDone(message_id, this.$el);
    },
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
    template: '<div id="twitter_(%message.id%)" class="box box-solid item">\n    <div class="box-header">\n        <h2 class="box-title">\n            <a href="#/god/(%message.user_name%)">\n                <img v-attr="src:avatar" class="direct-chat-img">\n                <div class="name">\n                    (%message.name%)\n                </div>\n            </a>\n        </h2>\n        <div class="box-tools pull-right">\n            <a class="a-icon" target="_blank" href="(%message.href%)">\n                <span class="round-icon bg-icon-blue">\n                    <i class="fa fa-twitter"></i>\n                </span>\n            </a>\n            <a href="/message?t=(%message.m_type%)&id=(%message.id%)">\n                <sub v-dateformat="\'yyyy-MM-dd hh:mm:ss\': message.created_at"></sub>\n            </a>\n        </div>\n    </div>\n    <div class="box-body">\n        <p class="description_bz" v-html="text"></p>\n        <template v-repeat="url:medias">\n            <img v-attr="src:url" class="img-responsive" >\n            <br>\n        </template>\n    </div>\n</div>'
  });

  Vue.component('github', {
    props: ['message'],
    ready: function() {
      var message_id;
      message_id = this.message.m_type + '_' + this.message.id;
      return this.$parent.childElDone(message_id, this.$el);
    },
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
      payload: function() {
        return this.message.content.payload;
      },
      commits: function() {
        return this.payload.commits;
      },
      issue_comment_link: function() {
        var issue_comment_link, issue_comment_url, issue_title;
        issue_title = this.payload['issue']['title'];
        issue_comment_url = this.payload['comment']['html_url'];
        issue_comment_link = "<a target='_blank' href='" + issue_comment_url + "' >" + issue_title + "</a>";
        return issue_comment_link;
      },
      issue_comment_body: function() {
        return this.payload['comment']['body'];
      }
    },
    template: '<div id="github_(%message.id%)" class="box box-solid item">\n    <div class="box-header">\n        <h2 class="box-title">\n            <a href="#/god/(%message.user_name%)">\n                <img v-attr="src:avatar" class="direct-chat-img">\n                <div class="name">\n                    (%message.name%)\n                </div>\n            </a>\n        </h2>\n        <div class="box-tools pull-right">\n            <a class="a-icon" target="_blank" href="(%repo_url%)">\n                <span class="round-icon bg-icon-black">\n                    <i class="fa fa-github"></i>\n                </span>\n            </a>\n            <a href="/message?t=(%message.m_type%)&id=(%message.id%)">\n                <sub v-dateformat="\'yyyy-MM-dd hh:mm:ss\': message.created_at"></sub>\n            </a>\n        </div>\n    </div>\n    <div class="box-body">\n    (%type%) <a href=\'(%repo_url%)\' target=\'_blank\'>(%repo_name%)</a>\n      <li v-repeat="commits">\n          <a target="_blank" href="(%url.replace(\'api.github.com/repos\', \'github.com\')%)">\n              (%message%)\n          </a>\n      </li>\n      <p v-html="issue_comment_link">\n      </p>\n      <p v-show="issue_comment_body" class=\'description_bz\'>\n        (%issue_comment_body%)\n      </p>\n    </div>\n</div>'
  });

  Vue.component('instagram', {
    props: ['message'],
    ready: function() {
      var message_id;
      message_id = this.message.m_type + '_' + this.message.id;
      return this.$parent.childElDone(message_id, this.$el);
    },
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
    template: '<div id="instagram_(%message.id%)" class="box box-solid item">\n    <div class="box-header">\n        <h2 class="box-title">\n            <a href="#/god/(%message.user_name%)">\n                <img v-attr="src:avatar" class="direct-chat-img">\n                <div class="name">\n                    (%message.name%)\n                </div>\n            </a>\n        </h2>\n        <div class="box-tools pull-right">\n            <a class="a-icon" target="_blank" href="(%message.href%)">\n                <span class="round-icon bg-icon-orange">\n                    <i class="fa fa-instagram"></i>\n                </span>\n            </a>\n            <a href="/message?t=(%message.m_type%)&id=(%message.id%)">\n                <sub v-dateformat="\'yyyy-MM-dd hh:mm:ss\': message.created_at"></sub>\n            </a>\n        </div>\n    </div>\n    <div class="box-body">\n        <p class="description_bz">(%message.text%)</p>\n        <br>\n        <img v-attr="src:img_url" class="img-responsive">\n        <br>\n        <p class="description_bz">(%message.text%)</p>\n    </div>\n</div>'
  });

  Vue.component('c_user_info', {
    props: ['user_info'],
    computed: {
      avatar: function() {
        if (this.user_info.picture) {
          return this.user_info.picture;
        } else {
          return '/lib_static/images/avatar.svg';
        }
      }
    },
    template: '<div id="user_info" class="fixed" v-show="user_info" v-transition="fade">\n    <h3 class="box-title text-center">(%user_info.user_name%)</h3>\n    <input v-disable="disable_edit" id="profile-image-upload" class="hide" type="file" v-on="change:previewImg" accept="image/*"/>\n    <a v-on="click:changeImg" href="javascript:void(0)">\n        <img v-attr="src:avatar" id="profile-image" class="img-responsive center-block avatar" />\n    </a>\n    <div class="text-center">\n        <sub v-show="!disable_edit" >点击更换头像</sub>\n    </div>\n    <div v-html="user_info.slogan">\n    </div>\n    <br>\n    <hr>\n    <form class="form-horizontal">\n        <div class="form-group">\n            <label for="user_name" class="col-sm-3 control-label min-form-lable">用户名</label>\n            <div class="col-sm-9">\n                <input v-disable="disable_edit" type="text"  class="form-control" id="user_name" v-model="user_info.user_name">\n            </div>\n        </div>\n        <div class="form-group">\n            <label for="blog" class="col-sm-3 control-label min-form-lable">个人博客</label>\n            <div class="col-sm-9">\n                <input v-disable="disable_edit" type="text"  class="form-control editable" id="blog" placeholder="这个人很懒，什么也没留下"  v-model="user_info.blog"  v-on="focus:autoInsert(\'blog\')">\n            </div>\n        </div>\n        <div v-show="!disable_edit" class="form-group" id="slogan-group">\n            <label for="editor" class="col-sm-3 control-label min-form-lable">个性签名</label>\n            <div class="col-sm-9">\n                <textarea id="editor" placeholder="这个人很懒, 什么也没留下" v-model="user_info.slogan"></textarea>\n            </div>\n        </div>\n        <hr>\n        <div class="form-group">\n            <a href="https://twitter.com/(%user_info.twitter%)" target="_blank">\n                <label class="col-sm-5 control-label">\n                    <span class="round-icon bg-icon-blue">\n                        <i class="fa fa-twitter"></i>\n                    </span>\n                    Twitter\n                </label>\n            </a>\n            <div class="col-sm-7">\n                <input v-disable="disable_edit" type="text" class="form-control editable" id="twitter" placeholder="这个人很懒，什么也没留下"   v-model="user_info.twitter" v-on="focus:autoInsert(\'twitter\', user_info.user_name)">\n            </div>\n        </div>\n        <div class="form-group">\n            <a href="https://github.com/(%user_info.github%)" target="_blank">\n                <label class="col-sm-5 control-label"><span class="round-icon bg-icon-black"><i class="fa fa-github"></i></span> Github</label>\n            </a>\n            <div class="col-sm-7">\n                <input v-disable="disable_edit" type="text" class="form-control editable" placeholder="这个人很懒，什么也没留下"  v-model="user_info.github" v-on="focus:autoInsert(\'github\', user_info.user_name)">\n            </div>\n        </div>\n        <div class="form-group">\n            <a href="https://instagram.com/(%user_info.instagram%)" target="_blank">\n                <label class="col-sm-5 control-label"><span class="round-icon bg-icon-orange"><i class="fa fa-instagram"></i></span> Instagram</label>\n            </a>\n            <div class="col-sm-7">\n                <input v-disable="disable_edit" type="text" class="form-control editable" placeholder="这个人很懒，什么也没留下"  v-model="user_info.instagram" v-on="focus:autoInsert(\'instagram\', user_info.user_name)">\n            </div>\n        </div>\n    </form>\n    <div class="text-center">\n        <follow followed="(%@ user_info.followed%)" god_id="(%user_info.god_id%)"></follow>\n        <button id="btn-edit" v-btn-loading="loading" type="submit" class="btn btn-primary btn-flat btn-border" v-on="click:save">编辑</button>\n    </div>\n</div>',
    ready: function() {
      bz.setOnErrorVm(this);
      return this.initSimditor();
    },
    data: function() {
      return {
        loading: false,
        disable_edit: true,
        button_text: '修改资料'
      };
    },
    methods: {
      initSimditor: function() {
        var mobileToolbar, small_tool_bar, toolbar, v;
        toolbar = ['title', 'bold', 'italic', 'underline', 'strikethrough', 'color', '|', 'ol', 'ul', 'blockquote', 'code', 'table', '|', 'link', 'image', 'hr', '|', 'indent', 'outdent', 'alignment'];
        mobileToolbar = ['bold', 'underline', 'strikethrough', 'color', 'ul', 'ol'];
        small_tool_bar = ['title', 'link', 'image', 'bold'];
        if (bz.mobilecheck()) {
          toolbar = mobileToolbar;
        }
        window.editor = new Simditor({
          textarea: $('#editor'),
          placeholder: '这里输入文字...',
          toolbar: small_tool_bar,
          toolbarFloat: false,
          pasteImage: true,
          defaultImage: 'assets/images/image.png',
          upload: {
            url: '/upload_image',
            params: null,
            fileKey: 'upload_file',
            connectionCount: 3,
            leaveConfirm: '正在上传文件，如果离开上传会自动取消'
          }
        });
        v = this;
        return editor.on('valuechanged', function(e, src) {
          return v.$set('user_info.slogan', editor.getValue());
        });
      },
      autoInsert: function(key, scheme) {
        if (scheme == null) {
          scheme = 'http://';
        }
        if (!this.user_info[key]) {
          return this.user_info.$set(key, scheme);
        }
      },
      changeImg: function() {
        return $('#profile-image-upload').click();
      },
      previewImg: function(e) {
        var file, reader;
        file = e.target.files[0];
        if (!file) {
          return;
        }
        if (file.size > (10 * 1024 * 1024)) {
          throw new Error("图片大小只能小于10m哦~");
        }
        reader = new FileReader();
        reader.onload = function(e) {
          return $("#profile-image-upload").attr("src", e.target.result);
        };
        reader.readAsDataURL(file);
        return this.uploadImage();
      },
      uploadImage: function() {
        var fd, file;
        fd = new FormData();
        file = $("#profile-image-upload")[0].files[0];
        if (file) {
          fd.append("img", file);
          return $.ajax({
            url: '/upload_image',
            type: 'POST',
            data: fd,
            processData: false,
            contentType: false,
            success: (function(_this) {
              return function(data, status, response) {
                _this.loading = false;
                if (!data.success) {
                  throw new Error(data.msg);
                } else {
                  bz.showSuccess5("保存成功");
                  _this.user_info.picture = data.file_path;
                  return $("#profile-image").attr("src", _this.user_info.picture);
                }
              };
            })(this),
            error: function(error_info) {
              this.loading = false;
              throw new Error(error_info);
            }
          });
        }
      },
      save: function() {
        var parm, path, user_info;
        if (this.disable_edit) {
          this.disable_edit = false;
          return $("#btn-edit").text('保存');
        } else {
          this.loading = true;
          user_info = _.clone(this.user_info);
          parm = JSON.stringify({
            user_name: this.user_info.user_name,
            blog: this.user_info.blog,
            twitter: this.user_info.twitter,
            github: this.user_info.github,
            instagram: this.user_info.instagram,
            slogan: this.user_info.slogan
          });
          path = bz.getUrlPath(1);
          return $.ajax({
            url: '/add',
            type: 'POST',
            data: parm,
            success: (function(_this) {
              return function(data, status, response) {
                _this.loading = false;
                _this.disable_edit = true;
                $("#btn-edit").text('编辑');
                if (data.error !== '0') {
                  throw new Error(data.error);
                } else {
                  return bz.showSuccess5("保存成功");
                }
              };
            })(this)
          });
        }
      }
    }
  });

  Vue.component('c_god', {
    props: ['god'],
    computed: {
      twitter_link: function() {
        if (this.god.twitter_user) {
          return "<a class='a-icon' target='_blank' href='https://twitter.com/" + this.god.twitter + "'> <span class='round-icon bg-icon-blue'> <i class='fa fa-twitter'></i> </span> </a> " + this.god.twitter_user.followers_count;
        } else {
          return '';
        }
      },
      github_link: function() {
        if (this.god.github_user) {
          return "<a class='a-icon' target='_blank' href='https://github.com/" + this.god.github + "'> <span class='round-icon bg-icon-black'> <i class='fa fa-github'></i> </span> </a> " + this.god.github_user.followers;
        } else {
          return '';
        }
      },
      instagram_link: function() {
        if (this.god.instagram_user) {
          return "<a class='a-icon' target='_blank' href='https://instagram.com/" + this.god.instagram + "'> <span class='round-icon bg-icon-orange'> <i class='fa fa-instagram'></i> </span> </a> " + this.god.instagram_user.counts.followed_by;
        } else {
          return '';
        }
      },
      all_link: function() {
        return this.twitter_link + this.github_link + this.instagram_link;
      },
      description: function() {
        var description;
        description = '';
        if (this.god.slogan) {
          description = this.god.slogan;
        } else if (this.god.twitter_user) {
          description = this.god.twitter_user.description;
        }
        return description;
      },
      avatar: function() {
        var avatar_url;
        if (this.god.picture) {
          avatar_url = this.god.picture;
        } else if (this.god.github_user) {
          avatar_url = this.god.github_user.avatar_url;
        } else if (this.god.twitter_user) {
          avatar_url = this.god.twitter_user.profile_image_url_https;
        } else if (this.god.instagram_user) {
          avatar_url = this.god.instagram_user.profile_picture;
        }
        avatar_url = btoa(btoa(avatar_url));
        return '/sp/' + avatar_url;
      }
    },
    template: '<div  class="box box-solid item">\n    <div class="box-header">\n        <h3 class="box-title">\n            <a href="/#/god/(%god.user_name%)">\n                <img v-attr="src:avatar" class="direct-chat-img">\n                <div class="name">\n                    (%god.user_name%)\n                </div>\n            </a>\n        </h3>\n        <div class="box-tools pull-right" v-html="all_link">\n        </div>\n    </div>\n    <div class="box-body" v-html="description">\n    </div>\n    <div class="box-footer">\n        <follow followed="(%god.followed%)" god_id="(%god.god_id%)"></follow>\n    </div>\n</div>'
  });

}).call(this);
