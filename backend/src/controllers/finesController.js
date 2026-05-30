const pool = require('../db/db')

// 1. ดึงข้อมูลค่าปรับทั้งหมด (เชื่อมโยงดึงชื่อคนยืมและหนังสือผ่าน borrow_id ที่มีอยู่จริงในรูป)
const getFines = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        f.id AS fine_id,
        f.amount,
        f.fine_status,            -- 📝 ใช้ fine_status แทนเนื่องจากมีอยู่จริงในรูป DB
        f.created_at,             -- 📝 ใช้ created_at เป็นตัวบอกเวลารายการ
        f.borrow_id,
        b.borrow_date,
        u.name AS user_name,       -- 👤 ชื่อผู้โดนปรับ
        bk.title AS book_title     -- 📘 ชื่อหนังสือที่ส่งคืนเลท
      FROM fines f
      INNER JOIN borrows b ON f.borrow_id = b.id
      INNER JOIN users u ON b.user_id = u.id
      INNER JOIN books bk ON b.book_id = bk.id
      ORDER BY f.id DESC
    `)
    res.json(result.rows)
  } catch (error) {
    console.error("Error ใน getFines:", error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// 2. ดึงข้อมูลค่าปรับตาม ID
const getFineById = async (req, res) => {
  const { id } = req.params
  try {
    // 📝 ปรับคอลลัมน์ให้ตรงตามดีบีเว่อร์ (id, borrow_id, amount, fine_status)
    const result = await pool.query(
      'SELECT id, borrow_id, amount, fine_status FROM fines WHERE id = $1', 
      [id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลค่าปรับ' }) 
    }
    res.json(result.rows[0])
  } catch (error) {
    console.error("Error ใน getFineById:", error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// 3. สร้างบิลค่าปรับใหม่
const createFine = async (req, res) => {
  // 📝 รับ borrow_id, amount และเปลี่ยนจาก due_date เป็น fine_status เพื่อให้ตรงตามตาราง
  const { borrow_id, amount, fine_status } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO fines (borrow_id, amount, fine_status) VALUES ($1, $2, $3) RETURNING *',
      [borrow_id, amount, fine_status || 'Unpaid'] // ถ้าไม่ส่งมาให้ตั้งเป็น Unpaid อัตโนมัติ
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error("Error ใน createFine:", error)
    res.status(500).json({ error: 'Internal Server Error', details: error.message })
  }
}

// 4. อัปเดตข้อมูลค่าปรับ
const updateFine = async (req, res) => {
  const { id } = req.params
  const { borrow_id, amount, fine_status } = req.body
  try {
    const result = await pool.query(
      `
      UPDATE fines
      SET borrow_id=$1, amount=$2, fine_status=$3
      WHERE id=$4
      RETURNING *
      `,
      [borrow_id, amount, fine_status, id]
    )
    res.json(result.rows[0])
  } catch (error) {
    console.error("Error ใน updateFine:", error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// 5. ลบประวัติค่าปรับ
const deleteFine = async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM fines WHERE id=$1', [id])
    res.json({ message: 'Deleted' })
  } catch (error) {
    console.error("Error ใน deleteFine:", error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

module.exports = {
  getFines,
  getFineById,
  createFine,
  updateFine,
  deleteFine
}