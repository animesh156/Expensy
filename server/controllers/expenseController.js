const Expense = require("../models/expenseModel");

const getExpense = async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addExpense = async (req, res) => {
  const { amount, category, description, type } = req.body;
  const expense = new Expense({ amount, category, description, type });

  try {
    await expense.save(); 
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateExpense = async (req, res) => {
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json(`Expense deleted with id ${req.params.id}`);
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getExpense,
  addExpense,
  updateExpense,
  deleteExpense,
};
