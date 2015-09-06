Vue = require './vue_local.coffee'
app = new Vue
  el:'#app'
  components:
    'main': require('./components/main'),
