#follow 的按钮
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
  #template: 'id=(%message.id%), user_name=(%message.user_name%), avatar=(%message.avatar%)<br>'
  computed:
    #v-attr只接收变量,为了用proxy,这里要处理
    avatar:->
      avatar = btoa(btoa(@message.avatar))
      log avatar
      return '/sp/'+avatar
  template: '
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
                            <sub>(%message.created_at%)</sub>
                        </a>
                    </div>
                </div>
                <div class="box-body">
                    <p class="description_bz">(%message.text%)</p>
                    <a v-repeat="meida:message.extended_entities.media" href="(%media.media_url_https%)">
                        <img v-attr="src:media.media_url_https" class="img-responsive" >
                        <br>
                    </a>
                </div>
            </div>
            '

Vue.component 'github',
  template:''
