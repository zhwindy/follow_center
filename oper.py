#!/usr/bin/env python
# -*- coding: utf-8 -*-
import db_bz
import pg
import public_db
import base64


def follow(user_id, god_id, make_sure=True):
    '''
    create by bigzhu at 15/07/15 14:22:51
    modify by bigzhu at 15/07/15 15:00:28 如果不用告警,就不要make_sure
    '''
    id = db_bz.insertIfNotExist(pg, 'follow_who', {'user_id': user_id, 'god_id': god_id}, "user_id=%s and god_id=%s" % (user_id, god_id))
    if id is None and make_sure:
        raise Exception('没有正确的Follow, 似乎已经Follow过了呢')


def getMessages(limit='', current_user=None, god_name=None):
    '''
    create by bigzhu at 15/08/03 13:24:39 分页方式取messages
    '''
    anchor = ''
    if limit == '':
        limit = 20
        more = 40
    messages = list(public_db.getMessages(current_user, limit=limit, god_name=god_name))
    if messages:
        anchor_message = messages[-1]
        anchor = '%s_%s' % (anchor_message.m_type, anchor_message.id)
        more = int(limit) + 20
    return messages, more, anchor


def makeSurePicture(user_info):
    '''
    create by bigzhu at 15/08/03 16:31:00 从各种用户里找头像
    modify by bigzhu at 15/08/03 16:58:52 同时把描述也找了
    '''
    if user_info.picture:
        return

    github_user = public_db.getGithubUser(user_info.user_name)
    if github_user:
        user_info.picture = github_user.avatar_url
        return
    twitter_user = public_db.getTwitterUser(user_info.user_name)
    if twitter_user:
        user_info.picture = twitter_user.profile_image_url_https
        if not user_info.slogan:
            user_info.slogan = twitter_user.description
        return
    instagram_user = public_db.getInstagramUser(user_info.user_name)
    if instagram_user:
        user_info.picture = instagram_user.profile_picture
        return


def encodeUrl(url):
    '''
    create by bigzhu at 15/08/07 10:37:21 加密url
    '''
    return base64.encodestring(base64.encodestring(url))


def decodeUrl(url):
    return base64.decodestring(base64.decodestring(url))

if __name__ == '__main__':
    pass
