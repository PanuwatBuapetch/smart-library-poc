const pool = require('../db/db')

const getUsers = async (req, res) => {

  const result = await pool.query(
    'SELECT * FROM Users'
  )

  res.json(result.rows)
}

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลสมาชิก' });
    }
    // 📝 ต้องแน่ใจว่าส่ง rows[0] ออกไปตรงๆ แบบนี้ เพื่อให้ได้เป็น Object ชิ้นเดียว
    res.json(result.rows[0]); 
    
    // ⚠️ ข้อควรระวัง: ถ้าส่งแค่ res.json(result) หน้าบ้านจะแกะหา id/name ไม่เจอแน่นอนครับ
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createUser = async (req, res) => {

  const { username, name, email, password } = req.body

  const result = await pool.query(
    'INSERT INTO Users(username,name, email, password) VALUES($1,$2,$3,$4) RETURNING *',
    [username, name, email, password]
  )

  res.status(201).json(result.rows[0])
}

const updateUser = async (req, res) => {

  const { id } = req.params

  const { username, name, email, password } = req.body

  const result = await pool.query(
    `
    UPDATE Users
    SET username=$1, name=$2, email=$3, password=$4
    WHERE id=$5
    RETURNING *
    `,
    [username, name, email, password, id]
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
  getUserById,
  createUser,
  updateUser,
  deleteUser
}