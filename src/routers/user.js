const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

// app.post og lign commands er hvad der udgør en restAPI route.
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        const token = await user.generateAuthToken()
        res.send({user, token })
        res.status(201).send(user)
        user.save()
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()//man kan kalde functionen lige hvad man vil, nu har jeg bare kaldt den "generateAuthToken"
        res.send({user, token })
    }catch (e) {
        res.status(400).send()
    }
})
router.get('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    }catch (e) {
        res.status(500).send()
    }
})

//login with own profile with authentication stored in 'auth'
router.get('/users/me', auth, async (req, res) => { // express har noget der hedder route parameters, der giver dig dynamiske værdier til url'en. Efter din primære url, så kan du skrive ":" efterfulgt af hvad end du ønsker at din dynamiske parameter skal være. Den kan f.eks. hedde id, hvis det er id, du ønsker skal være dynamisk.
    res.send(req.user)
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        if (!user) {
            res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({
            error: 'Invalid update'
        })
    }
    try {
        const user = await User.findByIdAndUpdate(req.params.id)
        updates.forEach((update) => user[update] = req.body[update]
        )

        await user.save()

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(400).send()
    }
})

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndRemove(req.params.id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router