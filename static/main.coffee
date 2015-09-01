require './main.less'
Vue = require('vue')
app = new Vue(
  el: '#app'
  data: view: 'page-a'
  components:
    'page-a': (resolve) ->
      require [ './views/a' ], resolve
      return
    'page-b': (resolve) ->
      require [ './views/b' ], resolve
      return
)
