const express = require('express')
const UserTask = require('../models/task')
const router = new express.Router()

router.post('/tasks', async (req, res) => {
    const task = new UserTask(req.body)
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e) //Det er meget vigtigt at res.status(400) kommer før send, da det eller ikke vil virke
    }
})

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await UserTask.find({})
        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const task = await UserTask.findById(_id)
        res.status(201).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({
            error: 'Invalid update'
        })
    }
    try {
        const task = await UserTask.findByIdAndUpdate(req.params.id)
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await UserTask.findByIdAndRemove(req.params.id)
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    }
    catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router