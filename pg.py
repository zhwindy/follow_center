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

import ConfigParser
config = ConfigParser.ConfigParser()
with open('conf/db.ini', 'r') as cfg_file:
    config.readfp(cfg_file)
    host = config.get('db', 'host')
    port = config.get('db', 'port')
    the_db = config.get('db', 'db')
    user = config.get('db', 'user')
    pw = config.get('db', 'pw')

db = None


def connect():
    global db
    db = webpy_db.database(
        port=5432,
        host=host,
        dbn='postgres',
        db=the_db,
        user=user,
        pw=pw)
    print '开始连接数据库 %s' % host

connect()


def daemon(method):
    '''
    自动重连数据库的一个装饰器
    '''
    @functools.wraps(method)
    def wrapper(self, *args, **kwargs):
        return method(self, *args, **kwargs)
        try:
            return method(self, *args, **kwargs)
        #except(psycopg2.OperationalError, psycopg2.InterfaceError, psycopg2.DatabaseError):
        #except(psycopg2.InterfaceError, psycopg2.DatabaseError):
        except (psycopg2.InterfaceError, psycopg2.OperationalError):
            print public_bz.getExpInfoAll()
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
    try:
        return db.query(*args, **kwargs)
    except Exception:
        print public_bz.getExpInfoAll()
        print args[0]
        print kwargs


def refresh(view_name):
    db.query('REFRESH MATERIALIZED VIEW %s' % view_name)


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
