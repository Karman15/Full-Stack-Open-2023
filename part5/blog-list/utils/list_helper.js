const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0)
    return {}
  else {
    const favorite_blog = blogs.reduce((max, blog) => max.likes > blog.likes ? max : blog, {})
    return {
      title: favorite_blog.title,
      author: favorite_blog.author,
      likes: favorite_blog.likes
    }
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0)
    return {}
  else {
    const author = _.countBy(blogs, 'author')
    const most_blogs = _.maxBy(_.keys(author), (author) => author)
    return {
      author: most_blogs,
      blogs: author[most_blogs]
    }
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0)
    return {}
  else {
    const authors = _.groupBy(blogs, 'author')
    const author_likes = _.mapValues(authors, (author) => _.sumBy(author, 'likes'))
    const author_most_likes = _.maxBy(_.keys(author_likes), (author) => author)
    return {
      author: author_most_likes,
      likes: author_likes[author_most_likes]
    }
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}