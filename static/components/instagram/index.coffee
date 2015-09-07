require './style.less'
bz = require '../../lib.coffee'
module.exports =
  template: require('./template.html')
  props: [ 'message' ]
  computed:
    #v-attr只接收变量,为了用proxy,这里要处理
    avatar:->
      avatar = btoa(btoa(@message.avatar))
      return '/sp/'+avatar
    img_url:->
      img_url = btoa(btoa(@message.extended_entities.url))
      return '/sp/'+img_url
    height:->
      #max_width = $(@$el).width() #没有办法取到，因为还没有渲染出来
      img_height = @message.extended_entities.height
      img_width = @message.extended_entities.width
      real_height = bz.getFitHeight(img_height, img_width)
      return real_height
  directives:
    'time-len':require '../../directives/time_len'
