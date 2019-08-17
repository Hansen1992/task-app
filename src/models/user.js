const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true, //dette er sanitization. Det betyder, at hvis du i mongoose benytter 'required', så SKAL der skrives et navn, når du opretter en user.
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error('your password is not allowed to be named "password"')
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error ('You must enter a valid email') //this is how you use the npm validator
            }
        }
    },
    age: {
        type: Number,
        default: 0, //if the age is not typed in, the default value for the user will be shown as zero.
        validate(value) {
            if(value <0) {
                throw new Error('Age must be a positive number')
            }
        }
    }
})

module.exports = User