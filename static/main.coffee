require './main.less'

Vue = require './vue_local.coffee'
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
    unreadCount:0
  created:->
    @bindScroll()
  methods:
    new:->
      if @new_loading
        return
      if @god_name
        @newGod()
    old:->
      if @old_loading
        return
      if @god_name
        @oldGod()
    main:-> # 首页
      @god_name = null
      @user_info = ''
    mainGod:(god_name)->
      @god_name = god_name
      @messages=[]
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
    getUnreadCount:(message)->
      index = _.findIndex(@messages, (d)=>
               return d.row_num == message.row_num
             )
      return @messages.length-index-1
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
            count = @getUnreadCount(last_message)
            @setTitleUnreadCount(count)
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
            v.new()
          #$('body').removeClass('fixed')
        ##选出当前正在看的message
        $('#v_messages .col-md-8 .box').each ->
          #拉到上方再标记已读
          #if $(this).offset().top+$(this).height() >= $top + $(window).scrollTop()

          message_position = $(this).offset().top+$(this).height() #message所在高度
          scroll_bottom = $(window).scrollTop() + $(window).height() #scroll bottom 露出来的高度

          #降低一位精度，以保证==能触发出发
          message_position = parseInt(message_position/10)
          scroll_bottom = parseInt(scroll_bottom/10)
          if message_position == scroll_bottom
            if v.god_name != null #如果在god页面，不要记录消息
              return false
            #从jquery对像又取到 vue 对象
            message = $(this)[0].__vue__.message
            if v.last_message == null or v.last_message.created_at<message.created_at
              v.saveLast(message)
            return false
  components:
    'user_info': require('./components/user_info'),
    'god_list': require('./components/god_list'),
    'add_god': require('./components/add_god'),
    'messages': require('./components/messages'),

routes =
  '/god/:god_name': v_messages.mainGod
  #'/': v_messages.main
router = Router(routes)
router.init('/')
