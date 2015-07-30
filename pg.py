# !/usr/bin/env python
# encoding=utf-8
import sys
reload(sys)
sys.setdefaultencoding('utf-8')
import webpy_db
import functools
import psycopg2
import public_bz
import time

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


def daemon(method):
    '''
    自动重连数据库的一个装饰器
    '''
    @functools.wraps(method)
    def wrapper(self, *args, **kwargs):
        try:
            return method(self, *args, **kwargs)
        #except(psycopg2.OperationalError, psycopg2.InterfaceError, psycopg2.DatabaseError):
        except(psycopg2.InterfaceError, psycopg2.DatabaseError):
            print public_bz.getExpInfo()
            connect()
            time.sleep(5)
            print '重新连接数据库'
            return wrapper(self, *args, **kwargs)
    return wrapper


@daemon
def select(*args, **kwargs):
    return db.select(*args, **kwargs)


@daemon
def query(*args, **kwargs):
    return db.query(*args, **kwargs)


@daemon
def update(*args, **kwargs):
    return db.update(*args, **kwargs)


@daemon
def delete(*args, **kwargs):
    return db.delete(*args, **kwargs)


@daemon
def insert(*args, **kwargs):
    return db.insert(*args, **kwargs)

if __name__ == '__main__':
    pass
