#!/usr/bin/env python
# -*- coding: utf-8 -*-
import pg
import user_bz
user_oper = user_bz.UserOper(pg)

def getTwitterMessages():
    sql = '''
    select * from twitter_message tm, twitter_user tu
        where tm.t_user_id=tu.id_str order by tm.created_at desc
    '''
    return pg.db.query(sql)


def getTwitterMessagesByName(user_name):
    sql = '''
    select * from twitter_message tm, twitter_user tu
        where tm.t_user_id=tu.id_str
        and tu.screen_name='%s'

        order by tm.created_at desc
    ''' % user_name
    return pg.db.query(sql)

def getUserInfo():
    return user_oper.getUserInfo()

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
