const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'K S',
    url: 'https://www.w3schools.com/html/',
    likes: 0,
  },
  {
    title: 'Test blog',
    author: 'Peacock B',
    url: 'https://testblog.com',
    likes: 7,
  },
  {
    title: 'Hello',
    author: 'Bla Bla',
    url: 'https://www.blabla.com/html/',
    likes: 3,
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)

test('all notes are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length)
}, 100000)

test('unique identifier is named id', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach(blog => {
    expect(blog.id).toBeDefined()
  })
})

test('a new blog post can be added', async () => {
  const newBlog = {
    title: 'This is a new blog',
    author: 'K S',
    url: 'https://www.newblog.com/',
    likes: 11,
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogs = await Blog.find({})
  const blogsAtEnd = blogs.map(blog => blog.toJSON())
  expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)
  const titles = blogsAtEnd.map(b => b.title)
  expect(titles).toContain(
    'This is a new blog'
  )
})

test('missing likes property from request defaults to 0', async () => {
  const newBlog = {
    title: 'Blog with no likes property',
    author: 'Unknown',
    url: 'https://www.notitle.com/'
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const currBlog = await Blog.find({ title: 'Blog with no likes property' })
  expect(currBlog[0].likes).toBe(0)
})

test('missing title or url properties from request returns 400', async () => {
  const newBlogNoTitle = {
    author: 'Peacock B',
    url: 'https://testblog.com',
    likes: 7,
  }
  const newBlogNoURL = {
    title: 'Test blog',
    author: 'Peacock B',
    likes: 7,
  }
  await api
    .post('/api/blogs')
    .send(newBlogNoTitle)
    .expect(400)
  await api
    .post('/api/blogs')
    .send(newBlogNoURL)
    .expect(400)
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await Blog.find({})
    expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).not.toContain(blogToDelete.title)
  })
})

test('a blog post can be updated', async () => {
  const blogsAtStart = await Blog.find({})
  const blogToUpdate = blogsAtStart[0]
  const updatedBlog = {
    title: blogToUpdate.title,
    author: blogToUpdate.author,
    url: blogToUpdate.url,
    likes: 10
  }
  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  const blogsAtEnd = await Blog.find({})
  const updatedBlogAtEnd = blogsAtEnd[0]
  expect(updatedBlogAtEnd.likes).toBe(10)
})

afterAll(async () => {
  await mongoose.connection.close()
})