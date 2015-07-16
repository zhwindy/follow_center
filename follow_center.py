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
import oper
import github

OK = '0'


class ProxyHandler(ProxyHandler):
    pass


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

    #@tornado_bz.mustLogin

    def get(self):
        messages = list(public_db.getMessages(self.current_user))
        self.render(tornado_bz.getTName(self), messages=messages)


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
    '''

    #@tornado_bz.mustLogin

    def get(self):
        users = public_db.getUserInfoTwitterUser(self.current_user)
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

if __name__ == "__main__":

    the_class = tornado_bz.getAllUIModuleRequestHandlers()
    the_class.update(globals().copy())

    if len(sys.argv) == 2:
        port = int(sys.argv[1])
    else:
        port = 9000
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
    tornado.ioloop.PeriodicCallback(github.check, 60 * 1000).start()

    tornado.autoreload.start(ioloop)
    ioloop.start()
