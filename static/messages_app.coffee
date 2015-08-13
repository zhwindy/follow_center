$ ->
  v_messages = new Vue
    el:'#v_messages'
    data:
      messages:null
      loading:false
      current_message_id:null
      god_name:null
    ready:->
      @bindScroll()
      #@all()
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
      bindScroll:->
        v = @
        $(window).scroll ->
          #当滚动到最底部以上100像素时， 加载新内容
          if ($(document).height() - $(this).scrollTop() - $(this).height()) == 0
            v.more()
          #选出当前正在看的message
          $top = $('#v_messages').offset().top
          $('#v_messages .box').each ->
            if $(this).offset().top >= $top + $(window).scrollTop()
              #从jquery对像又取到 vue 对象
              log $(this)[0].__vue__
              return false
  routes =
    '/god/:god_name': v_messages.showTheGod
    '/': v_messages.all
  router = Router(routes)
  router.init('/')
