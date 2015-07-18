#!/usr/bin/env python
# -*- coding: utf-8 -*-
import ConfigParser
import public_bz
import wechat_bz
import public_db
import pg
config = ConfigParser.ConfigParser()


def getQrUrl(wechat, user_name):
    '''
    create by bigzhu at 15/07/19 00:43:47 生成带用户名的二维码
    '''
    parm = {"action_name": "QR_LIMIT_STR_SCENE", "action_info": {"scene": {"scene_str": user_name}}}

    ticket = wechat.create_qrcode(parm)['ticket']
    url = "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=" + ticket
    return url


def initSetting(settings):
    with open('wechat.ini', 'r') as cfg_file:
        config.readfp(cfg_file)
        settings["domain"] = config.get('app', 'domain')
        settings["appid"] = config.get('app', 'appid')
        settings["appsecret"] = config.get('app', 'appsecret')
        settings["token"] = config.get('app', 'token')

    settings["noncestr"] = public_bz.getProjectName()
    settings["subscribe"] = '/intro'
    settings["suburl"] = 'bird'  # 用来做用户回调的关键字,需要实现同名的set open_id 方法

    settings, wechat = wechat_bz.initWechat(settings)
    return settings, wechat


def saveUserInfo(wechat, openid):
    '''
    create by bigzhu at 15/07/19 01:47:09 顺便绑定用户
    '''
    # 检查用户是否存储了,没有的话存之
    wechat_user_info = public_db.getWechatUserByOpenid(openid)
    if wechat_user_info:
        pass
    else:
        wechat_user_info = wechat.get_user_info(openid)
        pg.db.insert('wechat_user', **wechat_user_info)


def bindUser(user_name, openid):
    count = pg.db.update('wechat_user', where="openid='%s'" % openid, user_name=user_name)
    if count != 1:
        raise Exception('绑定失败: count=%s, openid=%s' % (count, openid))

if __name__ == '__main__':
    settings, wechat = initSetting({})
    getQrUrl(wechat, 'bigzhu')
