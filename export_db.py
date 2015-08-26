# !/usr/bin/env python
# encoding=utf-8
import sys
reload(sys)
sys.setdefaultencoding('utf-8')
import time_bz
import os

import ConfigParser
config = ConfigParser.ConfigParser()
with open('conf/db.ini', 'r') as cfg_file:
    config.readfp(cfg_file)
    host = config.get('db', 'host')
    port = config.get('db', 'port')
    the_db = config.get('db', 'db')
    user = config.get('db', 'user')
    pw = config.get('db', 'pw')
host = "bigzhu.org"

now_day = time_bz.getYearMonthDay()
file_name = '%s.%s.dump' % (the_db, now_day)
command = '''
PGPASSWORD="%s" pg_dump -i -h %s -p %s -U %s -F c -b -v -f %s %s
''' % (pw, host, port, user, file_name, the_db)

print command
os.system(command)
