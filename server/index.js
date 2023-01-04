require("dotenv").config()
const { db } = require("./utils/database")
const { User } = require("./models/user")
const { Post } = require("./models/post")

const express = require("express")
const cors = require("cors")

const { PORT } = process.env

const { login, register } = require("./controllers/auth")
const {
  getAllPosts,
  getCurrentUserPosts,
  addPost,
  editPost,
  deletePost } = require("./controllers/posts")

const { isAuthenticated } = require("./middleware/isAuthenticated")

const app = express()
app.use(express.json())
app.use(cors())

User.hasMany(Post)
Post.belongsTo(User)

app.post("/register", register)
app.post("/login", login)

app.get("/posts", getAllPosts)

// Auth req'd
app.get("/userposts/:userId", getCurrentUserPosts)
app.post("/posts", isAuthenticated, addPost)
app.put("/posts/:id", isAuthenticated, editPost)
app.delete("/posts/:id", isAuthenticated, deletePost)

// db.sync({ force: true })
db
.sync()
.then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
  })
})