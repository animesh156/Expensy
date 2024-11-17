const Expense = require("../models/expenseModel");
const User = require("../models/userModel");

const getExpense = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addExpense = async (req, res) => {
  const { amount, category, description, type } = req.body;
  const expense = new Expense({
    amount,
    category,
    description,
    type,
    user: req.user.id,
  });

  try {
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateExpense = async (req, res) => {
  //   if(!req.user){
  //     res.status(401)
  //     throw new Error('User not found')
  // }
  // //    make sure logged in user matches goal user
  //   if(.user.toString() !== req.user.id){
  //   res.status(401)
  //   throw new Error('user not authorized')
  //   }

  //   try {
  //     const updatedExpense = await Expense.findByIdAndUpdate(
  //       req.params.id,
  //       req.body,
  //       { new: true }
  //     );
  //     res.json(updatedExpense);
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }

  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    res.status(401);
    throw new Error("Expense not found");
  }

  // check for user
  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }
  //    make sure logged in user matches goal user
  if (expense.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("user not authorized");
  }

  const updatedExpense = await Expense.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  res.json(updateExpense);
};

const deleteExpense = async (req, res) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    res.status(401);
    throw new Error("Expense not found");
  }

  // check for user
  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }
  //    make sure logged in user matches goal user
  if (expense.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("user not authorized");
  }

  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json(`Expense deleted with id ${req.params.id}`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getExpense,
  addExpense,
  updateExpense,
  deleteExpense,
};
