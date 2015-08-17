#!/usr/bin/env python
# -*- coding: utf-8 -*-
import pg
import user_bz
user_oper = user_bz.UserOper(pg)


def getLast(user_id):
    result = list(pg.select('last', where="user_id=%s" % user_id))
    if result:
        return result[0]


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


def getMessages(user_id=None, god_name=None, type=None, id=None, limit=None, offset=None, last_time=None):
    '''
    create by bigzhu at 15/07/14 15:11:44 查出我 Follow 的用户的twitter message
    modify by bigzhu at 15/07/17 01:39:21 过于复杂,合并sql,根据god_name也可以查
    modify by bigzhu at 15/07/19 15:30:55 可以根据type和id查出某一条记录
    modify by bigzhu at 15/07/22 12:49:35 limit 设定取多少条
    modify by bigzhu at 15/08/13 17:20:15 建立view,查询简化得不行
    modify by bigzhu at 15/08/16 18:09:53 支持对last_time的查询
    '''
    sql = "select * from messages"
    print 'offset=',offset,'god_name=',god_name,'type=',type,'id=',id,'limit=',limit
    if offset is None and god_name is None and type is None and id is None and limit is None and last_time is not None:
        last_time = time_bz.datetimeToTimestamp(last_time) #转为timestamp
        last_time = last_time - 600 # 后10分钟的也取出来
        where = ' where created_at>to_timestamp(%s)' % last_time

    if type and id:
        sql = '''
        select * from (%s) s
        where s.m_type='%s'
        and s.id = %s
        ''' % (sql, type, id)
    if god_name:
        sql = '''
        select * from (%s) s
        where lower(s.user_name)=lower('%s')
        ''' % (sql, god_name)
    if user_id:
        sql = '''
        select * from (%s) s
        where lower(s.user_name) in (
            select lower(user_name) from user_info where id in(
                    select god_id from follow_who where user_id=%s
                )
        )
        ''' % (sql, user_id)
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
