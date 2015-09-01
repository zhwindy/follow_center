require './style.less'
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
      img_height = @message.extended_entities.height
      img_width = @message.extended_entities.width
      return getFitHeight(img_height, img_width)
