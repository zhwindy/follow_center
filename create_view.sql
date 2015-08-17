    CREATE MATERIALIZED VIEW messages AS
    select * ,ROW_NUMBER() OVER(ORDER BY Id) row_num from (
        select
            ui.user_name,
            m.id,
            'twitter' as m_type,
            m.created_at,
            u.screen_name as name,
            u.profile_image_url_https as avatar,
            null as content,
            m.text,
            m.extended_entities,
            'https://twitter.com/'||u.screen_name||'/status/'||m.id_str as href,
            null as type
                from twitter_message m, twitter_user u, user_info ui
                where m.t_user_id=u.id_str
                and lower(u.screen_name) = lower(ui.twitter)
            union
        select
            ui.user_name,
            m.id,
            'github' as m_type,
            m.created_at,
            u.login as name,
            u.avatar_url as avatar,
            m.content,
            null as text,
            null as extended_entities,
            null as href,
            null as type
                from github_message m, github_user u, user_info ui
                where m.actor=u.id
                and lower(u.login) = lower(ui.github)
            union
        select
            ui.user_name,
            m.id,
            'instagram' as m_type,
            m.created_time as created_at,
            u.username as name,
            u.profile_picture as avatar,
            m.comments as content,
            (m.caption->>'text')::text as text,
            m.standard_resolution as extended_entities,
            m.link as href,
            m.type as type
                from instagram_media m, instagram_user u, user_info ui
                where m.user_id=u.id
                and lower(u.username) = lower(ui.instagram)
            ) as t order by created_at desc;

