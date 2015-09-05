require './style.less'
module.exports =
  bind: ->
  update: (new_value, old_value) ->
    @el.disabled = new_value
  unbind: ->
