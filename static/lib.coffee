module.exports =
  calculateHeight: (img_height, img_width, max_width)->
    if max_width<=img_width
      real_height = max_width*img_height/img_width
    else
      real_height = img_height
    return real_height
  getFitHeight: (img_height, img_width)->
    max_width = $(window).width()-50
    if max_width <= 768 #小屏幕，应该这时占满整个屏幕了
      real_height = calculateHeight(img_height, img_width, max_width)
    else #取真正能显示图片的大小
      max_width = $('#v_messages > .col-md-8').width()-50
      real_height = calculateHeight(img_height, img_width, max_width)
    return real_height
