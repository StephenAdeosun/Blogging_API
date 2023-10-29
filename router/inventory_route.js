const express = require('express')
const middleware = require('../middleware/middleware.js')
const controller = require('../controller/controller.js')

const router = express.Router() // create a router object


router.use(middleware.BearerTokenAuth)
router.get('/' , controller.getAllItems)
router.get('/:id',middleware.checkUser, controller.getItemById)
router.post('/', middleware.checkAdmin,  controller.addItem)
router.put('/:id',middleware.checkAdmin, controller.updateItem)
router.delete('/:id', middleware.checkAdmin, controller.deleteItem)

module.exports = router