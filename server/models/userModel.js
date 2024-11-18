const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
    {
        name: {
            type:String,
        },
        email: {
            type:String,
            unique: true
        },
        password: {
            type:String,
        },

        avatar: { type: String, default: null }, 
        
    }, {
        timestamps: true
    }
)

module.exports = mongoose.model('User', userSchema)