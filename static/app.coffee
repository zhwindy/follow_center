require './app.less'
Vue = require './vue_local.coffee'

App = Vue.extend({})

VueRouter = require 'vue-router'
router = new VueRouter()

router.map
  '/': component: require('./components/main')
  '/god': component: require('./components/main')

router.start(App, '#app')

#app = new Vue
#  el:'#app'
#  components:
#    'main': require('./components/main'),
