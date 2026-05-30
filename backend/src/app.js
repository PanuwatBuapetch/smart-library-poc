const express = require('express')
const cors = require('cors')

const bookRoutes = require('./routes/bookRoutes')
const userRoutes = require('./routes/usersRoutes')
const borrowRoutes = require('./routes/borrowRoutes')
const finesRoutes = require('./routes/finesRoutes')
const app = express()

app.use(cors())

app.use(express.json())

app.use('/api/books', bookRoutes)
app.use('/api/users', userRoutes)
app.use('/api/borrows', borrowRoutes)
app.use('/api/fines', finesRoutes)

module.exports = app