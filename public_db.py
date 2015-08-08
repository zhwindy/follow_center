#!/usr/bin/env python
# -*- coding: utf-8 -*-
import pg
import user_bz
user_oper = user_bz.UserOper(pg)


def delNoName(type, name):
    sql = '''
    update user_info set %s=null where lower(%s)=lower('%s')
    ''' % (type, type, name)
    pg.query(sql)


def getOpenidsByName(type, name):
    sql = '''
        select w.openid from user_info u, follow_who f, user_info u2, wechat_user w
        where lower(u.%s)=lower('%s')
        and u.id = f.god_id
        and u2.id = f.user_id
        and w.user_name=u2.user_name
    ''' % (type, name)
    return pg.query(sql)


def getWechatUserByOpenid(openid):
    '''
    create by bigzhu at 15/04/04 12:48:58 根据 openid 来查询微信用户
    '''
    return list(pg.select('wechat_user', where="openid='%s'" % openid))


def getTwitterUser(name):
    '''
    create by bigzhu at 15/07/17 15:09:56 twitter用户
    '''
    result = list(pg.select('twitter_user', where="screen_name='%s'" % name))
    count = len(result)
    if count > 1:
        raise Exception('twitter_user screen_name=%s count=%s' % (name, count))
    if count == 1:
        return result[0]


def getGithubUser(name):
    '''
    create by bigzhu at 15/07/17 15:10:23 github 用户
    '''
    result = list(pg.select('github_user', where="login='%s'" % name))
    count = len(result)
    if count > 1:
        raise Exception('github_user screen_name=%s count=%s' % (name, count))
    if count == 1:
        return result[0]


def getInstagramUser(name):
    '''
    create by bigzhu at 15/07/31 15:00:19 Instagram
    '''
    result = list(pg.select('instagram_user', where="username='%s'" % name))
    count = len(result)
    if count > 1:
        raise Exception('instagram_user username=%s count=%s' % (name, count))
    if count == 1:
        return result[0]


def getUserInfoGithub():
    '''
    create by bigzhu at 15/07/15 22:45:42
    '''
    sql = '''
            select * from   user_info u left join github_user g on u.user_name=g.login
    '''
    return pg.query(sql)


def getTwitterMessages():
    sql = '''
    select * from twitter_message tm, twitter_user tu
        where tm.t_user_id=tu.id_str order by tm.created_at desc
    '''
    return pg.query(sql)


def getMessages(user_id=None, god_name=None, type=None, id=None, limit=None, offset=None):
    '''
    create by bigzhu at 15/07/14 15:11:44 查出我 Follow 的用户的twitter message
    create by bigzhu at 15/07/17 01:39:21 过于复杂,合并sql,根据god_name也可以查
    modify by bigzhu at 15/07/19 15:30:55 可以根据type和id查出某一条记录
    modify by bigzhu at 15/07/22 12:49:35 limit 设定取多少条
    '''

    twitter_in = ''
    github_in = ''
    instagram_in = ''
    if god_name is not None:
        twitter_in = '''
            and lower(u.screen_name) in(
            select lower(twitter) from user_info where  user_name='%s'
            )
        ''' % god_name
        github_in = '''
            and lower(u.login) in(
            select lower(github) from user_info where user_name='%s'
            )
        ''' % god_name
        instagram_in = '''
            and lower(u.username) in(
            select lower(instagram) from user_info where  user_name='%s'
            )
        ''' % god_name

    if user_id is not None:
        twitter_in = '''
            and lower(u.screen_name) in(
            select lower(twitter) from user_info where id in(
                select god_id from follow_who where user_id=%s
                )
            )
        ''' % user_id
        github_in = '''
            and lower(u.login) in(
            select lower(github) from user_info where id in(
                select god_id from follow_who where user_id=%s
                )
            )
        ''' % user_id
        instagram_in = '''
            and lower(u.username) in(
            select lower(instagram) from user_info where id in(
                select god_id from follow_who where user_id=%s
                )
            )
        ''' % user_id

    sql = '''
    select * from (
        select
            ui.user_name,
            m.id,
            'twitter' as m_type,
            m.created_at,
            u.screen_name as name,
            u.profile_image_url_https as avatar,
            null as content,
            m.text,
            m.extended_entities,
            'https://twitter.com/'||u.screen_name||'/status/'||m.id_str as href,
            null as type
                from twitter_message m, twitter_user u, user_info ui
                where m.t_user_id=u.id_str
                and lower(u.screen_name) = lower(ui.twitter)
            %s
            union
        select
            ui.user_name,
            m.id,
            'github' as m_type,
            m.created_at,
            u.login as name,
            u.avatar_url as avatar,
            m.content,
            null as text,
            null as extended_entities,
            null as href,
            null as type
                from github_message m, github_user u, user_info ui
                where m.actor=u.id
                and lower(u.login) = lower(ui.github)
            %s
            union
        select
            ui.user_name,
            m.id,
            'instagram' as m_type,
            m.created_time as created_at,
            u.username as name,
            u.profile_picture as avatar,
            m.comments as content,
            (m.caption->>'text')::text as text,
            m.standard_resolution as extended_entities,
            m.link as href,
            m.type as type
                from instagram_media m, instagram_user u, user_info ui
                where m.user_id=u.id
                and lower(u.username) = lower(ui.instagram)
            %s
            ) as t order by created_at desc

        ''' % (twitter_in, github_in, instagram_in)
    if type and id:
        sql = '''
        select * from (%s) s
        where s.m_type='%s'
        and s.id = %s
        ''' % (sql, type, id)
    if limit:
        sql = '''
        select * from (%s) s
        limit %s
        ''' % (sql, limit)
    if offset:
        sql = sql + ' offset %s' % offset
    return pg.query(sql)


def getGodInfoFollow(user_id=None, god_name=None):
    '''
    modify by bigzhu at 15/08/06 17:05:22 可以根据god_name来取
    '''
    sql = '''
    select  u.id as god_id, 0 followed,
            u.created_date as u_created_date,
    * from user_info u order by u.created_date desc
    '''
    if god_name:
        sql = '''
        select * from (%s) s where lower(user_name)=lower('%s')
        ''' % (sql, god_name)
    if user_id:
        sql = '''
            select * from   (%s) ut left join (select god_id followed_god_id, 1 followed from follow_who where user_id=%s) f on ut.god_id=f.followed_god_id
            order by ut.u_created_date desc
        ''' % (sql, user_id)

    return pg.query(sql)


def getUserInfoTwitterUser(user_id=None):
    sql = '''
    select  u.id as god_id, 0 followed,
            u.created_date as u_created_date,
    * from user_info u, twitter_user tu
        where u.twitter = tu.screen_name
        order by tu.created_date desc
    '''
    if user_id:
        sql = '''
            select * from   (%s) ut left join (select god_id followed_god_id, 1 followed from follow_who where user_id=%s) f on ut.god_id=f.followed_god_id
            order by ut.u_created_date desc
        ''' % (sql, user_id)

    return pg.query(sql)


def getUserInfoByName(user_name):
    user_info = user_oper.getUserInfo(user_name=user_name)
    if user_info:
        user_info = user_info[0]
    else:
        user_info = user_oper.getEmptyUserInfo()
        if user_name != '-1':
            user_info.user_name = user_name
    return user_info
if __name__ == '__main__':
    pass
