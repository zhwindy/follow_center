require './style.less'
bz = require '../../lib.coffee'

#auto link
autoLink = (options...) ->
  pattern = ///
    (^|[\s\n]|<br\/?>) # Capture the beginning of string or line or leading whitespace
    (
      (?:https?|ftp):// # Look for a valid URL protocol (non-captured)
      [\-A-Z0-9+\u0026\u2019@#/%?=()~_|!:,.;]* # Valid URL characters (any number of times)
      [\-A-Z0-9+\u0026@#/%=~()_|] # String must end in a valid URL character
    )
  ///gi

  return @replace(pattern, "$1<a href='$2'>$2</a>") unless options.length > 0

  option = options[0]
  linkAttributes = (
    " #{k}='#{v}'" for k, v of option when k isnt 'callback'
  ).join('')

  @replace pattern, (match, space, url) ->
    link = option.callback?(url) or
      "<a href='#{url}'#{linkAttributes}>#{url}</a>"

    "#{space}#{link}"

String.prototype['autoLink'] = autoLink

module.exports =
  template: require('./template.html')
  props: [ 'message' ]
  computed:#v-attr只接收变量,为了用proxy,这里要处理
    avatar:->
      avatar = btoa(btoa(@message.avatar))
      return '/sp/'+avatar
    medias:->
      if @message.extended_entities
        return _.map(@message.extended_entities, (d)->
          img_url = '/sp/'+btoa(btoa(d.original_size.url))
          img_url = d.original_size.url
          img_height = d.original_size.height
          img_width = d.original_size.width
          caption = d.caption

          height = bz.getFitHeight(img_height, img_width)

          t =
            img_url: img_url
            height: height
            caption: caption
          return t
          )
    text:->
      return @message.text.autoLink({ target: "_blank", rel: "外部链接,请谨慎打开"})
      #return Autolinker.link(@message.text)
  directives:
    'time-len':require '../../directives/time_len'
