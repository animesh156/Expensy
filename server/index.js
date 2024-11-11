const express = require('express')
const dotenv = require('dotenv').config()
const app = express();

const port = process.env.PORT

app.get('/',(req,res) => {
    res.send('expense tracker')
})

app.listen(port, () => console.log(`server started at ${port}`))