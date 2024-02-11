const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

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

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length)
})

test('unique identifier is named id', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach(blog => {
    expect(blog.id).toBeDefined()
  })
})

describe('a new blog being added', () => {
  test('success with correct token', async () => {
    const newBlog = {
      title: 'This is a new blog',
      author: 'K S',
      url: 'https://www.newblog.com/',
      likes: 11,
    }
    const login = await api
      .post('/api/login')
      .send({
        username: 'root',
        password: 'sekret'
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const token = login.body.token

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
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

  test('missing token returns 401', async () => {
    const newBlog = {
      title: 'This is a new blog',
      author: 'K S',
      url: 'https://www.newblog.com/',
      likes: 11,
    }

    const token = 'sdasd'

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
      .send(newBlog)
      .expect(401)
  })


  test('missing likes property from request defaults to 0', async () => {
    const newBlog = {
      title: 'Blog with no likes property',
      author: 'Unknown',
      url: 'https://www.notitle.com/'
    }
    const login = await api
      .post('/api/login')
      .send({
        username: 'root',
        password: 'sekret'
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const token = login.body.token

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
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
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const login = await api
      .post('/api/login')
      .send({
        username: 'root',
        password: 'sekret'
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const token = login.body.token

    const newBlog = {
      title: 'New blog to be deleted',
      author: 'Unknown',
      url: 'https://www.notitle.com/'
    }
    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs = await Blog.find({})
    const blogToDelete = blogs[blogs.length - 1]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(204)

    const blogsAtEnd = await Blog.find({})
    expect(blogsAtEnd).toHaveLength(initialBlogs.length)

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

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username already exists')

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})