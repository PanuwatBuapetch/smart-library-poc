const pool = require('../db/db')

const getUsers = async (req, res) => {

  const result = await pool.query(
    'SELECT * FROM Users'
  )

  res.json(result.rows)
}

const createUser = async (req, res) => {

  const { username, email, password } = req.body

  const result = await pool.query(
    'INSERT INTO Users(username, email, password) VALUES($1,$2,$3) RETURNING *',
    [username, email, password]
  )

  res.status(201).json(result.rows[0])
}

const updateUser = async (req, res) => {

  const { id } = req.params

  const { username, email, password } = req.body

  const result = await pool.query(
    `
    UPDATE Users
    SET username=$1, email=$2, password=$3
    WHERE id=$4
    RETURNING *
    `,
    [username, email, password, id]
  )

  res.json(result.rows[0])
}

const deleteUser = async (req, res) => {

  const { id } = req.params

  await pool.query(
    'DELETE FROM Users WHERE id=$1',
    [id]
  )

  res.json({
    message: 'Deleted'
  })
}

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser
}