require './style.less'
bz = require '../../lib.coffee'
module.exports =
  template: require('./template.html')
  data:->
    btn_loading:false
    slogan:''
    user_name:''
  ready:->
    bz.setOnErrorVm(@)
  methods:
    pop:-> #打开时候初始化，避免存留上一次的内容
      @user_name = ''
      @slogan = ''
    addGod:->
      if @btn_loading
        return
      else
        @btn_loading = true
        parm = JSON.stringify
          user_name:@user_name
          slogan:@slogan
          twitter:@user_name
          github:@user_name
          instagram:@user_name
        $.ajax
          url: '/add'
          type: 'POST'
          data : parm
          success: (data, status, response) =>
            @btn_loading=false
            if data.error != '0'
              throw new Error(data.error)
            else
              bz.showSuccess5("保存成功")
              $('#god_input').modal('hide')
