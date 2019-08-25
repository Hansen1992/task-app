const express = require('express')
require('./db/mongoose')
const taskRouter = require('./routers/task')
const userRouter = require('./routers/user')
const jwt = require('jsonwebtoken')


const app = express()
const port = process.env.PORT || 3000

/*app.use((req, res, next) => {
 if (req.method === 'GET') {
    res.send('GET requests are disabled')
 } else {
     next()
 }
})*/

/*app.use((req, res, next) => {
    res.status(503).send('Site is currently being maintained')
})*/

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
//creates a token
const myFunction = async () => {
   const token = jwt.sign({ _id: 'bar' }, 'Still learning', {expiresIn: '7 days'})
   console.log(token)

    const data = jwt.verify(token, 'Still learning')
    console.log(data)
}

myFunction()