const controller = require('./task_controller')
const express = require('express')
const editRoute = require('./taskEditRoute')
const deleteRoute = require('./task.delete')
const router = express.Router()
// const { validateToken } = require('../auth/auth_middleware')
const tasksRoute = require('./tasks.get')


router.use('/tasks', tasksRoute);
router.post('/create', controller.createTask)
router.use('/edit', editRoute);
router.use('/delete', deleteRoute);
module.exports = router