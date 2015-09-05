#!/usr/bin/env python
# -*- coding: utf-8 -*-
'''
create by bigzhu at 15/07/15 17:17:29 取github的动态
'''
import requests
import pg
import json
import time_bz
import time
import public_bz


def check(user_name=None):
    '''
    '''
    where = '''
        tumblr is not null and tumblr!=''
    '''
    if user_name:
        where += " and tumblr='%s'" % user_name
    users = pg.select('user_info', what='tumblr', where=where)
    for user in users:
        print 'check tumblr %s' % user.tumblr
        main(user.tumblr)


def delTumblrUser(user_name):
    sql = '''
    update user_info set tumblr=null where lower(tumblr)=lower('%s')
    ''' % user_name
    pg.query(sql)


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
    saveBlogs(user_name, blogs, offset=20)


def saveBlogs(user_name, blogs, offset):
    if blogs:
        pass
    else:
        return
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

        result = pg.insertIfNotExist(pg, 'tumblr_blog', blog, "id_str='%s'" % blog['id_str'])
        if result is None:  # 有重复记录了,就不再继续了
            print 'have some data'
            return
        else:
            print 'new ', blog['id_str'], blog['type'], 'offset:', offset
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
    main('deviantart')
    while True:
        check()
        pg.refresh('messages')
        time.sleep(300)
