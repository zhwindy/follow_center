#!/usr/bin/env python
# -*- coding: utf-8 -*-
import pg
from public_bz import storage
import public_bz
import time
import requests
import time_bz
import instagram
from instagram.client import InstagramAPI

from datetime import timedelta
import json
import ConfigParser
import public_db
import wechat_oper
config = ConfigParser.ConfigParser()


with open('conf/instagram.ini', 'r') as cfg_file:
    config.readfp(cfg_file)
    access_token = config.get('secret', 'access_token')
    client_secret = config.get('secret', 'client_secret')

api = InstagramAPI(access_token=access_token, client_secret=client_secret)


def getUser(user_name, always_check=False):
    '''
    modify by bigzhu at 15/07/31 16:41:16 api找用户时是按专注度来排序的,名字绝对匹配的未必是第一位, 从10个里面找
    '''
    users = list(pg.select('instagram_user', where="lower(username)=lower('%s')" % user_name))
    if users and not always_check:
        return users[0]
    else:
        user = None
        for this_user in api.user_search(user_name, 10):
            if this_user.username.lower() == user_name.lower():
                user = this_user
                break
        # 如果没有这个用户
        if user is None:
            public_db.delNoName('instagram', user_name)
        #user = api.user_search(user_name, 1)[0]

        try:
            user = api.user(user.id)
        except instagram.bind.InstagramAPIError:
            # 通常是没有访问权限
            print public_bz.getExpInfoAll()
            public_db.delNoName('instagram', user_name)
            return

        db_user = storage()
        db_user.id = user.id
        db_user.username = user.username
        db_user.full_name = user.full_name
        db_user.profile_picture = user.profile_picture
        db_user.bio = user.bio
        db_user.website = user.website
        db_user.counts = json.dumps(user.counts)
        #pg.insert('instagram_user', **db_user)
        pg.insertOrUpdate(pg, 'instagram_user', db_user, "id=%s" % db_user.id)
        #db_bz.insertIfNotExist(pg, 'instagram_user', db_user, "id=%s" % db_user.id)
        return getUser(user_name)


def saveMedias(user, medias):
    '''
    create by bigzhu at 15/09/04 20:58:54 保存meedias

         "attribution":null,
         "tags":[  ],
         "type":"image",
         "location":{  },
         "comments":{  },
         "filter":"Normal",
         "created_time":"1441362020",
         "link":"https:\/\/instagram.com\/p\/7NIHiLJJs3\/",
         "likes":{  },
         "images":{  },
         "users_in_photo":[  ],
         "caption":{  },
         "user_has_liked":false,
         "id":"1066544388859271991_262341",
         "user":{  }
    '''

    for media_d in medias['data']:
        media = storage(media_d)
        db_media = storage()

        #db_media.attribution = media.attribution
        #db_media.tags = json.dumps(media.tags, cls=public_bz.ExtEncoder)
        db_media.type = media.type
        #db_media.location = json.dumps(media.location, cls=public_bz.ExtEncoder)
        db_media.comments = json.dumps(media.comments, cls=public_bz.ExtEncoder)
        db_media.filter = media.filter
        db_media.created_time = time_bz.timestampToDateTime(media.created_time) + timedelta(hours=8)
        db_media.link = media.link
        #db_media.likes = json.dumps(media.likes, cls=public_bz.ExtEncoder)
        db_media.low_resolution = json.dumps(media.images['low_resolution'])
        db_media.standard_resolution = json.dumps(media.images['standard_resolution'])
        db_media.thumbnail = json.dumps(media.images['thumbnail'])
        #db_media.users_in_photo = json.dumps(media.users_in_photo, cls=public_bz.ExtEncoder)
        if media.caption:
            caption = media.caption
            caption['user_id'] = caption['from']['id']
            del caption['from']
        else:
            caption = ''
        db_media.caption = json.dumps(caption, cls=public_bz.ExtEncoder)

        db_media.id_str = media.id
        db_media.user_id = user.id

        id = pg.insertIfNotExist(pg, 'instagram_media', db_media, "id_str='%s'" % db_media.id_str)
        if id is None:
            raise Exception('重复记录 id=%s, name=%s' % (media.id, user.username))
        else:
            print 'new=', media.id, user.username
        if id is not None and len(medias) <= 2:  # 新增加消息,微信通知只通知2条以内
            openids = public_db.getOpenidsByName('instagram', user.username)
            for data in openids:
                if caption != '':
                    text = caption.get('text')
                else:
                    text = ''
                wechat_oper.sendInstagram(data.openid, text, media.images['low_resolution']['url'], user.username, id)

    if medias['pagination']:
        next_url = medias['pagination']['next_url']
        medias = callGetMeidaApi(next_url=next_url)
        saveMedias(user, medias)


def saveLastId(user, medias):
    '''
    create by bigzhu at 15/09/04 21:42:06 保存最后那条记录，删除重复记录
    '''
    medias = medias['data']
    if medias:
        if medias[-1]['id'] == user.last_id:  # 会取出最后一条，要删了
            del medias[-1]
        else:
            last_id = medias[0]['id']
            pg.update('instagram_user', where="lower(username)=lower('%s')" % user.username, last_id=last_id)


def callGetMeidaApi(user_id=None, min_id=None, next_url=None):
    params = {'count': 9999,
              'access_token': access_token,
              }
    if min_id:
        params['min_id'] = min_id
    if user_id:
        url = '''https://api.instagram.com/v1/users/%s/media/recent''' % user_id
    try:
        if next_url:
            r = requests.get(next_url)
        else:
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
    user = getUser(user_name, always_check=True)
    if user is None:
        # 用户都没有，不用往下了
        return
    try:
        # https://api.instagram.com/v1/users/1337827037/media/recent/?access_token=1337827037.933ab14.2a607a5fc0534f9f9900e75196a2dfbb&min_id=1054034416535329463_1337827037
        # 即使设置了min_id,instagram还是会把当前这条min_id返回来，简直了
        #medias, next_ = api.user_recent_media(user_id=user.id, min_id=user.last_id)
        medias = callGetMeidaApi(user.id, user.last_id)
    except instagram.bind.InstagramClientError:
        print public_bz.getExpInfoAll()
        public_db.delNoName('instagram', user_name)
        return
    saveLastId(user, medias)
    if len(medias['data']) !=0:
        print len(medias['data'])
    saveMedias(user, medias)


def check(user_name=None):
    '''
    create by bigzhu at 15/07/31 14:28:30
    modify by bigzhu at 15/08/23 22:30:25 可以指定查某个user_name
    '''
    where = '''
        instagram is not null and instagram!=''
    '''
    if user_name:
        where += " and instagram='%s'" % user_name
    users = pg.select('user_info', what='instagram', where=where)
    for user in users:
        if user.instagram and user.instagram != '':
            print 'check instagram %s' % user.instagram
            main(user.instagram)
            # try:
            #    getMedia(user.instagram)
            # except Exception:
            #    print public_bz.getExpInfoAll()


if __name__ == '__main__':
    while True:
        check()
        pg.refresh('messages')
        time.sleep(300)
