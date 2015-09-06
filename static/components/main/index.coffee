require './style.less'
module.exports =
  template: require('./template.html')
  components:
    'messages': require('../messages'),
    'user_info': require('../user_info'),
    'god_list': require('../god_list'),
    'add_god': require('../add_god'),
  data:->
    user_info:''

