const express = require('express')
const cors = require('cors')

const bookRoutes = require('./routes/bookRoutes')
const userRoutes = require('./routes/usersRoutes')
const app = express()

app.use(cors())

app.use(express.json())

app.use('/api/books', bookRoutes)
app.use('/api/users', userRoutes)

module.exports = app