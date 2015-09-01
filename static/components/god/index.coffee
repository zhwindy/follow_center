require './style.less'
module.exports =
  template: require('./template.html')
  props: [ 'god']
  computed:
    twitter_link:->
      if @god.twitter_user
        count = bz.formatCount(@god.twitter_user.followers_count)
        return "
                  <a class='a-icon' target='_blank' href='https://twitter.com/#{@god.twitter}'>
                      <span class='round-icon bg-icon-blue'>
                          <i class='fa fa-twitter'></i>
                      </span>
                  </a>
                  #{count}
        "
      else
        return ''
    github_link:->
      if @god.github_user
        count = bz.formatCount(@god.github_user.followers)
        return "
                  <a class='a-icon' target='_blank' href='https://github.com/#{@god.github}'>
                      <span class='round-icon bg-icon-black'>
                          <i class='fa fa-github'></i>
                      </span>
                  </a>
                  #{count}
        "
      else
        return ''
    instagram_link:->
      if @god.instagram_user
        count = bz.formatCount(@god.instagram_user.counts.followed_by)
        return "
                  <a class='a-icon' target='_blank' href='https://instagram.com/#{@god.instagram}'>
                      <span class='round-icon bg-icon-orange'>
                          <i class='fa fa-instagram'></i>
                      </span>
                  </a>
                #{count}
        "
      else
        return ''
    all_link:->
      return @twitter_link + @github_link + @instagram_link
    description:->
      description = ''
      if @god.slogan
        description = @god.slogan
      else if @god.twitter_user
        description = @god.twitter_user.description
      return description
    avatar:->
      if @god.picture
        avatar_url = @god.picture
      else if @god.github_user
        avatar_url = @god.github_user.avatar_url
      else if @god.instagram_user
        avatar_url = @god.instagram_user.profile_picture
        avatar_url = '/sp/'+ btoa(btoa(avatar_url))
      else if @god.twitter_user
        avatar_url = @god.twitter_user.profile_image_url_https
        avatar_url = '/sp/'+ btoa(btoa(avatar_url))

      return avatar_url

