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
      last:null#用来放上次看到的message
    ready:->
      @bindScroll()
    methods:
      saveLast:->
        parm = JSON.stringify
          last_time:@last.created_at
          last_message_id:@last.m_type+'_'+@last.id
        $.ajax
          url: '/save_last'
          type: 'POST'
          data : parm
          success: (data, status, response) =>
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
        @user_info = ''
        parm = JSON.stringify
          limit:30
        @freshData(parm)
      more:->
        #避免重复加载
        if @loading
          return
        @loading=true
        parm = JSON.stringify
          offset:@messages.length+1
          god_name:@god_name
          limit:50
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
              message = $(this)[0].__vue__.message
              if v.last == null or v.last.created_at<message.created_at
                v.last = message
                v.saveLast()
                log v.last
              return false
  routes =
    '/god/:god_name': v_messages.showTheGod
    '/': v_messages.all
  router = Router(routes)
  router.init('/')
