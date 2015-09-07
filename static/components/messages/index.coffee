require './style.less'
module.exports =
  data:->
    new_loading:false
    old_loading:false
    messages:[]
  ready:->
    @new()
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
    bindScroll:->
      v = @
      $(window).scroll ->
        #$top = $('#v_messages').offset().top
        $top = $(@$el).offset().top
        if $(this).scrollTop() == 0 #滚动到最上面时，加载历史内容
          #if v.old_loading == false
          #  v.old_all()
          null
        #else if ($('#v_messages .col-md-8').height() + $top - $(this).scrollTop() - $(this).height()) <= 0 #当滚动到最底部时，加载最新内容
        else if ($(@$el).height() + $top - $(this).scrollTop() - $(this).height()) <= 0 #当滚动到最底部时，加载最新内容
          if v.new_loading == false
            v.new()
          #$('body').removeClass('fixed')
        ##选出当前正在看的message
        #$('#v_messages .col-md-8 .box').each ->
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

