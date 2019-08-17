const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const UserTask = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

// app.post og lign commands er hvad der udgør en restAPI route.
app.post('/users', (req,res) => {
    const user = new User(req.body)

    user.save().then(() => {
        res.status(201).send(user)
    }).catch((e) => {
        res.status(400).send(e) //Det er meget vigtigt at res.status(400) kommer før send, da det eller ikke vil virke
    })
})

app.get('/users', (req,res) => { // express har noget der hedder route parameters, der giver dig dynamiske værdier til url'en. Efter din primære url, så kan du skrive ":" efterfulgt af hvad end du ønsker at din dynamiske parameter skal være. Den kan f.eks. hedde id, hvis det er id, du ønsker skal være dynamisk.
    User.find({}).then((users) => {
        res.send(users)
    }).catch((e) => {
        res.status(500).send()
    })
})

app.get('/users/:id', (req, res) => {
    const _id = req.params.id

    User.findById(_id).then((user) => {
        if(!user) {
            return res.status(404).send()
        }
        res.send(user)
    }).catch((e) => {
        res.status(500).send()
    })
})
app.post('/tasks', (req,res) => {
    const task = new UserTask(req.body)

    task.save().then(() => {
        res.status(201).send(task)
    }).catch((e) => {
        res.status(400).send(e) //Det er meget vigtigt at res.status(400) kommer før send, da det eller ikke vil virke
    })
})

app.get('/tasks', (req,res) => {
    UserTask.find({}).then((tasks) => {
        res.send(tasks)
    }).catch((e) => {
        res.status(500).send()
    })
})

app.get('/tasks/:id', (req,res) => {
    const _id = req.params.id
    UserTask.findById(_id).then((task) => {
        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    }).catch((e) => {
        res.status(500).send()
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})