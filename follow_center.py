#!/usr/bin/env python
# -*- coding: utf-8 -*-
# sys.setdefaultencoding() does not exist, here!
import sys
reload(sys)
sys.setdefaultencoding('utf-8')
import tornado
import tornado.ioloop
import tornado.web
import pg
import tornado_bz
# 登录模块
from ui_module import login_m
import public_db
import json
import db_bz
from proxy import ProxyHandler
import oper
import wechat_oper
import ConfigParser
config = ConfigParser.ConfigParser()
try:
    from wechat_sdk.messages import (
        TextMessage, VoiceMessage, ImageMessage, VideoMessage, LinkMessage, LocationMessage, EventMessage
    )
except ImportError:
    print 'you need install wechat, please run:'
    print 'sudo pip install wechat-sdk'
    exit(1)


OK = '0'


class WechatBaseHandler(tornado_bz.BaseHandler):

    '''
    create by bigzhu at 15/07/18 20:11:14 copy from wechat_bird
    '''

    def initialize(self):
        super(WechatBaseHandler, self).initialize()
        self.wechat = wechat_oper.getWechat()


class ProxyHandler(ProxyHandler):
    pass


class login(login_m.login):

    '''登录页面'''

    def initialize(self):
        login_m.login.initialize(self)
        # self.oauth2.douban.enabled = True
        #self.oauth2.google.enabled = True
        #self.oauth2.twitter.enabled = True


class main(tornado_bz.UserInfoHandler):

    '''
    首页
    create by bigzhu at 15/07/11 16:21:16
    '''

    #@tornado_bz.mustLogin

    def get(self, limit=50):
        if limit == '':
            limit = 50
        messages = list(public_db.getMessages(self.current_user, limit=limit))
        anchor_message = messages[-2]
        anchor = '%s_%s' %(anchor_message.m_type, anchor_message.id)
        self.render(tornado_bz.getTName(self), messages=messages, more=int(limit)+50, anchor=anchor)


class Changelog(tornado_bz.UserInfoHandler):

    '''
    create by bigzhu at 15/07/19 22:15:13
    '''

    def get(self):
        self.render(tornado_bz.getTName(self))


class message(tornado_bz.UserInfoHandler):

    '''
    某条信息
    create by bigzhu at 15/07/19 15:27:45
    '''

    def get(self):
        type = self.get_argument('t', None, True)
        id = self.get_argument('id', None, True)
        messages = public_db.getMessages(type=type, id=id)
        self.render(tornado_bz.getTName(self, "main"), messages=messages)


class add(tornado_bz.UserInfoHandler):

    '''
    create by bigzhu at 15/07/11 22:07:36 添加要跟踪的人
    '''
    @tornado_bz.mustLogin
    def get(self, user_name='-1'):
        user_info = public_db.getUserInfoByName(user_name)
        self.render(self.template, user_info=user_info)

    @tornado_bz.handleError
    @tornado_bz.mustLoginApi
    def post(self):

        self.set_header("Content-Type", "application/json")
        data = json.loads(self.request.body)

        id = db_bz.insertIfNotExist(pg, 'user_info', data, "user_name='%s'" % data['user_name'])
        if id is None:
            where = "user_name='%s'" % data['user_name']
            self.pg.db.update("user_info", where=where, **data)
            id = self.pg.db.select('user_info', where=where)[0].id

        oper.follow(self.current_user, id, make_sure=False)

        self.write(json.dumps({'error': '0'}))


class user(add):

    '''
    create by bigzhu at 15/07/11 23:43:16 显示这个用户的信息
    '''

    @tornado_bz.mustLogin
    def get(self, user_name='-1'):
        user_info = public_db.getUserInfoByName(user_name)
        messages = public_db.getMessages(god_name=user_name)
        self.render(self.template, user_info=user_info, messages=messages)


class users(tornado_bz.UserInfoHandler):

    '''
    create by bigzhu at 15/07/12 23:43:54 显示所有的大神, 关联twitter
    modify by bigzhu at 15/07/17 15:20:26 关联其他的,包括 github
    '''

    #@tornado_bz.mustLogin

    def get(self):
        #users = public_db.getUserInfoTwitterUser(self.current_user)
        users = list(public_db.getGodInfoFollow(self.current_user))
        will_del = []
        for user in users:
            user.twitter_user = public_db.getTwitterUser(user.twitter)
            user.github_user = public_db.getGithubUser(user.github)
            if user.twitter_user is None and user.github_user is None:
                will_del.append(user)
        for user in will_del:
            users.remove(user)

        self.render(self.template, users=users)


class follow(tornado_bz.UserInfoHandler):

    '''
    create by bigzhu at 15/07/14 17:11:45 follow
    '''
    @tornado_bz.handleError
    @tornado_bz.mustLoginApi
    def post(self):
        self.set_header("Content-Type", "application/json")
        data = json.loads(self.request.body)
        oper.follow(self.current_user, data['god_id'])
        self.write(json.dumps({'error': '0'}))


