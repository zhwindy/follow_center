$ ->
  v_user = new Vue
    el:'#v_messages'
    data:
      messages:[]
    ready:->
      $.ajax
        url: '/messages_app'
        type: 'POST'
        #data : parm
        success: (data, status, response) =>
          @loading=false
          @messages = data.messages
          log @messages
