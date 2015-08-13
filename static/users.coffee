$ ->
  v_users = new Vue
    created:->
      bz.setOnErrorVm(@)
    el:'#v_users'
