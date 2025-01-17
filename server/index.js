const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const app = express();
const expenseRoute = require('./routes/expenseRoute')
const userRoute = require('./routes/userRoute')
const connectDB = require('./config/db')
const {protect}  = require('./middleware/authMiddleware')


const port = process.env.PORT

connectDB()

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use('/expense',protect, expenseRoute)
app.use('/user', userRoute)

app.listen(port, () => {
    console.log(`Server started at ${port}`)
})