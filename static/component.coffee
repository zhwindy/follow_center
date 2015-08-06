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
