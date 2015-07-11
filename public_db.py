#!/usr/bin/env python
# -*- coding: utf-8 -*-
import pg
def getTwitterMessages():
    sql = '''
    select * from twitter_message tm, twitter_user tu
        where tm.t_user_id=tu.id_str
    '''
    return pg.db.query(sql)

if __name__ == '__main__':
    pass
