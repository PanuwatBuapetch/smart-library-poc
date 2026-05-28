const pool = require('../db/db')

const getBooks = async (req, res) => {

  const result = await pool.query(
    'SELECT * FROM books'
  )

  res.json(result.rows)
}

const createBook = async (req, res) => {

  const { title, author } = req.body

  const result = await pool.query(
    'INSERT INTO books(title, author) VALUES($1,$2) RETURNING *',
    [title, author]
  )

  res.status(201).json(result.rows[0])
}

const updateBook = async (req, res) => {

  const { id } = req.params

  const { title, author, status } = req.body

  const result = await pool.query(
    `
    UPDATE books
    SET title=$1, author=$2, status=$3
    WHERE id=$4
    RETURNING *
    `,
    [title, author, status, id]
  )

  res.json(result.rows[0])
}

const deleteBook = async (req, res) => {

  const { id } = req.params

  await pool.query(
    'DELETE FROM books WHERE id=$1',
    [id]
  )

  res.json({
    message: 'Deleted'
  })
}

module.exports = {
  getBooks,
  createBook,
  updateBook,
  deleteBook
}