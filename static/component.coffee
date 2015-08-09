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
Vue.component 'follow',
  props: [ 'followed', 'god_id' ]
  template: '<button v-on="click:toggleFollow" type="button" class="btn btn-sm" aria-label="Left Align"></button>'
  ready:->
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

      if @followed == 0 #还没follow
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
          error: ->
      else
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
          error: ->

Vue.component 'twitter',
  props: [ 'message' ]
  computed:
    #v-attr只接收变量,为了用proxy,这里要处理
    avatar:->
      avatar = btoa(btoa(@message.avatar))
      return '/sp/'+avatar
    medias:->
      return _.map(@message.extended_entities.media, (d)->
        '/sp/'+btoa(btoa(d.media_url_https))
        )
    text:->
      return @message.text.autoLink({ target: "_blank", rel: "外部链接,请谨慎打开"})
  template: '''
            <div id="twitter_(%message.id%)" class="box box-solid item">
                <div class="box-header">
                    <h2 class="box-title">
                        <a href="/user?god_name=(%message.user_name%)">
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
                      <a href="/user?god_name=(%message.user_name%)">
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
                <a href="/user?god_name=(%message.user_name%)">
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
