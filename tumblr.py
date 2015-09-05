#!/usr/bin/env python
# -*- coding: utf-8 -*-
'''
create by bigzhu at 15/07/15 17:17:29 取github的动态
'''
import requests
import pg
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


def delGithubUser(user_name):
    sql = '''
    update user_info set github=null where lower(github)=lower('%s')
    ''' % user_name
    pg.query(sql)


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


def saveUserCheckNew(blogs):
    '''
    create by bigzhu at 15/09/05 11:57:11
    '''
    user = blogs['blog']
    user_name = user['name']
    where = "name='%s'" % user_name
    result = list(pg.select('tumblr_user', where=where))
    if result:
        if result[0].updated == user['updated']:  # 如果没有更新过，就不用继续了
            print user_name, ' no update'
            # return
            pass
    pg.insertOrUpdate(pg, 'tumblr_user', user, where)
    blogs = blogs['posts']
    saveBlogs(user_name, blogs, offset=7620)


def saveBlogs(user_name, blogs, offset):
    for blog in blogs:
        blog['created_date'] = time_bz.timestampToDateTime(blog['timestamp'])
        del blog['timestamp']
        blog['id_str'] = blog['id']
        del blog['id']

        del blog['date']
        del blog['recommended_source']
        del blog['recommended_color']
        del blog['highlighted']
        blog['user_name'] = user_name

        blog['tags'] = json.dumps(blog.get('tags'))
        blog['reblog'] = json.dumps(blog.get('reblog'))
        blog['trail'] = json.dumps(blog.get('trail'))
        blog['photos'] = json.dumps(blog.get('photos'))
        blog['post_author'] = json.dumps(blog.get('post_author'))
        blog['player'] = json.dumps(blog.get('player'))
        blog['dialogue'] = json.dumps(blog.get('dialogue'))

        #if blog.get('tags'):
        #    del blog['tags']
        #if blog.get('reblog'):
        #    del blog['reblog']
        #if blog.get('trail'):
        #    del blog['trail']
        #if blog.get('photos'):
        #    del blog['photos']
        #if blog.get('post_author'):
        #    del blog['post_author']









        result = pg.insertIfNotExist(pg, 'tumblr_blog', blog, "id_str='%s'" % blog['id_str'])
        if result is None:  # 有重复记录了,就不再继续了
            print 'have some data'
            return
        else:
            print 'new ',blog['id_str'],blog['type'],'offset:',offset
    # 继续取
    new_offset = offset + 20
    new_blogs = callGetMeidaApi(user_name, offset=new_offset)['response']['posts']
    saveBlogs(user_name, new_blogs, new_offset)


def callGetMeidaApi(user_name, offset=0, limit=20):
    api_key = 'fuiKNFp9vQFvjLNvx4sUwti4Yb5yGutBN4Xh10LXZhhRKjWlV4'
    params = {'api_key': api_key,
              'offset': offset,
              'limit': limit,
              }
    url = '''http://api.tumblr.com/v2/blog/%s.tumblr.com/posts''' % user_name
    try:
        r = requests.get(url, params=params)
    except requests.exceptions.ConnectionError:
        print public_bz.getExpInfoAll()
        return
    if r.status_code == 200:
        medias = r.json()
        return medias
    else:
        print r.status_code


def main(user_name=None):
    # try:
    #    blogs = callGetMeidaApi(user_name)['response']
    # except instagram.bind.InstagramClientError:
    #    print public_bz.getExpInfoAll()
    #    public_db.delNoName('tumblr', user_name)
    #    return
    blogs = callGetMeidaApi(user_name)['response']
    saveUserCheckNew(blogs)
if __name__ == '__main__':
    main('triketora')
