#!/usr/bin/env python
# -*- coding: utf-8 -*-
'''
初始化数据库
'''
import model_oper_bz
from peewee import TextField, IntegerField, BooleanField, DateTimeField

from playhouse.postgres_ext import JSONField, BinaryJSONField
import public_bz
import model_bz

project_name = public_bz.getProjectName()
db_name = project_name

class github_message(model_oper_bz.base):
    '''
    create by bigzhu at 15/07/15 17:57:00
    '''
    #id to id_str
    id_str = TextField(null=True)
    type = TextField(null=True)
    actor = IntegerField(null=True) # trans to id
    repo = JSONField(null=True)
    payload = JSONField(null=True)
    public = BooleanField(null=True)
    created_at = DateTimeField(null=True)
    org = JSONField(null=True)
    content = BinaryJSONField(null=True) #整合的内容

class github_user(model_oper_bz.base):
    '''
    create by bigzhu at 15/07/15 18:02:15
    '''
    login = TextField(null=True) #用户名
    #id": 66433,
    avatar_url = TextField(null=True) #头像地址
    gravatar_id = TextField(null=True)
    #url = TextField(null=True) # api取用户信息的地址
    html_url = TextField(null=True) # git项目地址
    #followers_url": "https://api.github.com/users/navy3/followers",
    #following_url": "https://api.github.com/users/navy3/following{/other_user}",
    #gists_url": "https://api.github.com/users/navy3/gists{/gist_id}",
    #starred_url": "https://api.github.com/users/navy3/starred{/owner}{/repo}",
    #subscriptions_url": "https://api.github.com/users/navy3/subscriptions",
    #organizations_url": "https://api.github.com/users/navy3/orgs",
    #repos_url": "https://api.github.com/users/navy3/repos",
    #events_url": "https://api.github.com/users/navy3/events{/privacy}",
    #received_events_url": "https://api.github.com/users/navy3/received_events",
    #type": "User",
    site_admin = BooleanField(null=True)
    name = TextField(null=True)
    company = TextField(null=True)
    blog = TextField(null=True)
    location = TextField(null=True)
    email = TextField(null=True)
    hireable = BooleanField(null=True) #被雇佣了么
    bio = TextField(null=True) #不知道干什么的
    public_repos = IntegerField(null=True) # 公开项目数
    public_gists = IntegerField(null=True)
    followers = IntegerField(null=True)
    following = IntegerField(null=True)
    created_at = DateTimeField(null=True)
    updated_at = DateTimeField(null=True)
    etag = TextField(null=True)


class follow_who(model_oper_bz.base):

    '''
    create by bigzhu at 15/07/14 14:54:27 你要follow谁
    '''
    god_id = IntegerField(null=True)  # 实际上是你要follow的用户的id


class twitter_message(model_oper_bz.base):

    '''
    create by bigzhu at 15/07/08 17:28:57 放twitter的用户的信息

    '''
    quoted_status_id_str = TextField(null=True)
    quoted_status_id = TextField(null=True)
    quoted_status = TextField(null=True)
    retweeted_status = TextField(null=True)  # 转发的消息
    extended_entities = BinaryJSONField(null=True)  # 外部资源,图片啊什么的
    contributors = TextField(null=True)  # ?
    truncated = BooleanField(null=True)  # 是否截取
    text = TextField(null=True)  # 消息内容
    is_quote_status = BooleanField(null=True)  # ?
    in_reply_to_status_id = TextField(null=True)  # ?
    # id
    favorite_count = IntegerField(null=True)
    t_author_id = TextField(null=True)  # 作者详情
    #_json json
    coordinates = TextField(null=True)  # 座标
    entities = TextField(null=True)  # 实体
    in_reply_to_screen_name = TextField(null=True)
    in_reply_to_user_id = TextField(null=True)
    retweet_count = IntegerField(null=True)  # retweet 次数
    id_str = TextField(null=True)
    favorited = BooleanField(null=True)
    source_url = TextField(null=True)
    t_user_id = TextField(null=True)  # 用户详情
    geo = TextField(null=True)
    in_reply_to_user_id_str = TextField(null=True)
    lang = TextField(null=True)
    created_at = DateTimeField(null=True)
    in_reply_to_status_id_str = TextField(null=True)
    place = TextField(null=True)
    source = TextField(null=True)  # 从什么设备发过来的?
    retweeted = BooleanField(null=True)
    possibly_sensitive = BooleanField(null=True)


class twitter_user(model_oper_bz.base):

    '''
    create by bigzhu at 15/07/08 17:39:18 twitter的用户
    '''
    follow_request_sent = BooleanField(null=True)
    has_extended_profile = BooleanField(null=True)
    profile_use_background_image = BooleanField(null=True)
    #_json
    time_zone = TextField(null=True)
    # id
    #_api
    verified = BooleanField(null=True)
    profile_text_color = TextField(null=True)
    profile_image_url_https = TextField(null=True)  # 用户头像
    profile_sidebar_fill_color = TextField(null=True)
    is_translator = BooleanField(null=True)
    geo_enabled = BooleanField(null=True)
    entities = TextField(null=True)
    followers_count = IntegerField(null=True)
    protected = BooleanField(null=True)
    id_str = TextField(null=True)
    default_profile_image = BooleanField(null=True)
    listed_count = IntegerField(null=True)
    lang = TextField(null=True)
    utc_offset = IntegerField(null=True)
    statuses_count = IntegerField(null=True)
    description = TextField(null=True)
    friends_count = IntegerField(null=True)
    profile_link_color = TextField(null=True)
    profile_image_url = TextField(null=True)
    notifications = BooleanField(null=True)
    profile_background_image_url_https = TextField(null=True)
    profile_background_color = TextField(null=True)
    profile_banner_url = TextField(null=True)
    profile_background_image_url = TextField(null=True)
    name = TextField(null=True)
    is_translation_enabled = BooleanField(null=True)
    profile_background_tile = BooleanField(null=True)
    favourites_count = IntegerField(null=True)
    screen_name = TextField(null=True)
    url = TextField(null=True)
    created_at = DateTimeField(null=True)
    contributors_enabled = BooleanField(null=True)
    location = TextField(null=True)
    profile_sidebar_border_color = TextField(null=True)
    default_profile = BooleanField(null=True)
    following = BooleanField(null=True)


if __name__ == '__main__':
    # 需要用户登录模块
    #model_oper_bz.reCreateTable(model_bz.user_info, db_name, user='follow_center', password='follow_center', host='bigzhu.org')
    #model_oper_bz.reCreateAllTable(globals().copy(), db_name, user='follow_center', password='follow_center', host='bigzhu.org')
    #model_oper_bz.reCreateAllTable(globals().copy(), db_name)
    #model_oper_bz.createAllTable(globals().copy(), db_name)
    #model_oper_bz.createAllTable(globals().copy(), db_name)
    #model_oper_bz.reCreateTable(model_bz.user_info, db_name)
    model_oper_bz.reCreateTable(twitter_message, db_name)
