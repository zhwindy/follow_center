require './style.less'

bz = require '../../lib.coffee'
module.exports =
  template: require('./template.html')
  props: [ 'message']
  computed:
    avatar:->
      return @message.avatar
    repo_url:->
      repo_url = @message.content.repo.url.replace('api.github.com/repos', 'github.com')
      return repo_url
    repo_name:->
      return @message.content.repo.name
    repo_link:->
      repo_link = "<a href='#{@repo_url}' target='_blank'>#{@repo_name}</a>"
      return repo_link
    type:->
      return @message.content.type
    payload:->
      return @message.content.payload
    commits:->
      return @payload.commits
    issue_comment_link:->
      issue_title = @payload['issue']['title']
      issue_comment_url = @payload['comment']['html_url']
      issue_comment_link = "<a target='_blank' href='#{issue_comment_url}' >#{issue_title}</a>"
      return issue_comment_link
    issue_comment_body:->
      return @payload['comment']['body']
