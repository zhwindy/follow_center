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
      last_message_id:''#db中查出的上次看到的message_id用来定位
      gods:null
    created:->
      @bindScroll()
      @getGods()
    ready:->
    methods:
      setUnreadCount:->#设置未读的条目
        index = _.findIndex(@messages, (d)=>
          message_id = d.m_type+'_'+d.id
          return message_id == @last_message_id
        )
        if index == -1 or index == 0
          document.title = "Follow Center"
        else
          document.title = "(#{index})Follow Center"
        return index
      getGods:->
        if @gods
          return
        $.ajax
          url: '/gods'
          type: 'POST'
          success: (data, status, response) =>
            @gods = data.gods
      childElDone:(message_id, el)-> #component el 插入后回调，用来定位message
        if @god_name == null and @last_message_id==message_id
          count = @setUnreadCount()
          bz.showNotice5("#{count}条未读信息")
          if count!=0
            _.delay(@scrollToLastMessage, 500, el)
      saveLast:->
        return
        @last_message_id = @last.m_type+'_'+@last.id
        parm = JSON.stringify
          last_time:@last.created_at
          last_message_id:@last.m_type+'_'+@last.id
        $.ajax
          url: '/save_last'
          type: 'POST'
          data : parm
          success: (data, status, response) =>
            @setUnreadCount()
      scrollToLastMessage:(target)->#到上一次的message
        y = $(target).offset().top
        window.scrollTo(0, y)
      all:-> #查自己订阅了的所有的
        @god_name = null
        @user_info = ''
        @loading=true
        $.ajax
          url: '/all'
          type: 'POST'
          success: (data, status, response) =>
            @last_message_id = data.last_message_id
            @messages = data.messages.reverse()
            #@messages = data.messages
            @loading=false
            if data.messages.length == 0 #没有查到新的message，马上查历史的出来，让界面有点东西
              @more()
      more:->
        if @loading or @message == null #避免重复加载
          return
        if @god_name
          url = '/god'
          parm = JSON.stringify
            offset:@messages.length+1
            god_name:@god_name
        else
          url = '/more'
          parm = JSON.stringify
            offset:@messages.length+1
        @loading=true
        $.ajax
          url: url
          type: 'POST'
          data : parm
          success: (data, status, response) =>
            @messages = _.uniq _.union(@messages, data.messages), false, (item, key, a) ->
              item.row_num
            #for message in data.messages
            #  @messages.push(message)
            @loading=false
      new:->
        if @loading#避免重复加载
          return
        if @god_name
          return
        @loading=true
        $.ajax
          url: '/all'
          type: 'POST'
          success: (data, status, response) =>
            @last_message_id = data.last_message_id
            if data.messages.length != 1 and data.messages.length != 0
              data.messages.splice(0, 1) #删了第一个元素，为是用想同时间select，第一条元素重复会导致刷新
              @messages = _.uniq _.union(data.messages, @messages), false, (item, key, a) ->
                item.row_num
              @setUnreadCount()
            @loading=false
      god:(god_name)->
        @loading=true
        @god_name = god_name
        parm = JSON.stringify
          god_name:god_name
        $.ajax
          url: '/god'
          type: 'POST'
          data : parm
          success: (data, status, response) =>
            @messages = data.messages
            @loading=false
            window.scrollTo(0, 0) #回到顶端
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
          $top = $('#v_messages').offset().top
          if $(this).scrollTop() == 0 #滚动到最上面时，加载新的内容
            v.new()
            #$('body').addClass('fixed')
          else if ($('#v_messages .col-md-8').height() + $top - $(this).scrollTop() - $(this).height()) <= 0 #当滚动到最底部时，加载历史内容
            v.more()
            #$('body').removeClass('fixed')
          #选出当前正在看的message
          $('#v_messages .col-md-8 .box').each ->
            if $(this).offset().top+$(this).height() >= $top + $(window).scrollTop()
              #log 'this:'+$(this).offset().top+$(this).height()
              #log 'comparm:' + $top + $(window).scrollTop()
              #如果在god页面，不要记录消息
              if v.god_name != null
                return false
              #从jquery对像又取到 vue 对象
              message = $(this)[0].__vue__.message
              if v.last == null or v.last.created_at<message.created_at
                v.last = message
                v.saveLast()
              return false
  routes =
    '/god/:god_name': v_messages.god
    '/': v_messages.all
  router = Router(routes)
  router.init('/')
