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
