$ ->
  v_messages = new Vue
    el:'#v_messages'
    data:
      messages:null
      loading:false
      message_id:null
      god_name:null
    ready:->
      @bindScroll()
      @all()
    methods:
      all:->
        @god_name = null
        @loading=true
        parm = JSON.stringify
          limit:30
        $.ajax
          url: '/messages_app'
          type: 'POST'
          data : parm
          success: (data, status, response) =>
            @messages = data.messages
            @loading=false
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
        @loading=true
        parm = JSON.stringify
          god_name:god_name
        $.ajax
          url: '/messages_app'
          type: 'POST'
          data : parm
          success: (data, status, response) =>
            log data.messages
            @messages = data.messages
            @loading=false
      bindScroll:->
        v = @
        $(window).scroll ->
          #当滚动到最底部以上100像素时， 加载新内容
          if ($(document).height() - $(this).scrollTop() - $(this).height()) == 0
            v.more()
          $top = $('#v_messages').offset().top
          $('#v_messages .box').each ->
            if $(this).offset().top >= $top + $(window).scrollTop()
              #log $(this).attr('id')
              return false
  routes =
    '/god/:god_name': v_messages.showTheGod
    #'/': v_messages.all
  router = Router(routes)
  router.init()


