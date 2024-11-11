const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    type: {
        type: String,
        enum: ["income", "expense"],
        required: true,
    },
});

module.exports = mongoose.model("Expense", ExpenseSchema);
