const pool = require('../db/db')

// 1. ดึงข้อมูลรายการยืมทั้งหมด
const getBorrows = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        br.id,
        br.book_id,
        br.user_id,
        br.borrow_date, -- ✨ เปลี่ยนจาก borrow_dat เป็น borrow_date (มี e)
        br.return_date,
        bk.title AS book_title,
        u.name AS user_name
      FROM borrows br
      LEFT JOIN books bk ON br.book_id = bk.id
      LEFT JOIN users u ON br.user_id = u.id
      ORDER BY br.id DESC
    `)
    res.json(result.rows)
  } catch (error) {
    console.error("Error ใน getBorrows:", error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// 2. ดึงข้อมูลรายการเดี่ยวตาม ID
const getBorrowById = async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      // ✨ เปลี่ยนจาก borrow_dat เป็น borrow_date (มี e)
      'SELECT id, book_id, user_id, borrow_date, return_date FROM borrows WHERE id=$1',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Borrow not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error("Error ใน getBorrowById:", error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// 3. สร้างรายการยืมใหม่
const createBorrow = async (req, res) => {
  const { book_id, user_id, borrow_date, return_date } = req.body;

  try {
    // ✨ เปลี่ยนจาก borrow_dat เป็น borrow_date (มี e)
    const result = await pool.query(
      'INSERT INTO borrows (book_id, user_id, borrow_date, return_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [book_id, user_id, borrow_date, return_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("เกิด Error ในฟังก์ชัน createBorrow:", error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// 4. แก้ไขอัปเดตข้อมูลรายการยืม
const updateBorrow = async (req, res) => {
  const { id } = req.params
  const { book_id, user_id, borrow_date, return_date } = req.body

  try {
    // 1. อัปเดตข้อมูลการยืม-คืน ในตาราง borrows ตามปกติก่อน
    const result = await pool.query(
      `
      UPDATE borrows
      SET book_id=$1, user_id=$2, borrow_date=$3, return_date=$4 
      WHERE id=$5
      RETURNING *
      `,
      [book_id, user_id, borrow_date, return_date, id]
    )

    // ✨ 2. ลอจิกเชื่อมโยงตาราง fines อัตโนมัติ (Business Logic สำหรับห้องสอบ)
    const updatedBorrow = result.rows[0];
    const today = new Date(); // วันที่ทำรายการปัจจุบัน (วันที่เอาหนังสือมาคืนจริง)
    const dueDate = new Date(return_date); // วันกำหนดส่งคืนที่บันทึกไว้

    // ถ้า วันที่คืนปัจจุบัน มันเดินเลย วันกำหนดส่ง (DueDate) ไปแล้ว
    if (today > dueDate) {
      // คำนวณหาจำนวนวันที่เลท (แปลงจาก มิลลิวินาที -> เป็นจำนวนวัน)
      const timeDiff = today.getTime() - dueDate.getTime();
      const daysOverdue = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (daysOverdue > 0) {
        const fineRate = 10; // สมมุติค่าปรับ วันละ 10 บาท
        const totalFine = daysOverdue * fineRate;

        // สั่งเชื่อมโยงข้อมูล INSERT บิลค่าปรับข้ามไปตาราง fines ทันที โดยใช้รหัส br.id เป็นคีย์นอก (borrow_id)
        await pool.query(
          'INSERT INTO fines (borrow_id, amount, fine_status) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
          [updatedBorrow.id, totalFine, 'Unpaid']
        );
        console.log(`[Fine System] ตรวจพบการคืนเลท ${daysOverdue} วัน! ทำการออกบิลค่าปรับรหัสยืม #${updatedBorrow.id} จำนวน ${totalFine} บาทเรียบร้อย`);
      }
    }

    // 3. ส่งข้อมูลกลับไปให้หน้าบ้านตามปกติ
    res.json(updatedBorrow)

  } catch (error) {
    console.error("Error ใน updateBorrow:", error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// 5. ลบรายการยืม
const deleteBorrow = async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM borrows WHERE id=$1', [id])
    res.json({ message: 'Deleted' })
  } catch (error) {
    console.error("Error ใน deleteBorrow:", error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

module.exports = {
  getBorrows,
  createBorrow,
  updateBorrow,
  deleteBorrow,
  getBorrowById
}