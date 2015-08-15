$ ->
  v_messages = new Vue
    el:'#v_messages'
    data:
      user_info:''
      user_infos:{}
      messages:null
      loading:false
      current_message_id:null
      god_name:null
    ready:->
      @bindScroll()
    methods:
      freshData:(parm)->
        @loading=true
        $.ajax
          url: '/messages_app'
          type: 'POST'
          data : parm
          success: (data, status, response) =>
            @messages = data.messages
            @loading=false
      all:->
        @god_name = null
        parm = JSON.stringify
          limit:30
        @freshData(parm)
      more:->
        @loading=true
        parm = JSON.stringify
          offset:@messages.length+1
          god_name:@god_name
        $.ajax
          url: '/messages_app'
          type: 'POST'
          data : parm
          success: (data, status, response) =>
            for message in data.messages
              @messages.push(message)
            @loading=false
      showTheGod:(god_name)->
        @god_name = god_name
        parm = JSON.stringify
          god_name:god_name
        @freshData(parm)
        @getUserInfo(god_name)
      getUserInfo:(user_name)->
        if @user_infos[user_name]
          @user_info = @user_infos[user_name]
          return
        parm = JSON.stringify
          user_name:user_name
        $.ajax
          url: '/user_info'
          type: 'POST'
          data : parm
          success: (data, status, response) =>
            @user_info = data.user_info
            @user_infos[user_name] = data.user_info
            @loading=false
      bindScroll:->
        v = @
        $(window).scroll ->
          #当滚动到最底部以上100像素时， 加载新内容
          if ($(document).height() - $(this).scrollTop() - $(this).height()) == 0
            v.more()
          #选出当前正在看的message
          $top = $('#v_messages').offset().top
          $('#v_messages .box').each ->
            if $(this).offset().top+$(this).height() >= $top + $(window).scrollTop()
              #从jquery对像又取到 vue 对象
              #user_name = $(this)[0].__vue__.message.user_name
              #if user_name !=v.user_info.user_name
              #  v.getUserInfo(user_name)
              return false
  routes =
    '/god/:god_name': v_messages.showTheGod
    '/': v_messages.all
  router = Router(routes)
  router.init('/')
