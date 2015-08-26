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


class wechat_dead_line(model_oper_bz.base):

    '''
    记录wechat的超时时间,以决定要不要新建
    '''
    jsapi_ticket = TextField()
    jsapi_ticket_expires_at = DateTimeField()
    access_token = TextField()
    access_token_expires_at = DateTimeField()


class wechat_user(model_oper_bz.base):

    '''
    create by bigzhu at 15/04/04 13:30:57 记录微信用户的信息
    '''

    subscribe = IntegerField()  # 用户是否订阅该公众号标识，值为0时，代表此用户没有关注该公众号，拉取不到其余信息。
    openid = TextField()  # 用户的标识，对当前公众号唯一
    nickname = TextField()  # 用户的昵称
    sex = IntegerField()  # 用户的性别，值为1时是男性，值为2时是女性，值为0时是未知
    city = TextField()  # 用户所在城市
    country = TextField()  # 用户所在国家
    province = TextField()  # 用户所在省份
    language = TextField()  # 用户的语言，简体中文为zh_CN
    headimgurl = TextField(null=True)  # 用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效。
    subscribe_time = IntegerField()  # 用户关注时间，为时间戳。如果用户曾多次关注，则取最后关注时间
    unionid = TextField(null=True)  # 只有在用户将公众号绑定到微信开放平台帐号后，才会出现该字段。详见：获取用户个人信息（UnionID机制）
    remark = TextField()  # 不知道是什么
    groupid = IntegerField()  # 突然出现的
    user_name = TextField(null=True)  # 系统的用户名,用来绑定


class github_message(model_oper_bz.base):

    '''
    create by bigzhu at 15/07/15 17:57:00
    '''
    # id to id_str
    id_str = TextField(null=True)
    type = TextField(null=True)
    actor = IntegerField(null=True)  # trans to id
    repo = JSONField(null=True)
    payload = JSONField(null=True)
    public = BooleanField(null=True)
    created_at = DateTimeField(null=True)
    org = JSONField(null=True)
    content = BinaryJSONField(null=True)  # 整合的内容


class github_user(model_oper_bz.base):

    '''
    create by bigzhu at 15/07/15 18:02:15
    '''
    login = TextField(null=True)  # 用户名
    # id": 66433,
    avatar_url = TextField(null=True)  # 头像地址
    gravatar_id = TextField(null=True)
    # url = TextField(null=True) # api取用户信息的地址
    html_url = TextField(null=True)  # git项目地址
    # followers_url": "https://api.github.com/users/navy3/followers",
    # following_url": "https://api.github.com/users/navy3/following{/other_user}",
    # gists_url": "https://api.github.com/users/navy3/gists{/gist_id}",
    # starred_url": "https://api.github.com/users/navy3/starred{/owner}{/repo}",
    # subscriptions_url": "https://api.github.com/users/navy3/subscriptions",
    # organizations_url": "https://api.github.com/users/navy3/orgs",
    # repos_url": "https://api.github.com/users/navy3/repos",
    # events_url": "https://api.github.com/users/navy3/events{/privacy}",
    # received_events_url": "https://api.github.com/users/navy3/received_events",
    # type": "User",
    site_admin = BooleanField(null=True)
    name = TextField(null=True)
    company = TextField(null=True)
    blog = TextField(null=True)
    location = TextField(null=True)
    email = TextField(null=True)
    hireable = BooleanField(null=True)  # 被雇佣了么
    bio = TextField(null=True)  # 不知道干什么的
    public_repos = IntegerField(null=True)  # 公开项目数
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
    coordinates = BinaryJSONField(null=True)  # 座标
    entities = TextField(null=True)  # 实体
    in_reply_to_screen_name = TextField(null=True)
    in_reply_to_user_id = TextField(null=True)
    retweet_count = IntegerField(null=True)  # retweet 次数
    id_str = TextField(null=True)
    favorited = BooleanField(null=True)
    source_url = TextField(null=True)
    t_user_id = TextField(null=True)  # 用户详情
    geo = BinaryJSONField(null=True)
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


class instagram_user(model_oper_bz.base):
    #"id": "1574083",
    #id_str = TextField()
    #"username": "snoopdogg",
    username = TextField(null=True)
    #"full_name": "Snoop Dogg",
    full_name = TextField(null=True)
    #"profile_picture": "http://distillery.s3.amazonaws.com/profiles/profile_1574083_75sq_1295469061.jpg",
    profile_picture = TextField(null=True)
    #"bio": "This is my bio",
    bio = TextField(null=True)
    #"website": "http://snoopdogg.com",
    website = TextField(null=True)
    #"counts": {
    #    "media": 1320,
    #    "follows": 420,
    #    "followed_by": 3410
    #}
    counts = BinaryJSONField(null=True)
    last_id = TextField(null=True)  # 已经取过的最后一个id


class instagram_media(model_oper_bz.base):
    #'user_has_liked'
    caption = BinaryJSONField(null=True)  # 字幕
    comment_count = IntegerField(null=True)
    comments = BinaryJSONField(null=True)
    created_time = DateTimeField()
    filter = TextField(null=True)

    low_resolution = BinaryJSONField(null=True)
    standard_resolution = BinaryJSONField(null=True)
    thumbnail = BinaryJSONField(null=True)

    id_str = TextField()
    like_count = IntegerField(null=True)
    likes = BinaryJSONField(null=True)
    link = TextField()
    type = TextField()


class last(model_oper_bz.base):

    '''
    记录上次看到的那条message
    '''
    user_id = IntegerField()
    last_time = DateTimeField()
    last_message_id = TextField()


class user_info(model_bz.user_info):

    '''
    create by bigzhu at 15/08/19 09:27:08 增加18+
    '''
    porn = IntegerField()  # 1 荤的，0 素的


if __name__ == '__main__':
    # 需要用户登录模块
    #model_oper_bz.reCreateTable(model_bz.user_info, db_name, user='follow_center', password='follow_center', host='bigzhu.org')
    #model_oper_bz.reCreateAllTable(globals().copy(), db_name, user='follow_center', password='follow_center', host='bigzhu.org')
    #model_oper_bz.reCreateAllTable(globals().copy(), db_name)
    #model_oper_bz.createAllTable(globals().copy(), db_name)
    #model_oper_bz.createAllTable(globals().copy(), db_name)
    #model_oper_bz.reCreateTable(model_bz.user_info, db_name)
    model_oper_bz.reCreateTable(last, db_name)
    #model_oper_bz.reCreateTable(model_bz.user_info, db_name)
