$ ->
  v_users = new Vue
    created:->
      bz.setOnErrorVm(@)
    el:'#v_users'
    methods:
      toggleFollow:(e, god_id)->
        target = e.target
        log god_id

        if $(target).hasClass('btn-default') #还没follow
          parm = JSON.stringify
            god_id:god_id
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
                $(target).text('Following')
                $(target).removeClass('btn-default').addClass('btn-warning')
            error: ->
        else
          parm = JSON.stringify
            god_id:god_id
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
                $(target).html('<span class="fa fa-heart yellow" aria-hidden="true">+</span>Follow')
                $(target).removeClass('btn-warning').addClass('btn-default')
            error: ->


