#!/usr/bin/env python
# -*- coding: utf-8 -*-
'''
create by bigzhu at 15/07/04 22:25:30 取twitter的最新信息
modify by bigzhu at 15/07/17 16:49:58 添加pytz来修正crated_at的时区
modify by bigzhu at 15/07/17 17:08:38 存进去还是不对,手工来来修正吧
'''
#import pytz
#tz = pytz.timezone('Asia/Shanghai')
import time
import copy
from datetime import timedelta
import tweepy
import wechat_oper
import public_db
import db_bz
import pg
import json
import public_bz
import ConfigParser
config = ConfigParser.ConfigParser()
with open('conf/twitter.ini', 'r') as cfg_file:
    config.readfp(cfg_file)
    consumer_key = config.get('secret', 'consumer_key')
    consumer_secret = config.get('secret', 'consumer_secret')
    access_token = config.get('secret', 'access_token')
    access_token_secret = config.get('secret', 'access_token_secret')


def check():
    '''
    create by bigzhu at 15/07/10 14:46:58
        从 user_info 取出 twitter url 来检查
    '''
    users = pg.select('user_info', what='twitter', where='twitter is not null')
    for user in users:
        if user.twitter and user.twitter != '':
            print 'check twitter %s' % user.twitter
            checkUserMessage(user.twitter)


def checkUserMessage(twitter_name):
    '''
    create by bigzhu at 15/07/10 14:41:57
    根据用户twitter url 取用户的最新 message
    modify by bigzhu at 15/07/13 00:03:52 只存放用户名,不用再取最后一个了
    '''
    getUserTimeline(twitter_name)


def getUserTimeline(screen_name):
    '''
    create by bigzhu at 15/07/04 22:49:04
        用 https://api.twitter.com/1.1/statuses/user_timeline.json 可以取到某个用户的信息
        参看 https://dev.twitter.com/rest/reference/get/statuses/user_timeline
    modify by bigzhu at 15/07/04 22:53:09
        考虑使用 http://www.tweepy.org/ 来调用twitter api
    modify by bigzhu at 15/08/02 21:35:46 避免批量微信通知
    '''
    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)

    api = tweepy.API(auth)
    try:
        public_tweets = api.user_timeline(screen_name=screen_name)
        for tweet in public_tweets:
            #tweet.created_at = tz.localize(tweet.created_at)
            tweet.created_at += timedelta(hours=8)
            # print tweet.created_at
            id = saveTwitter(copy.deepcopy(tweet))
            if id is not None and len(public_tweets) <= 3:  # 新增加消息
                openids = public_db.getOpenidsByName('twitter', screen_name)
                print 'new=', tweet.text
                for data in openids:
                    wechat_oper.sendTwitter(data.openid, tweet, screen_name, id)
    except tweepy.error.TweepError:
        print 'screen_name=', screen_name
        public_bz.getExpInfo()


def saveTwitter(tweet):
    '''
    create by bigzhu at 15/07/10 14:39:48
        保存twitter
    '''

    if hasattr(tweet, 'user'):
        del tweet.user._json
        #del tweet.user._api
        tweet.user.entities = json.dumps(tweet.user.entities)

        del tweet.user.id
        db_bz.insertIfNotExist(pg, 'twitter_user', vars(tweet.user), "id_str='%s'" % tweet.user.id_str)
        tweet.t_user_id = tweet.user.id_str
        del tweet.user

    if hasattr(tweet, 'author'):
        #del tweet.author.id
        db_bz.insertIfNotExist(pg, 'twitter_user', vars(tweet.author), "id_str='%s'" % tweet.author.id_str)
        tweet.t_author_id = tweet.author.id_str

        del tweet.author

    if hasattr(tweet, '_api'):
        del tweet._api
    if hasattr(tweet, '_json'):
        del tweet._json
    # twitter id 太大了 "id": 618948810941673472 导致 psycopg2.DataError: integer out of range
    if hasattr(tweet, 'id'):
        del tweet.id

    if hasattr(tweet, 'entities'):
        tweet.entities = json.dumps(tweet.entities)
    if hasattr(tweet, 'geo'):
        tweet.geo = json.dumps(tweet.geo)
    if hasattr(tweet, 'coordinates'):
        tweet.coordinates = json.dumps(tweet.coordinates)
    if hasattr(tweet, 'extended_entities'):
        tweet.extended_entities = json.dumps(tweet.extended_entities)
    if hasattr(tweet, 'retweeted_status'):
        saveTwitter(tweet.retweeted_status)
        tweet.retweeted_status = tweet.retweeted_status.id_str
    if hasattr(tweet, 'quoted_status'):
        # print tweet.quoted_status
        del tweet.quoted_status
    #    saveTwitter(tweet.quoted_status)
    #    tweet.quoted_status = tweet.quoted_status.id_str

    # place  是一个对象(我不知道如何处理): Place(_api=<tweepy.api.API object at 0x1808050>
    if hasattr(tweet, 'place'):
        del tweet.place

    # for k, v in vars(tweet).items():
    #    print '%s=%s' % (k, v)

    return db_bz.insertIfNotExist(pg, 'twitter_message', vars(tweet), "id_str='%s'" % tweet.id_str)


if __name__ == '__main__':
    while True:
        check()
        pg.refresh('messages')
        time.sleep(300)
