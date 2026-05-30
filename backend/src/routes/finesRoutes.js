const express = require('express')

const router = express.Router()

const {
  getFines,
  getFineById,
  createFine,
  updateFine,
  deleteFine
} = require('../controllers/finesController')

router.get('/', getFines)

router.get('/:id', getFineById)

router.post('/', createFine)

router.put('/:id', updateFine)

router.delete('/:id', deleteFine)

module.exports = router