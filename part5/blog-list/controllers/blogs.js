const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
// const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = request.user
  if (body.title === undefined || body.url === undefined)
    return response.status(400).end()
  if (body.likes === undefined)
    body.likes = 0

  const findUser = await User.findById(user.id)

  const blog = new Blog({
    url: body.url,
    title: body.title,
    author: body.author,
    likes: body.likes,
    user: findUser.id
  })

  const savedBlog = await blog.save()
  findUser.blogs = findUser.blogs.concat(savedBlog._id)
  await findUser.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }
  if (blog.user.toString() !== user.id) {
    return response.status(401).json({ error: 'unauthorized user' })
  }
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }
  const updatedBlog = {
    url: body.url,
    title: body.title,
    author: body.author,
    likes: body.likes
  }
  const updated = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true })
  response.json(updated)
})

module.exports = blogsRouter