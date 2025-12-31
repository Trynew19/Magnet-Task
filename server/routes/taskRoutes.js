const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// Debugging ke liye: Agar ye undefined print hua to controller check karo
console.log("Controller Check:", taskController.getAllTasks); 

router.use(protect); // Ensure protect is a function

router.route('/')
    .get(taskController.getAllTasks) // Line 7: Check if this is defined
    .post(taskController.createTask);

router.route('/:id')
    .get(taskController.getTaskDetails)
    .patch(taskController.updateTask)
    .delete(taskController.deleteTask);

module.exports = router;