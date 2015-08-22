#!/usr/bin/env python
# -*- coding: utf-8 -*-
import db_bz
import pg
import public_db
import base64
import time_bz


def getGods(user_id):
    '''
    create by bigzhu at 15/07/12 23:43:54 显示所有的大神, 关联twitter
    modify by bigzhu at 15/07/17 15:20:26 关联其他的,包括 github
    '''
    gods = list(public_db.getGodInfoFollow(user_id))
    will_del = []
    for god in gods:
        god.twitter_user = public_db.getTwitterUser(god.twitter)
        god.github_user = public_db.getGithubUser(god.github)
        god.instagram_user = public_db.getInstagramUser(god.instagram)
        if god.twitter_user is None and god.github_user is None and god.instagram_user is None:
            will_del.append(god)
    for god in will_del:
        gods.remove(god)
    return gods


def saveLast(last_time, last_message_id, user_id):
    '''
    create by bigzhu at 15/08/16 16:22:39 保存最后一条的message
    '''
    last_time = int(last_time)
    datetime_last_time = time_bz.timestampToDateTime(last_time, millisecond=True)
    id = db_bz.insertIfNotExist(pg, 'last', {'user_id': user_id, 'last_time': datetime_last_time, 'last_message_id': last_message_id}, "user_id=%s" % user_id)
    if id is None:
        count = pg.update('last', where='last_time< to_timestamp(%s/1000) and user_id=%s' % (last_time, user_id), last_message_id=last_message_id, last_time=datetime_last_time)
        return count
    return id


def follow(user_id, god_id, make_sure=True):
    '''
    create by bigzhu at 15/07/15 14:22:51
    modify by bigzhu at 15/07/15 15:00:28 如果不用告警,就不要make_sure
    '''
    id = db_bz.insertIfNotExist(pg, 'follow_who', {'user_id': user_id, 'god_id': god_id}, "user_id=%s and god_id=%s" % (user_id, god_id))
    if id is None and make_sure:
        raise Exception('没有正确的Follow, 似乎已经Follow过了呢')


def getMessages(limit=None, current_user=None, god_name=None, offset=None, last_time=None):
    '''
    create by bigzhu at 15/08/03 13:24:39 分页方式取messages
    '''
    anchor = ''
    if limit is None:
        limit = 20
        more = 40
    messages = list(public_db.getMessages(current_user, limit=limit, god_name=god_name, offset=offset, last_time=last_time))
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
    modify by bigzhu at 15/08/08 19:47:32 加密时会带上换行,要去了, 否则微信会打不开
    '''
    return base64.encodestring(base64.encodestring(url).replace('\n', '')).replace('\n', '')


def decodeUrl(url):
    return base64.decodestring(base64.decodestring(url))

if __name__ == '__main__':
    pass
