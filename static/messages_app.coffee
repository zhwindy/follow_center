$ ->
  v_messages = new Vue
    el:'#v_messages'
    data:
      messages:null
      loading:false
    ready:->
    methods:
      all:->
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
        $.ajax
          url: '/messages_app'
          type: 'POST'
          data : parm
          success: (data, status, response) =>
            for message in data.messages
              @messages.push(message)
            @loading=false
      showTheGod:(god_name)->
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
  routes =
    '/god/:god_name': v_messages.showTheGod
    '/': v_messages.all
  router = Router(routes)
  router.init('/')
