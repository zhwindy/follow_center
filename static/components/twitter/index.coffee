require './style.less'
lib = require '../../lib.coffee'

Autolinker = require 'autolinker'
module.exports =
  template: require('./template.html')
  props: [ 'message' ]
  computed:#v-attr只接收变量,为了用proxy,这里要处理
    avatar:->
      avatar = btoa(btoa(@message.avatar))
      return '/sp/'+avatar
    medias:->
      if @message.extended_entities
        return _.map(@message.extended_entities.media, (d)->
          img_url = '/sp/'+btoa(btoa(d.media_url_https))
          img_height = d.sizes.large.h
          img_width = d.sizes.large.w

          height = lib.getFitHeight(img_height, img_width)

          t =
            img_url: img_url
            height: height
          return t
          )
    text:->
      #return @message.text.autoLink({ target: "_blank", rel: "外部链接,请谨慎打开"})
      return Autolinker.link(@message.text)
