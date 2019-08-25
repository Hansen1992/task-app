const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
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
            if (value.toLowerCase().includes('password')) {
                throw new Error('your password is not allowed to be named "password"')
            }
        }
    },
    email: {
        type: String,
        unique: true, //denne gør, at alle emailsne i din database skal være unikke, så de samme brugere ikke kan dannes ud fra den samme email. Det kræver dog, at databasen skal slettes og etableres på ny, før "unique" kan fungere. Det er derfor godt at sætte denne som en af de første ting i din kode.
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('You must enter a valid email') //this is how you use the npm validator
            }
        }
    },
    age: {
        type: Number,
        default: 0, //if the age is not typed in, the default value for the user will be shown as zero.
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({
        _id: user._id.toString()
    }, 'Still learning')

    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({
        email
    })

    if (!user) {
        throw new Error('unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('unable to login')
    }
    return user
} //du kan navngive "findByCredentials" lige hvad du vil, nu har jeg bare skrevet noget, der giver mening for den function, som den skal udføre

//hash the plane text password
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8) // her tager jeg mit plane password og hasher det med en længde på 8, 
        //da 8 er godt i forhold til, at det er svært at knække og samtidig bliver app'en ikke alt for langsom.
        //Når man bruger det her middleware, så skal vi også kun skrive koden her ét sted og nu virker det, når man opdaterer og laver en ny bruger
    }
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User