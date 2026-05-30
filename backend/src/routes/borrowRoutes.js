const express = require('express')

const router = express.Router()

const {
  getBorrows,
  getBorrowById,
  createBorrow,
  updateBorrow,
  deleteBorrow
} = require('../controllers/borrowController')

router.get('/', getBorrows)

router.get('/:id', getBorrowById)

router.post('/', createBorrow)

router.put('/:id', updateBorrow)

router.delete('/:id', deleteBorrow)

module.exports = router