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
import twitter
# 登录模块
from ui_module import login_m
import public_db
import json
import db_bz
from proxy import ProxyHandler

OK = '0'


class login(login_m.login):

    '''登录页面'''

    def initialize(self):
        login_m.login.initialize(self)
        # self.oauth2.douban.enabled = True
        self.oauth2.google.enabled = True
        self.oauth2.twitter.enabled = True


class main(tornado_bz.UserInfoHandler):

    '''
    首页
    create by bigzhu at 15/07/11 16:21:16
    '''

    def get(self):
        twitter_messages = public_db.getTwitterMessages()
        self.render(tornado_bz.getTName(self), twitter_messages=twitter_messages)


class add(tornado_bz.UserInfoHandler):

    '''
    create by bigzhu at 15/07/11 22:07:36 添加要跟踪的人
    '''
    @tornado_bz.mustLogin
    def get(self, user_name='-1'):
        user_info = public_db.getUserInfoByName(user_name)
        self.render(self.template, user_info=user_info)

    @tornado_bz.mustLoginApi
    @tornado_bz.handleError
    def post(self):
        self.set_header("Content-Type", "application/json")
        data = json.loads(self.request.body)

        id = db_bz.insertIfNotExist(pg, 'user_info', data, "user_name='%s'" % data['user_name'])
        if id is None:
            self.pg.db.update("user_info", where="user_name='%s'" % data['user_name'], **data)
        self.write(json.dumps({'error': '0'}))


class user(add):

    '''
    create by bigzhu at 15/07/11 23:43:16 显示这个用户的信息
    '''

    #@tornado_bz.mustLogin
    def get(self, user_name='-1'):
        user_info = public_db.getUserInfoByName(user_name)
        twitter_messages = public_db.getTwitterMessagesByName(user_name)
        self.render(self.template, user_info=user_info, twitter_messages=twitter_messages)


class users(tornado_bz.UserInfoHandler):

    '''
    create by bigzhu at 15/07/12 23:43:54 显示所有的大神, 关联twitter
    '''

    def get(self):
        users = public_db.getUserInfoTwitterUser()
        self.render(self.template, users=users)


if __name__ == "__main__":

    the_class = tornado_bz.getAllUIModuleRequestHandlers()
    the_class.update(globals().copy())

    if len(sys.argv) == 2:
        port = int(sys.argv[1])
    else:
        port = 8888
    print port

    url_map = tornado_bz.getURLMap(the_class)
    url_map.append((r'/', main))
    url_map.append((r'/static/(.*)', tornado.web.StaticFileHandler, {'path': "./static"}))

    settings = tornado_bz.getSettings()

    settings["pg"] = pg

    application = tornado.web.Application(url_map, **settings)

    application.listen(port)
    ioloop = tornado.ioloop.IOLoop().instance()

    tornado.ioloop.PeriodicCallback(twitter.check, 60 * 1000).start()

    tornado.autoreload.start(ioloop)
    ioloop.start()
