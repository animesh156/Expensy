const express = require('express')
const router = express.Router()
const {getExpense, addExpense, updateExpense, deleteExpense} = require('../controllers/expenseController')


router.get('/', getExpense)
router.post('/', addExpense)
router.put('/:id', updateExpense)
router.delete('/:id', deleteExpense)

module.exports = router