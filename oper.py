#!/usr/bin/env python
# -*- coding: utf-8 -*-
import db_bz
import pg


def follow(user_id, god_id, make_sure=True):
    '''
    create by bigzhu at 15/07/15 14:22:51
    modify by bigzhu at 15/07/15 15:00:28 如果不用告警,就不要make_sure
    '''
    id = db_bz.insertIfNotExist(pg, 'follow_who', {'user_id': user_id, 'god_id': god_id}, "user_id=%s and god_id=%s" % (user_id, god_id))
    if id is None and make_sure:
        raise Exception('没有正确的Follow, 似乎已经Follow过了呢')

if __name__ == '__main__':
    pass
