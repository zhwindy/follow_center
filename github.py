#!/usr/bin/env python
# -*- coding: utf-8 -*-
'''
create by bigzhu at 15/07/15 17:17:29 取github的动态
'''
import requests
import pg
import db_bz
from public_bz import storage
import public_db
import json

def check():
    '''
    create by bigzhu at 15/07/15 21:50:48
        从 user_info 取出 github url 来检查
    '''
    users = public_db.getUserInfoGithub()
    for user in users:
        if user.github and user.github != '':
            getUserEvent(user.github, user.etag)

def updateEtag(user_name, etag):
    count = pg.db.update('github_user',where="login='%s'"%user_name, etag=etag)
    if count !=1:
        raise Exception('更新etag 失败, %s' % count)

def getUserEvent(user_name, etag):
    '''
    create by bigzhu at 15/07/15 17:54:08 取github
    '''
    headers = {'If-None-Match': etag}
    r = requests.get('https://api.github.com/users/%s/events' % user_name, headers=headers)

    if r.status_code == 200:
        messages = r.json()
        actor = messages[0]['actor']
        id = saveUser(actor['id'], actor['url'])
        #更新etag
        etag = r.headers['etag']
        updateEtag(user_name, etag)

        for i in r.json():
            i['actor'] = id
            message = storage(i)
            id = saveMessage(message)
            if id is not None:
                print 'new',message.type,message.repo


def saveMessage(message):
    message.id_str = message.pop('id')
    message.repo = json.dumps(message.repo)
    message.payload = json.dumps(message.payload)
    if message.get('org'):
        message.org = json.dumps(message.org)

    for k,v in message.items():
        print k,'=',v

    return db_bz.insertIfNotExist(pg, 'github_message', message, "id_str='%s'" % message.id_str)


def saveUser(id, url):
    '''
    create by bigzhu at 15/07/15 21:27:19 保存github信息
    '''
    if list(pg.db.select('github_user', where='id=%s' % id)):
        return
    else:
        r = requests.get(url)
        user = storage(r.json())
        del user.url
        del user.followers_url
        del user.following_url
        del user.gists_url
        del user.starred_url
        del user.subscriptions_url
        del user.organizations_url
        del user.repos_url
        del user.events_url
        del user.received_events_url
        del user.type
        return db_bz.insertIfNotExist(pg, 'github_user', user)


if __name__ == '__main__':
    getUserEvent('navy3', '')
