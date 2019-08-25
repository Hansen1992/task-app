require('../src/db/mongoose')
const User = require('../src/models/user')

User.findByIdAndUpdate('5d504a0a8cae572e0807e095', {age: 1}).then((user) => {
    console.log(user)
    return user.countDocuments({age: 1})
}).then((result) => {
    console.log(result)
}).catch((e) => {
    console.log(e)
})