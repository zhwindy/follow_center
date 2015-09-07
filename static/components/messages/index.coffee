require './style.less'
module.exports =
  data:->
    new_loading:false
    old_loading:false
    error_info:''
    messages:[]
    last_message:null
  ready:->
    @new()
    @bindScroll()
  template: require('./template.html')
  #props: [ 'messages' ]
  components:
    'twitter': require('../twitter'),
    'github': require('../github'),
    'instagram': require('../instagram'),
    'tumblr': require('../tumblr'),
  directives:
    'btn-loading': require('../../directives/btn_loading'),
  methods:
    new:->
      if @new_loading
        return
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
              @old()
          @new_loading=false
    old:->
      if @old_loading
        return
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
    getLastMessageEl:->
      if @$.c_messages.length != 0
        el = @$.c_messages[0].$el
      else
        el = null
      return el
    scrollTo:(target, offset=0)-># 定位到这个target, offset偏移量 
      y = $(target).offset().top
      y = y+ offset
      window.scrollTo(0, y)
    setTitleUnreadCount:(count)->#设置未读的条目数
      @unreadCount = count
      if count == 0
        document.title = "Follow Center"
      else
        document.title = "(#{count}) Follow Center"
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
    bindScroll:->
      v = @
      messages_element = $(v.$el.parentElement)
      top = messages_element.offset().top
      $(window).scroll ->
        if $(@).scrollTop() == 0 #滚动到最上面时，加载历史内容
          #console.log 'top'
          #if v.old_loading == false
          #  v.old_all()
          null
        else if (messages_element.height() + top - $(this).scrollTop() - $(this).height()) <= 0 #当滚动到最底部时，加载最新内容
          if v.new_loading == false
            #console.log 'buttom'
            v.new()
          #$('body').removeClass('fixed')
        ##选出当前正在看的message
        #$('#v_messages .col-md-8 .box').each ->
        messages_element.children('.box').each ->
          #拉到上方再标记已读
          #if $(this).offset().top+$(this).height() >= top + $(window).scrollTop()

          message_position = $(this).offset().top+$(this).height() #message所在高度
          scroll_bottom = $(window).scrollTop() + $(window).height() #scroll bottom 露出来的高度

          #降低一位精度，以保证==能触发出发
          message_position = parseInt(message_position/10)
          scroll_bottom = parseInt(scroll_bottom/10)
          if message_position == scroll_bottom
            #从jquery对像又取到 vue 对象
            message = $(this)[0].__vue__.message
            if v.last_message == null or v.last_message.created_at<message.created_at
              console.log 'saveLast:' + message.id
              v.saveLast(message)
            return false

