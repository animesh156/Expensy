const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const app = express();
const expenseRoute = require('./routes/expenseRoute')
const connectDB = require('./config/db')

const port = process.env.PORT

connectDB()

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use('/expense',expenseRoute)

app.listen(port, () => console.log(`server started at ${port}`))