import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, setBlogs }) => {
  const [visible, setVisible] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showWhenVisible = { display: visible ? '' : 'none' }
  const hideWhenVisible = { display: visible ? 'none' : '' }

  // get username from window.localStorage
  const loggedUserJSON = JSON.parse(window.localStorage.getItem('loggedBlogappUser')).username
  const showIfUser = { display: blog.user.username === loggedUserJSON ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const likeButton = async () => {
    const updatedBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    
    await blogService.update(blog.id, updatedBlog)
    const updatedBlogs = await blogService.getAll()
    setBlogs(updatedBlogs)
  }

  const deleteBlog = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.remove(blog.id)
      const updatedBlogs = await blogService.getAll()
      setBlogs(updatedBlogs)
    }
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible}>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>hide</button>
        <br />
        {blog.url}
        <br />
        likes {blog.likes} <button onClick={likeButton}>like</button>
        <br />
        {blog.user.name}
        <br />
        <button style={showIfUser} onClick={deleteBlog}>remove</button>
      </div>
    </div> 
)}

export default Blog