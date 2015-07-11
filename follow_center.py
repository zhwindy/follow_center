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
from ui_module import profile_m
import public_db

OK = '0'


class login(login_m.login):

    '''登录页面'''

    def initialize(self):
        login_m.login.initialize(self)
        # self.oauth2.douban.enabled = True
        self.oauth2.google.enabled = True
        self.oauth2.twitter.enabled = True


class main(tornado_bz.BaseHandler):

    '''
    首页
    create by bigzhu at 15/07/11 16:21:16
    '''

    def get(self):
        twitter_messages = public_db.getTwitterMessages()
        self.render(tornado_bz.getTName(self), twitter_messages=twitter_messages)


if __name__ == "__main__":

    the_class = tornado_bz.getAllUIModuleRequestHandlers()
    the_class.update(globals().copy())

    if len(sys.argv) == 2:
        port = int(sys.argv[1])
    else:
        port = 8888
    print port

    url_map = tornado_bz.getURLMap(the_class)
    url_map.append((r'/', profile_m.profile))
    url_map.append((r'/static/(.*)', tornado.web.StaticFileHandler, {'path': "./static"}))

    settings = tornado_bz.getSettings()

    settings["pg"] = pg

    application = tornado.web.Application(url_map, **settings)

    application.listen(port)
    ioloop = tornado.ioloop.IOLoop().instance()

    tornado.ioloop.PeriodicCallback(twitter.check, 60 * 1000).start()

    tornado.autoreload.start(ioloop)
    ioloop.start()
