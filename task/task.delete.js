const express = require('express');
const deleteRoute = express.Router();
const taskModel = require('../model/TaskModel');

deleteRoute.get('/:id', async(req, res) => {
    try {
        const taskId = req.params.id;
        const taskToEdit = await taskModel.findById(taskId);

        if (!taskToEdit) {
            return res.status(404).json({ error: 'Task not found!' });
        }
        
        res.status(200).render('confirmdelete', {
            title: 'Edit Task',
            task: taskToEdit,
            message: {},
            req: req,
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to edit the task!' })
    }
});

deleteRoute.post('/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const taskToDelete = await taskModel.findById(taskId);

        if (!taskToDelete) {
            return res.status(404).json({ error: 'Task not found!' })
        }

        await taskModel.findByIdAndDelete(taskId);
      
        res.redirect('/tasks')

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete the task!' })
    }
})

module.exports = deleteRoute;