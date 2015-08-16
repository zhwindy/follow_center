#!/usr/bin/env python
# -*- coding: utf-8 -*-
import pg
from public_bz import storage
import public_bz
import instagram
from instagram.client import InstagramAPI

from datetime import timedelta
import time
import json
import db_bz
import ConfigParser
import public_db
import wechat_oper
config = ConfigParser.ConfigParser()


with open('conf/instagram.ini', 'r') as cfg_file:
    config.readfp(cfg_file)
    access_token = config.get('secret', 'access_token')
    client_secret = config.get('secret', 'client_secret')

api = InstagramAPI(access_token=access_token, client_secret=client_secret)


def getUser(user_name):
    '''
    modify by bigzhu at 15/07/31 16:41:16 api找用户时是按专注度来排序的,名字绝对匹配的未必是第一位, 从10个里面找
    '''
    users = list(pg.select('instagram_user', where="lower(username)=lower('%s')" % user_name))
    if users:
        return users[0]
    else:
        user = None
        for this_user in api.user_search(user_name, 10):
            if this_user.username.lower() == user_name.lower():
                user = this_user
                break
        #如果没有这个用户
        if user is None:
            public_db.delNoName('instagram', user_name)
        #user = api.user_search(user_name, 1)[0]
        user = api.user(user.id)

        db_user = storage()
        db_user.id = user.id
        db_user.username = user.username
        db_user.full_name = user.full_name
        db_user.profile_picture = user.profile_picture
        db_user.bio = user.bio
        db_user.website = user.website
        db_user.counts = json.dumps(user.counts)
        pg.insert('instagram_user', **db_user)
        #db_bz.insertIfNotExist(pg, 'instagram_user', db_user, "id=%s" % db_user.id)
        return getUser(user_name)


def getMedia(user_name=None, with_next_url=None, user=None):
    if user_name:
        user = getUser(user_name)
        if user is None:
            return
        # min_id 会查出大于等于这个id的
        try:
            medias, next_ = api.user_recent_media(user_id=user.id, min_id=user.last_id)
        except instagram.bind.InstagramClientError:
            print public_bz.getExpInfoAll()
            public_db.delNoName('instagram', user_name)
            return
        if medias:
            last_id = medias[0].id
            pg.update('instagram_user', where="lower(username)=lower('%s')" % user_name, last_id=last_id)
    else:
        medias, next_ = api.user_recent_media(with_next_url=with_next_url)

    for media in medias:
        db_media = storage()
        if media.caption:
            caption = media.caption.__dict__
            caption['user_id'] = caption['user'].id
            del caption['user']
        else:
            caption = ''
        db_media.caption = json.dumps(caption, cls=public_bz.ExtEncoder)
        db_media.comment_count = media.comment_count

        if media.comments:
            media.comments = [d.__dict__ for d in media.comments]
            for comment in media.comments:
                comment['user'] = comment['user'].__dict__
        db_media.comments = json.dumps(media.comments, cls=public_bz.ExtEncoder)
        db_media.created_time = media.created_time
        # 8小时的问题
        db_media.created_time += timedelta(hours=8)
        db_media.filter = media.filter
        db_media.low_resolution = json.dumps(media.images['low_resolution'].__dict__)
        db_media.standard_resolution = json.dumps(media.images['standard_resolution'].__dict__)
        db_media.thumbnail = json.dumps(media.images['thumbnail'].__dict__)
        db_media.id_str = media.id
        db_media.like_count = media.like_count
        # likes里有User对象,暂时不存了
        #db_media.likes = json.dumps(media.likes)
        db_media.link = media.link
        db_media.type = media.type
        db_media.user_id = user.id
        id = db_bz.insertIfNotExist(pg, 'instagram_media', db_media, "id_str='%s'" % db_media.id_str)
        print 'new=', media.id, user.username
        if id is not None and len(medias) <= 2:  # 新增加消息,微信通知只通知2条以内
            openids = public_db.getOpenidsByName('instagram', user.username)
            for data in openids:
                if caption != '':
                    text = caption.get('text')
                else:
                    text = ''
                wechat_oper.sendInstagram(data.openid, text, media.images['standard_resolution'].url, user.username, id)
    # 递归查出
    if next_ != with_next_url:
        getMedia(with_next_url=next_, user=user)


def check():
    '''
    create by bigzhu at 15/07/31 14:28:30
    '''
    users = pg.select('user_info', what='instagram', where="instagram is not null and instagram!=''")
    print len(users)
    for user in users:
        if user.instagram and user.instagram != '':
            print 'check instagram %s' % user.instagram
            try:
                getMedia(user.instagram)
            except Exception:
                print public_bz.getExpInfoAll()


if __name__ == '__main__':
    while True:
        check()
        time.sleep(300)
