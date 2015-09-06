require './app.less'
Vue = require './vue_local.coffee'

App = Vue.extend({})

VueRouter = require 'vue-router'
router = new VueRouter()

router.map
  '/': component: require('./components/main')
  '/god/:god_name': component: require('./components/the_god')

router.start(App, '#app')

#app = new Vue
#  el:'#app'
#  components:
#    'main': require('./components/main'),
