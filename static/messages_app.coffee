$ ->
  v_user = new Vue
    el:'#v_messages'
    data:
      messages:false
      loading:true
    ready:->
      parm = JSON.stringify
        bigzhu:1
      $.ajax
        url: '/messages_app'
        type: 'POST'
        data : parm
        success: (data, status, response) =>
          @loading=false
          @messages = data.messages
    methods:
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
