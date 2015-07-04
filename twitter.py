#!/usr/bin/env python
# -*- coding: utf-8 -*-
'''
create by bigzhu at 15/07/04 22:25:30 取twitter的最新信息
'''
import tweepy
import ConfigParser
config = ConfigParser.ConfigParser()
with open('twitter.ini', 'r') as cfg_file:
    config.readfp(cfg_file)
    consumer_key = config.get('secret', 'consumer_key')
    consumer_secret = config.get('secret', 'consumer_secret')
    access_token = config.get('secret', 'access_token')
    access_token_secret = config.get('secret', 'access_token_secret')


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
    print dir(public_tweets[0])

    for tweet in public_tweets:
        print tweet.text
if __name__ == '__main__':
    getUserTimeline('wwwGUIA')
