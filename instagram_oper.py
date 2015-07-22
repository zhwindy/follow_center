#!/usr/bin/env python
# -*- coding: utf-8 -*-
import ConfigParser
config = ConfigParser.ConfigParser()

with open('instagram.ini', 'r') as cfg_file:
    config.readfp(cfg_file)
    access_token = config.get('secret', 'access_token')
    client_secret = config.get('secret', 'client_secret')


from instagram.client import InstagramAPI

api = InstagramAPI(access_token=access_token, client_secret=client_secret)
q='jerrymice'
user = api.user_search(q, 1)[0]
user_id = user.id
print user.profile_picture

w = api.user_recent_media(user_id)
print w
m =  w[0]
print m
l = m[0]
print l
print dir(l)
'''
http://images.ak.instagram.com/profiles/profile_1003643206_75sq_1390917050.jpg
([Media: 741181171125181158_1337827037, Media: 726531381309462809_1337827037, Media: 726526581641566445_1337827037, Media: 725834033860172443_1337827037, Media: 722798067683678319_1337827037], None)
[Media: 741181171125181158_1337827037, Media: 726531381309462809_1337827037, Media: 726526581641566445_1337827037, Media: 725834033860172443_1337827037, Media: 722798067683678319_1337827037]
Media: 741181171125181158_1337827037
['__class__', '__delattr__', '__dict__', '__doc__', '__format__', '__getattribute__', '__hash__', '__init__', '__module__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', '__unicode__', '__weakref__', 'caption', 'comment_count', 'comments', 'created_time', 'filter', 'get_low_resolution_url', 'get_standard_resolution_url', 'get_thumbnail_url', 'id', 'images', 'like_count', 'likes', 'link', 'object_from_dictionary', 'type', 'user', 'user_has_liked']
'''

if __name__ == '__main__':
    pass
