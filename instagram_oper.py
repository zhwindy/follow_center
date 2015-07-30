#!/usr/bin/env python
# -*- coding: utf-8 -*-
import pg
from public_bz import storage
import public_bz
from instagram.client import InstagramAPI
import json
import ConfigParser
config = ConfigParser.ConfigParser()


with open('instagram.ini', 'r') as cfg_file:
    config.readfp(cfg_file)
    access_token = config.get('secret', 'access_token')
    client_secret = config.get('secret', 'client_secret')

api = InstagramAPI(access_token=access_token, client_secret=client_secret)

def getUser(user_name):
    users = list(pg.select('instagram_user', where="username='%s'" % user_name))
    if users:
        return users[0]
    else:
        user = api.user_search(user_name, 1)[0]
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
        return getUser(user_name)

def getMedia(user_name):
    user = getUser(user_name)
    medias, next_ = api.user_recent_media(user.id)
    for media in medias:
        db_media = storage()
        if media.caption:
            caption = media.caption.__dict__
            caption['user_id'] = caption['user'].id
            del caption['user']
            print caption
        else:
            caption = ''
        db_media.caption = json.dumps(caption, cls=public_bz.ExtEncoder)
        db_media.comment_count = media.comment_count
        db_media.comments = json.dumps(media.comments)
        db_media.created_time = media.created_time
        db_media.filter = media.filter
        db_media.low_resolution = json.dumps(media.images['low_resolution'].__dict__)
        db_media.standard_resolution = json.dumps(media.images['standard_resolution'].__dict__)
        db_media.thumbnail = json.dumps(media.images['thumbnail'].__dict__)
        db_media.id_str = media.id
        db_media.like_count = media.like_count
        #likes里有User对象,暂时不存了
        #db_media.likes = json.dumps(media.likes)
        db_media.link = media.link
        db_media.type = media.type
        db_media.user_id = user.id
        pg.insert('instagram_media', **db_media)

#q='tildalindstam'
#user = api.user_search(q, 1)[0]
#print user.profile_picture
#
#w = api.user_recent_media(user_id)
#print w
#m =  w[0]
#print m
#l = m[0]
#print l
#print dir(l)

if __name__ == '__main__':
    print getMedia('tildalindstam')
