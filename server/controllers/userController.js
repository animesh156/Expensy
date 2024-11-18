const asyncHandler = require('express-async-handler')
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const registerUser = asyncHandler(async (req,res) => {
    const {name, email, password,avatar} = req.body  

    if(!name || !email || !password){
        res.status(400)
        throw new Error('please give required fields')
    }

    const userExits = await User.findOne({email})

    if(userExits){
        res.status(400)
        throw new Error('User already exist') 
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create(
        {
            name,
            email,
            password: hashedPassword,
            avatar
          
        }
    )
     
    if(user){
        res.status(201).json(
            {
                _id: user.id,
                name: user.name,
                email:user.email,
                avatar:user.avatar,
                token: generateToken(user._id)
            }
        )
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }

})

const loginUser = asyncHandler(async (req,res) => {
    const {email, password} = req.body

    const user = await User.findOne({email})
    if(user && (await bcrypt.compare(password, user.password))){
        res.json({
            _id: user.id,
            name:user.name,
            email:user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
})

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn:'30d'
    })
}


module.exports = {
    registerUser,
    loginUser
}