class unfollow(tornado_bz.UserInfoHandler):

    '''
    create by bigzhu at 15/07/14 17:11:45 follow
    '''
    @tornado_bz.mustLoginApi
    @tornado_bz.handleError
    def post(self):
        self.set_header("Content-Type", "application/json")
        data = json.loads(self.request.body)
        count = pg.db.delete('follow_who', where="user_id=%s and god_id=%s" % (self.current_user, data['god_id']))
        if count == 0:
            raise Exception('没有正确的Unfollow, Unfollow %s 人' % count)
        self.write(json.dumps({'error': '0'}))


class callback(WechatBaseHandler):

    '''
    create by bigzhu at 15/04/02 16:34:53 微信的回调接口
    '''

    def get(self):
        self.write(self.get_argument('echostr'))

    def post(self):
        self.set_header("Content-Type", "application/json")

        '''
        #to 7+1
        print self.request.body
        result = wechat_bz.callPlatform(self, url='http://admin.hoywe.com/api.php?hash=GO5KZ')
        print result
        self.write(result)
        return
        '''

        wechat = self.wechat

        wechat.parse_data(self.request.body)
        message = wechat.get_message()

        response = None
        if isinstance(message, TextMessage):
            #wechat.send_text_message(message.source, 'test')
            response = wechat.response_text(content=u'文字信息')

        elif isinstance(message, VoiceMessage):
            response = wechat.response_text(content=u'语音信息')
        elif isinstance(message, ImageMessage):

            # 需要下载图片
            def downloadImageFile():
                http_client = tornado.httpclient.AsyncHTTPClient()
                http_client.fetch(message.picurl, callback=done)

            def done(response):
                with open("static/upload/images/" + message.media_id + '.jpg', "w") as f:
                    f.write(response.body)
                print "DONE"
            downloadImageFile()
            # 检查用户是否存储了,没有的话存之
            wechat_user_info = public_db.getWechatUserByOpenid(message.source)
            if wechat_user_info:
                pass
            else:
                wechat_user_info = wechat.get_user_info(message.source)
                pg.db.insert('wechat_user', **wechat_user_info)
            pg.db.insert('upload_info', openid=message.source, media_id=message.media_id)

            response = wechat.response_text(content=u'图片已经保存,请继续向我们发送对图片的描述')
        elif isinstance(message, VideoMessage):
            response = wechat.response_text(content=u'视频信息')
        elif isinstance(message, LinkMessage):
            wechat_user_info = wechat.get_user_info(message.source)
            print wechat_user_info
            response = wechat.response_text(content=u'链接信息')
        elif isinstance(message, LocationMessage):
            response = wechat.response_text(content=u'地理位置信息')
        elif isinstance(message, EventMessage):  # 事件信息

            if message.type == 'subscribe':  # 关注事件(包括普通关注事件和扫描二维码造成的关注事件)
                if message.key and message.ticket:  # 如果 key 和 ticket 均不为空，则是扫描二维码造成的关注事件
                    user_name = message.key.replace('qrscene_', '')
                    wechat_oper.saveUserInfo(wechat, message.source)
                    wechat_oper.bindUser(user_name, message.source)
                    #response = wechat.response_text(content=u'用户尚未关注时的二维码扫描关注事件')
                    response = wechat.response_text(content=u'感谢你关注FollowCenter, %s follow 的动态信息将会发送到您的微信上' % user_name)
                else:
                    response = wechat.response_text(content=u'普通关注事件')
            elif message.type == 'unsubscribe':
                response = wechat.response_text(content=u'取消关注事件')
            elif message.type == 'scan':
                user_name = message.key
                wechat_oper.saveUserInfo(wechat, message.source)
                wechat_oper.bindUser(user_name, message.source)
                #response = wechat.response_text(content=u'用户已关注时的二维码扫描事件')
                response = wechat.response_text(content=u'成功与%s绑定, 其follow 的动态信息将会发送到您的微信上' % user_name)

                print message.key
            elif message.type == 'location':
                response = wechat.response_text(content=u'上报地理位置事件')
            elif message.type == 'click':
                response = wechat.response_text(content=u'自定义菜单点击事件')
            elif message.type == 'view':
                response = wechat.response_text(content=u'自定义菜单跳转链接事件')

        self.write(response)


class qr(WechatBaseHandler, tornado_bz.UserInfoHandler):

    @tornado_bz.mustLogin
    def get(self):
        url = wechat_oper.getQrUrl(self.wechat, self.get_user_info().user_name)
        self.render(tornado_bz.getTName(self), url=url)


if __name__ == "__main__":

    the_class = tornado_bz.getAllUIModuleRequestHandlers()
    the_class.update(globals().copy())

    if len(sys.argv) == 2:
        port = int(sys.argv[1])
    else:
        port = 9000
    print port

    url_map = tornado_bz.getURLMap(the_class)
    url_map.append((r'/(.*)', main))
    url_map.append((r'/static/(.*)', tornado.web.StaticFileHandler, {'path': "./static"}))

    settings = tornado_bz.getSettings()

    settings["pg"] = pg
    #settings, wechat = wechat_oper.initSetting(settings)
    application = tornado.web.Application(url_map, **settings)

    application.listen(port)
    ioloop = tornado.ioloop.IOLoop().instance()

    #tornado.ioloop.PeriodicCallback(twitter.check, 60 * 1000).start()
    #tornado.ioloop.PeriodicCallback(github.check, 60 * 1000).start()

    tornado.autoreload.start(ioloop)
    ioloop.start()
