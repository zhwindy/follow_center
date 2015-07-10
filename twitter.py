#!/usr/bin/env python
# -*- coding: utf-8 -*-
'''
create by bigzhu at 15/07/04 22:25:30 取twitter的最新信息
'''
import tweepy
import ConfigParser
import db_bz
import pg
import json
import http_bz
config = ConfigParser.ConfigParser()
with open('twitter.ini', 'r') as cfg_file:
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
    users = pg.db.select('user_info', what='twitter')
    for user in users:
        if user.twitter and user.twitter != '':
            checkUserMessage(user.twitter)


def checkUserMessage(url):
    '''
    create by bigzhu at 15/07/10 14:41:57
    根据用户twitter url 取用户的最新 message
    '''
    user_name = http_bz.getUrlLastPath(url)
    getUserTimeline(user_name)


def getUserTimeline(screen_name):
    '''
    create by bigzhu at 15/07/04 22:49:04
        用 https://api.twitter.com/1.1/statuses/user_timeline.json 可以取到某个用户的信息
        参看 https://dev.twitter.com/rest/reference/get/statuses/user_timeline
    create by bigzhu at 15/07/04 22:53:09
        考虑使用 http://www.tweepy.org/ 来调用twitter api
    '''
    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)

    api = tweepy.API(auth)
    public_tweets = api.user_timeline(screen_name=screen_name)
    #public_tweets = api.home_timeline()
    # print dir(public_tweets[0])
    for tweet in public_tweets:
        id = saveTwitter(tweet)
        if id is not None:  # 新增加消息
            print 'new=', tweet.text


def saveTwitter(tweet):
    '''
    create by bigzhu at 15/07/10 14:39:48
        保存twitter
    '''

    if hasattr(tweet, 'user'):
        del tweet.user._json
        del tweet.user._api
        tweet.user.entities = json.dumps(tweet.user.entities)

        del tweet.user.id
        db_bz.insertIfNotExist(pg, 'twitter_user', vars(tweet.user), "id_str='%s'" % tweet.user.id_str)
        tweet.user = tweet.user.id_str
        del tweet.user

    if hasattr(tweet, 'author'):
        #del tweet.author.id
        db_bz.insertIfNotExist(pg, 'twitter_user', vars(tweet.author), "id_str='%s'" % tweet.author.id_str)
        tweet.author = tweet.author.id_str

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
    if hasattr(tweet, 'extended_entities'):
        tweet.extended_entities = json.dumps(tweet.extended_entities)
    if hasattr(tweet, 'retweeted_status'):
        saveTwitter(tweet.retweeted_status)
        tweet.retweeted_status = tweet.retweeted_status.id_str
    if hasattr(tweet, 'quoted_status'):
        print tweet.quoted_status
        del tweet.quoted_status
    #    saveTwitter(tweet.quoted_status)
    #    tweet.quoted_status = tweet.quoted_status.id_str

    #for k, v in vars(tweet).items():
    #    print '%s=%s' % (k, v)

    return db_bz.insertIfNotExist(pg, 'twitter_message', vars(tweet), "id_str='%s'" % tweet.id_str)
if __name__ == '__main__':
    getUserTimeline('Cluvmmy')
