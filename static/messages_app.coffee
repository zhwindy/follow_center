$ ->
  v_messages = new Vue
    el:'#v_messages'
    data:
      user_info:''
      user_infos:{}
      messages:[]
      loading:false
      new_loading:false
      old_loading:false
      current_message_id:null
      god_name:null
      last_message:null #用来放上次看到的message
      last_message_id:''#db中查出的上次看到的message_id用来定位
      gods:null
      unreadCount:0
    created:->
      @bindScroll()
      @getGods()
    ready:->
    methods:
      new:->
        if @new_loading
          return
        if @god_name
          @newGod()
        else
          @newAll()
      old:->
        if @old_loading
          return
        if @god_name
          @oldGod()
        else
          @oldAll()
      main:-> # 首页
        @god_name = null
        @user_info = ''
        @newAll()
      newAll:->
        @new_loading=true
        $.ajax
          url: '/new'
          type: 'POST'
          success: (data, status, response) =>
            if data.messages.length != 0
              @messages = _.uniq _.union(@messages, data.messages.reverse()), false, (item, key, a) ->
                item.row_num
              @setTitleUnreadCount(data.messages.length)
            else
              if @messages.length == 0
                @oldAll()
            @new_loading=false
      oldAll:->
        parm = JSON.stringify
          offset:@messages.length
        @old_loading=true
        $.ajax
          url: '/old'
          type: 'POST'
          data : parm
          success: (data, status, response) =>
            @messages = _.uniq _.union(data.messages.reverse(), @messages), false, (item, key, a) ->
              item.row_num
            @old_loading=false
            el = @getLastMessageEl()
            if el != null
              _.delay(@scrollTo, 500, el, -50)
      mainGod:(god_name)->
        @god_name = god_name
        @newGod()
        #window.scrollTo(0, 0) #回到顶端
        #_.delay(window.scrollTo, 2500, 0,0)
      newGod:->
        @new_loading=true
        parm = JSON.stringify
          god_name:@god_name
        $.ajax
          url: '/god'
          type: 'POST'
          data : parm
          success: (data, status, response) =>
            @messages = _.uniq _.union(@messages, data.messages.reverse()), false, (item, key, a) ->
              item.row_num
            @setTitleUnreadCount(data.messages.length)
            @new_loading=false
        @getUserInfo(@god_name)
      oldGod:->
        parm = JSON.stringify
          offset:@messages.length+1
          god_name:@god_name
        @old_loading=true
        $.ajax
          url: '/god'
          type: 'POST'
          data : parm
          success: (data, status, response) =>
            @messages = _.uniq _.union(data.messages.reverse(), @messages), false, (item, key, a) ->
              item.row_num
            @old_loading=false
            el = @getLastMessageEl()
            if el != null
              _.delay(@scrollTo, 500, el, -50)
      getLastMessageEl:->
        if @$.c_messages.length != 0
          el = @$.c_messages[0].$el
        else
          el = null
        return el
      setTitleUnreadCount:(count)->#设置未读的条目数
        @unreadCount = count
        if count == 0
          document.title = "Follow Center"
        else
          document.title = "(#{count}) Follow Center"
      saveLast:(last_message)->
        @last_message_id = last_message.m_type+'_'+last_message.id
        parm = JSON.stringify
          last_time:last_message.created_at
          last_message_id:last_message.m_type+'_'+last_message.id
        $.ajax
          url: '/save_last'
          type: 'POST'
          data : parm
          success: (data, status, response) =>
            #存储在本地，用来比较
            @last_message = last_message
            if data.count == 1
              @setTitleUnreadCount(@unreadCount-1)
      getGods:->
        if @gods
          return
        $.ajax
          url: '/recommandGods'
          type: 'POST'
          success: (data, status, response) =>
            log data.gods
            @gods = data.gods
      scrollTo:(target, offset=0)-># 定位到这个target, offset偏移量 
        y = $(target).offset().top
        y = y+ offset
        window.scrollTo(0, y)
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

          if $(this).scrollTop() == 0 #滚动到最上面时，加载历史内容
            #if v.old_loading == false
            #  v.old_all()
            null
          else if ($('#v_messages .col-md-8').height() + $top - $(this).scrollTop() - $(this).height()) <= 0 #当滚动到最底部时，加载最新内容
            if v.new_loading == false
              v.newAll()
            #$('body').removeClass('fixed')
          ##选出当前正在看的message
          $('#v_messages .col-md-8 .box').each ->
            if $(this).offset().top+$(this).height() >= $top + $(window).scrollTop()
              if v.god_name != null #如果在god页面，不要记录消息
                return false
              #从jquery对像又取到 vue 对象
              message = $(this)[0].__vue__.message
              if v.last_message == null or v.last_message.created_at<message.created_at
                v.saveLast(message)
              return false
  routes =
    '/god/:god_name': v_messages.mainGod
    '/': v_messages.main
  router = Router(routes)
  router.init('/')
