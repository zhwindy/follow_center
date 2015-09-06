require './style.less'
module.exports =
  data:->
    user_info:''
  ready:->
    @getUserInfo(@$route.params.god_name)
  template: require('./template.html')
  components:
    'god_messages': require('../god_messages'),
    'user_info': require('../user_info'),
    'add_god': require('../add_god'),
  methods:
    getUserInfo:(user_name)->
      parm = JSON.stringify
        user_name:user_name
      $.ajax
        url: '/user_info'
        type: 'POST'
        data : parm
        success: (data, status, response) =>
          @user_info = data.user_info
          console.log @user_info

