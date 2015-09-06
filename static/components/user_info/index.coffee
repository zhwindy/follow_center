require './style.less'

bz = require '../../lib.coffee'
module.exports =
  template: require('./template.html')
  props: [ 'user_info' ]
  computed:
    avatar:->
      if @user_info.picture
        return @user_info.picture
      else
        return '/lib_static/images/avatar.svg'
  ready:->
    bz.setOnErrorVm(@)
  data:->
    loading: false
    disable_edit: true # 禁止编辑
    button_text:'修改资料'
  methods:
    autoInsert:(key, scheme='http://')-> # 协议可以配置
      if not @user_info[key]
        @user_info.$set(key, scheme)
    changeImg:->
      $('#profile-image-upload').click()
    previewImg:(e)->
      file = e.target.files[0]
      if not file
        return
      if file.size > (10 * 1024 * 1024)
        throw new Error("图片大小只能小于10m哦~")
      reader = new FileReader()
      reader.onload = (e)->
        $("#profile-image-upload").attr("src", e.target.result)
      reader.readAsDataURL(file)
      @uploadImage()
    uploadImage:->
      fd = new FormData()
      file = $("#profile-image-upload")[0].files[0]
      if file
        fd.append("img", file)
        $.ajax
          url: '/upload_image'
          type: 'POST'
          data : fd
          processData: false
          contentType: false
          success: (data, status, response) =>
            #为了兼容 simditor 这里的返回值不太一样
            @loading=false
            if not data.success
              throw new Error(data.msg)
            else
              bz.showSuccess5("保存成功")
              @user_info.picture = data.file_path
              $("#profile-image").attr("src", @user_info.picture)
          error: (error_info)->
            @loading=false
            throw new Error(error_info)
    save:->
      if @disable_edit
        @disable_edit = false
        $("#btn-edit").text('保存')
      else
        @loading = true
        parm = JSON.stringify
          user_name:@user_info.user_name
          blog:@user_info.blog
          twitter:@user_info.twitter
          github:@user_info.github
          instagram:@user_info.instagram
          slogan:@user_info.slogan
          picture:@user_info.picture
        #如果url path不同,则向对应后台url发请求,以应对重载又要留着原本profile的情况(follow_center)
        path = bz.getUrlPath(1)
        $.ajax
          url: '/add'
          type: 'POST'
          data : parm
          success: (data, status, response) =>
            @loading=false
            @disable_edit=true
            $("#btn-edit").text('编辑')
            if data.error != '0'
              throw new Error(data.error)
            else
              bz.showSuccess5("保存成功")
  directives:
    disable: require('../../directives/disable')
    'btn-loading': require('../../directives/btn_loading')
  components:
    'follow':require('../follow')
