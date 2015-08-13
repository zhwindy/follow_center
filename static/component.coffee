#auto link
autoLink = (options...) ->
  pattern = ///
    (^|[\s\n]|<br\/?>) # Capture the beginning of string or line or leading whitespace
    (
      (?:https?|ftp):// # Look for a valid URL protocol (non-captured)
      [\-A-Z0-9+\u0026\u2019@#/%?=()~_|!:,.;]* # Valid URL characters (any number of times)
      [\-A-Z0-9+\u0026@#/%=~()_|] # String must end in a valid URL character
    )
  ///gi

  return @replace(pattern, "$1<a href='$2'>$2</a>") unless options.length > 0

  option = options[0]
  linkAttributes = (
    " #{k}='#{v}'" for k, v of option when k isnt 'callback'
  ).join('')

  @replace pattern, (match, space, url) ->
    link = option.callback?(url) or
      "<a href='#{url}'#{linkAttributes}>#{url}</a>"

    "#{space}#{link}"

String.prototype['autoLink'] = autoLink
#follow 的按钮
Vue.config.debug = true

Vue.transition 'fade',
  enter: (el, done) ->
    # 此时元素已被插入 DOM
    # 动画完成时调用 done 回调
    $(el).css('opacity', 0).animate { opacity: 1 }, 2000, done
    return
  enterCancelled: (el) ->
    $(el).stop()
    #$(el).animate { opacity: 0 }, 2000, done
    return
  leave: (el, done) ->
    # 与 enter 钩子同理
    $(el).animate { opacity: 0 }, 2000, done
    return
  leaveCancelled: (el) ->
    $(el).stop()
    return

Vue.component 'follow',
  props: [ 'followed', 'god_id']
  template: '<button v-on="click:toggleFollow" type="button" class="btn btn-sm" aria-label="Left Align"></button>'
  ready:->
    @$watch 'followed',->
      if @followed == 1
        @showFollow()
      else
        @showUnfollow()
  methods:
    showFollow:->
      target = @$el
      $(target).text('Following')
      $(target).removeClass('btn-default').addClass('btn-warning')
    showUnfollow:->
      target = @$el
      $(target).html('<span class="fa fa-heart yellow" aria-hidden="true">+</span>Follow')
      $(target).removeClass('btn-warning').addClass('btn-default')
    toggleFollow:->
      target = @$el

      if @followed == 1
        parm = JSON.stringify
          god_id:@god_id
        $.ajax
          url: '/unfollow'
          type: 'POST'
          data : parm
          success: (data, status, response) =>
            @loading=false
            if data.error != '0'
              throw new Error(data.error)
            else
              bz.showSuccess5('Unfollow 成功')
              @showUnfollow()
              @followed = 0
      else
        parm = JSON.stringify
          god_id:@god_id
        $.ajax
          url: '/follow'
          type: 'POST'
          data : parm
          success: (data, status, response) =>
            @loading=false
            if data.error != '0'
              #如果是要登录,那么跳转到登录
              if data.error == 'must login'
                window.location.href = "/login"
              else
                throw new Error(data.error)
            else
              bz.showSuccess5('Follow 成功')
              @showFollow()
              @followed = 1

Vue.component 'twitter',
  props: [ 'message' ]
  computed:
    #v-attr只接收变量,为了用proxy,这里要处理
    avatar:->
      avatar = btoa(btoa(@message.avatar))
      return '/sp/'+avatar
    medias:->
      if @message.extended_entities
        return _.map(@message.extended_entities.media, (d)->
          '/sp/'+btoa(btoa(d.media_url_https))
          )
    text:->
      return @message.text.autoLink({ target: "_blank", rel: "外部链接,请谨慎打开"})
  template: '''
            <div id="twitter_(%message.id%)" class="box box-solid item">
                <div class="box-header">
                    <h2 class="box-title">
                        <a href="#/god/(%message.user_name%)">
                            <img v-attr="src:avatar" class="direct-chat-img">
                            <div class="name">
                                (%message.name%)
                            </div>
                        </a>
                    </h2>
                    <div class="box-tools pull-right">
                        <a class="a-icon" target="_blank" href="(%message.href%)">
                            <span class="round-icon bg-icon-blue">
                                <i class="fa fa-twitter"></i>
                            </span>
                        </a>
                        <a href="/message?t=(%message.m_type%)&id=(%message.id%)">
                            <sub v-dateformat="'yyyy-MM-dd hh:mm:ss': message.created_at"></sub>
                        </a>
                    </div>
                </div>
                <div class="box-body">
                    <p class="description_bz" v-html="text"></p>
                    <template v-repeat="url:medias">
                        <img v-attr="src:url" class="img-responsive" >
                        <br>
                    </template>
                </div>
            </div>
            '''

Vue.component 'github',
  props: [ 'message' ]
  computed:
    avatar:->
      return @message.avatar
    repo_url:->
      repo_url = @message.content.repo.url.replace('api.github.com/repos', 'github.com')
      return repo_url
    repo_name:->
      return @message.content.repo.name
    repo_link:->
      repo_link = "<a href='#{@repo_url}' target='_blank'>#{@repo_name}</a>"
      return repo_link
    type:->
      return @message.content.type
    commits:->
      return @message.content.payload.commits
  template:'''
          <div id="github_(%message.id%)" class="box box-solid item">
              <div class="box-header">
                  <h2 class="box-title">
                      <a href="#/god/(%message.user_name%)">
                          <img v-attr="src:avatar" class="direct-chat-img">
                          <div class="name">
                              (%message.name%)
                          </div>
                      </a>
                  </h2>
                  <div class="box-tools pull-right">
                      <a class="a-icon" target="_blank" href="(%repo_url%)">
                          <span class="round-icon bg-icon-black">
                              <i class="fa fa-github"></i>
                          </span>
                      </a>
                      <a href="/message?t=(%message.m_type%)&id=(%message.id%)">
                          <sub v-dateformat="'yyyy-MM-dd hh:mm:ss': message.created_at"></sub>
                      </a>
                  </div>
              </div>
              <div class="box-body">
              (%type%) <a href='(%repo_url%)' target='_blank'>(%repo_name%)</a>
                <li v-repeat="commits">
                    <a target="_blank" href="(%url.replace('api.github.com/repos', 'github.com')%)">
                        (%message%)
                    </a>
                </li>
              </div>
          </div>
  '''

Vue.component 'instagram',
  computed:
    #v-attr只接收变量,为了用proxy,这里要处理
    avatar:->
      avatar = btoa(btoa(@message.avatar))
      return '/sp/'+avatar
    img_url:->
      img_url = btoa(btoa(@message.extended_entities.url))
      return '/sp/'+img_url
  template:'''
    <div id="instagram_(%message.id%)" class="box box-solid item">
        <div class="box-header">
            <h2 class="box-title">
                <a href="#/god/(%message.user_name%)">
                    <img v-attr="src:avatar" class="direct-chat-img">
                    <div class="name">
                        (%message.name%)
                    </div>
                </a>
    
            </h2>
            <div class="box-tools pull-right">
                <a class="a-icon" target="_blank" href="(%message.href%)">
                    <span class="round-icon bg-icon-orange">
                        <i class="fa fa-instagram"></i>
                    </span>
                </a>
                <a href="/message?t=(%message.m_type%)&id=(%message.id%)">
                    <sub v-dateformat="'yyyy-MM-dd hh:mm:ss': message.created_at"></sub>
                </a>
            </div>
        </div>
        <div class="box-body">
            <p class="description_bz">(%message.text%)</p>
            <img v-attr="src:img_url" class="img-responsive">
            <br>
        </div>
    </div>
    '''

Vue.component 'c_user_info',
  props: [ 'user_info' ]
  computed:
    avatar:->
      if @user_info.picture
        return @user_info.picture
      else
        return '/lib_static/images/avatar.svg'

  template:'''
  <div id="user_info" class="fixed" v-show="user_info" v-transition="fade">
      <h3 class="box-title text-center">(%user_info.user_name%)</h3>
      <input v-disable="disable_edit" id="profile-image-upload" class="hide" type="file" v-on="change:previewImg" accept="image/*"/>
      <a v-on="click:changeImg" href="javascript:void(0)">
          <img v-attr="src:avatar" id="profile-image" class="img-responsive center-block avatar" />
      </a>
      <div class="text-center">
          <sub>点击更换头像</sub>
      </div>
      <div v-html="user_info.slogan">
      </div>
      <hr>
      <form class="form-horizontal">
          <div class="form-group">
              <label for="user_name" class="col-sm-3 control-label min-form-lable">用户名</label>
              <div class="col-sm-9">
                  <input v-disable="disable_edit" type="text"  class="form-control" id="user_name" v-model="user_info.user_name">
              </div>
          </div>
          <div class="form-group">
              <label for="blog" class="col-sm-3 control-label min-form-lable">个人博客</label>
              <div class="col-sm-9">
                  <input v-disable="disable_edit" type="text"  class="form-control editable" id="blog" placeholder="这个人很懒，什么也没留下"  v-model="user_info.blog"  v-on="focus:autoInsert('blog')">
              </div>
          </div>
          <div v-show="!disable_edit" class="form-group" id="slogan-group">
              <label for="editor" class="col-sm-3 control-label min-form-lable">个性签名</label>
              <div class="col-sm-9">
                  <textarea id="editor" placeholder="这个人很懒, 什么也没留下" v-model="user_info.slogan"></textarea>
              </div>
          </div>
          <hr>
          <div class="form-group">
              <a href="https://twitter.com/(%user_info.twitter%)" target="_blank">
                  <label class="col-sm-5 control-label">
                      <span class="round-icon bg-icon-blue">
                          <i class="fa fa-twitter"></i>
                      </span>
                      Twitter
                  </label>
              </a>
              <div class="col-sm-7">
                  <input v-disable="disable_edit" type="text" class="form-control editable" id="twitter" placeholder="这个人很懒，什么也没留下"   v-model="user_info.twitter" v-on="focus:autoInsert('twitter', user_info.user_name)">
              </div>
          </div>
          <div class="form-group">
              <a href="https://github.com/(%user_info.github%)" target="_blank">
                  <label class="col-sm-5 control-label"><span class="round-icon bg-icon-black"><i class="fa fa-github"></i></span> Github</label>
              </a>
              <div class="col-sm-7">
                  <input v-disable="disable_edit" type="text" class="form-control editable" placeholder="这个人很懒，什么也没留下"  v-model="user_info.github" v-on="focus:autoInsert('github', user_info.user_name)">
              </div>
          </div>
          <div class="form-group">
              <a href="https://instagram.com/(%user_info.instagram%)" target="_blank">
                  <label class="col-sm-5 control-label"><span class="round-icon bg-icon-orange"><i class="fa fa-instagram"></i></span> Instagram</label>
              </a>
              <div class="col-sm-7">
                  <input v-disable="disable_edit" type="text" class="form-control editable" placeholder="这个人很懒，什么也没留下"  v-model="user_info.instagram" v-on="focus:autoInsert('instagram', user_info.user_name)">
              </div>
          </div>
      </form>
      <div class="text-center">
          <follow followed="(%@ user_info.followed%)" god_id="(%user_info.god_id%)"></follow>
          <button id="btn-edit" v-btn-loading="loading" type="submit" class="btn btn-primary btn-flat btn-border" v-on="click:save">编辑</button>
      </div>
  </div>
  '''
  ready:->
    bz.setOnErrorVm(@)
  data:->
    loading: false
    disable_edit: true # 禁止编辑
    button_text:'修改资料'
  methods:
    # 协议可以配置
    autoInsert:(key, scheme='http://')->
      if not @user_info[key]
        @user_info.$set(key, scheme)
    changeImg:->
      $('#profile-image-upload').click()
    previewImg:(e)->
      file = e.target.files[0]
      if not file
        return
      if file.size > (10 * 1024 * 1024)
        throw new Error("图片大小只能小于10m哦~")
      reader = new FileReader()
      reader.onload = (e)->
        $("#profile-image-upload").attr("src", e.target.result)
      reader.readAsDataURL(file)
      @uploadImage()
    uploadImage:->
      fd = new FormData()
      file = $("#profile-image-upload")[0].files[0]
      if file
        fd.append("img", file)
        $.ajax
          url: '/upload_image'
          type: 'POST'
          data : fd
          processData: false
          contentType: false
          success: (data, status, response) =>
            #为了兼容 simditor 这里的返回值不太一样
            @loading=false
            if not data.success
              throw new Error(data.msg)
            else
              bz.showSuccess5("保存成功")
              @user_info.picture = data.file_path
              $("#profile-image").attr("src", @user_info.picture)
          error: (error_info)->
            @loading=false
            throw new Error(error_info)
    save:->
      if @disable_edit
        @disable_edit = false
        $("#btn-edit").text('保存')
      else
        @loading = true
        parm = JSON.stringify @user_info
        #如果url path不同,则向对应后台url发请求,以应对重载又要留着原本profile的情况(follow_center)
        path = bz.getUrlPath(1)
        $.ajax
          url: '/'+path
          type: 'POST'
          data : parm
          success: (data, status, response) =>
            @loading=false
            @disable_edit=true
            $("#btn-edit").text('编辑')
            if data.error != '0'
              throw new Error(data.error)
            else
              bz.showSuccess5("保存成功")
