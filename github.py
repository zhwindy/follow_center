#!/usr/bin/env python
# -*- coding: utf-8 -*-
'''
create by bigzhu at 15/07/15 17:17:29 取github的动态
'''
import requests
import pg
import copy
import db_bz
import wechat_oper
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
            print 'check github %s' % user.github
            getUserEvent(user.github, user.etag)


def updateEtag(user_name, etag):
    count = pg.db.update('github_user', where="login='%s'" % user_name, etag=etag)
    if count != 1:
        raise Exception('更新etag 失败, %s' % count)


def delGithubUser(user_name):
    sql = '''
    update user_info set github=null where github='%s'
    ''' % user_name
    pg.db.query(sql)


def getUserEvent(user_name, etag):
    '''
    create by bigzhu at 15/07/15 17:54:08 取github
    '''
    headers = {'If-None-Match': etag}
    r = requests.get('https://api.github.com/users/%s/events' % user_name, headers=headers)

    if r.status_code == 200:
        messages = r.json()
        if not messages:
            delGithubUser(user_name)
            # 没有这个github用户,取消
            return
        actor = messages[0]['actor']
        user_id = saveUser(actor['id'], actor['url'])

        # 更新etag
        etag = r.headers['etag']
        updateEtag(user_name, etag)

        for i in r.json():
            i['actor'] = user_id
            message = storage(i)
            id = saveMessage(copy.deepcopy(message))
            if id is not None:
                text = formatInfo(message)
                print text
                openids = public_db.getOpenidsByGithubName(user_name)
                for data in openids:
                    wechat_oper.sendGithub(data.openid, text, user_name, id)
    else:
        print r.status_code


def formatInfo(message):
    '''
    create by bigzhu at 15/07/22 14:48:01 组装message为可读的
    '''
    text = ''
    print message
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
        text = message['repo']['name'] + '\n'
        text += message['payload']['action'] + ' issue ' + payload['issue']['title']
    return text


def saveMessage(message):
    '''
    create by bigzhu at 15/07/16 09:44:39 为了抽取数据方便,合并数据到 content 里
    '''
    print message
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
    check()
