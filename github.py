#!/usr/bin/env python
# -*- coding: utf-8 -*-
'''
create by bigzhu at 15/07/15 17:17:29 取github的动态
'''
import requests
import pg
from datetime import timedelta
import copy
import db_bz
import wechat_oper
from public_bz import storage
import public_db
import json
import time_bz
import time
import public_bz


def check(user_name=None):
    '''
    create by bigzhu at 15/07/15 21:50:48
        从 user_info 取出 github url 来检查
    '''
    users = public_db.getUserInfoGithub(user_name)
    for user in users:
        if user.github and user.github != '':
            print 'check github %s' % user.github
            getUserEvent(user.github, user.etag)


def updateEtag(user_name, etag):
    count = pg.update('github_user', where="lower(login)=lower('%s')" % user_name, etag=etag)
    if count != 1:
        raise Exception('更新etag 失败, %s, user_name=%s' % (count, user_name))


def delGithubUser(user_name):
    sql = '''
    update user_info set github=null where lower(github)=lower('%s')
    ''' % user_name
    pg.query(sql)


def getUserEvent(user_name, etag):
    '''
    create by bigzhu at 15/07/15 17:54:08 取github
    modify by bigzhu at 15/07/22 16:20:42 时间同样要加入8小时,否则不正确
    '''
    headers = {'If-None-Match': etag}
    try:
        r = requests.get('https://api.github.com/users/%s/events' % user_name, headers=headers)
    except requests.exceptions.ConnectionError:
        print public_bz.getExpInfoAll()
        return
    if r.status_code == 200:
        messages = r.json()
        if not messages:
            delGithubUser(user_name)
            # 没有这个github用户,取消
            return
        actor = messages[0]['actor']
        #actor不定是作者名字，有可能org才是
        if actor['login'].lower() == user_name.lower():
            the_user = actor
        else:
            org = messages[0]['org']
            if org['login'].lower() == user_name.lower():
                the_user = org
                #如果是org，那么url不同
                the_user['url'] = "https://api.github.com/users/"+user_name
            else:
                raise("in this github can't find user_name=%s" % user_name)

        user_id = saveUser(the_user['id'], the_user['url'])

        # 更新etag
        etag = r.headers['etag']
        updateEtag(user_name, etag)

        for i in r.json():
            i['actor'] = user_id
            message = storage(i)
            message.created_at = time_bz.unicodeToDateTIme(message.created_at)
            message.created_at += timedelta(hours=8)
            id = saveMessage(copy.deepcopy(message))
            if id is not None:
                text = formatInfo(message)
                print text
                openids = public_db.getOpenidsByName('github', user_name)
                for data in openids:
                    wechat_oper.sendGithub(data.openid, text, user_name, id)
    if r.status_code == 404:
        delGithubUser(user_name)
    else:
        print r.status_code


def formatInfo(message):
    '''
    create by bigzhu at 15/07/22 14:48:01 组装message为可读的
    '''
    text = ''
    if message['type'] == 'PushEvent':
        commits = message['payload']['commits']
        commits = ';'.join(c['message'] for c in commits)
        text = 'Push ' + message['repo']['name'] + ':' + commits
    elif message['type'] == 'IssueCommentEvent':
        payload = message['payload']
        text = payload['issue']['title'] + '\n'
        text += payload['comment']['body']
    elif message['type'] == 'WatchEvent':
        text = message['payload']['action'] + ' ' + message['repo']['name']
    elif message['type'] == 'IssuesEvent':
        payload = message['payload']
        text = message['repo']['name'] + '\n'
        text += payload['action'] + ' issue ' + payload['issue']['title']
    return text


def saveMessage(message):
    '''
    create by bigzhu at 15/07/16 09:44:39 为了抽取数据方便,合并数据到 content 里
    '''
    message.id_str = message.pop('id')

    content = storage()
    content.type = message.type
    content.repo = message.pop('repo')
    content.payload = message.pop('payload')
    message.content = json.dumps(content)

    if message.get('org'):
        message.org = json.dumps(message.org)

    return db_bz.insertIfNotExist(pg, 'github_message', message, "id_str='%s'" % message.id_str)


def saveUser(id, url):
    '''
    create by bigzhu at 15/07/15 21:27:19 保存github信息
    create by bigzhu at 15/07/22 16:17:37 fix bug, not return id
    '''
    if list(pg.select('github_user', where='id=%s' % id)):
        return id
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
    while True:
        check()
        pg.refresh('messages')
        time.sleep(300)
