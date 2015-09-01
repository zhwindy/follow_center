require './style.less'
module.exports =
  template: require('./template.html')
  data:->
    gods:[]
  ready:->
    @getGods()
  methods:
    getGods:->
      $.ajax
        url: '/recommandGods'
        type: 'POST'
        success: (data, status, response) =>
          @gods = data.gods
  components:
    'god': require('../god'),

