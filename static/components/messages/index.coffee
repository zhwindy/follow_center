require './style.less'
module.exports =
  created:->
    console.log @
  template: require('./template.html')
  props: [ 'messages' ]
  components:
    'twitter': require('../twitter'),
    'github': require('../github'),
    'instagram': require('../instagram'),
    'tumblr': require('../tumblr'),
  directives:
    'btn-loading': require('../../directives/btn_loading'),
  methods:
    new:->
      if @new_loading
        return
      if @god_name
        @newGod()
      else
        @newAll()
    old:->
      if @old_loading
        return
      if @god_name
        @oldGod()
      else
        @oldAll()

