#!/usr/bin/env python
# -*- coding: utf-8 -*-
import pg
import user_bz
user_oper = user_bz.UserOper(pg)


def getUserInfoGithub():
    '''
    create by bigzhu at 15/07/15 22:45:42
    '''
    sql = '''
            select * from   user_info u left join github_user g on u.user_name=g.login
    '''
    return pg.db.query(sql)


def getTwitterMessages():
    sql = '''
    select * from twitter_message tm, twitter_user tu
        where tm.t_user_id=tu.id_str order by tm.created_at desc
    '''
    return pg.db.query(sql)


def getMyFollowTwitterMessages(user_id=None):
    '''
    create by bigzhu at 15/07/14 15:11:44 查出我 Follow 的用户的twitter message
    '''

    twitter_in = ''
    github_in = ''
    if user_id is None:
        twitter_in = '''
            and tu.screen_name in(
            select twitter from user_info where id in(
                select god_id from follow_who where user_id=%s
                )
            )
        ''' % user_id
        github_in = '''
            and gu.login in(
            select github from user_info where id in(
                select god_id from follow_who where user_id=%s
                )
            )
        ''' % user_id

    sql = '''
        select
            'twitter' as m_type,
            m.created_at,
            u.screen_name as name,
            u.profile_image_url_https as avatar,
            null as content,
            m.text
                from twitter_message m, twitter_user u
                where m.t_user_id=u.id_str
            %s
            union
        select
            'github' as m_type,
            m.created_at,
            u.login as name,
            u.avatar_url as avatar,
            m.content,
            null as text
                from github_message m, github_user u
                where m.actor=u.id
            %s
        ''' % (twitter_in, github_in)
    print sql

    return pg.db.query(sql)


def getTwitterMessagesByName(user_name):
    sql = '''
    select * from twitter_message tm, twitter_user tu
        where tm.t_user_id=tu.id_str
        and tu.screen_name='%s'

        order by tm.created_at desc
    ''' % user_name
    return pg.db.query(sql)


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

    return pg.db.query(sql)


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
    getMyFollowTwitterMessages(6)
