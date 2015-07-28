# !/usr/bin/env python
# encoding=utf-8
import sys
reload(sys)
sys.setdefaultencoding('utf-8')
import webpy_db
import db_bz

#DB_IP = '127.0.0.1'
DB_IP = 'bigzhu.org'
db = None


def connect():
    global db
    db = webpy_db.database(
        port=5432,
        host=DB_IP,
        dbn='postgres',
        db='follow_center',
        user='follow_center',
        pw='follow_center')
    print '开始连接数据库 %s' % DB_IP

connect()


@db_bz.daemonDB
def select(*args, **kwargs):
    return db.select(*args, **kwargs)


@db_bz.daemonDB
def query(*args, **kwargs):
    return db.query(*args, **kwargs)


@db_bz.daemonDB
def update(*args, **kwargs):
    return db.update(*args, **kwargs)


@db_bz.daemonDB
def delete(*args, **kwargs):
    return db.delete(*args, **kwargs)


@db_bz.daemonDB
def insert(*args, **kwargs):
    return db.insert(*args, **kwargs)

if __name__ == '__main__':
    pass
