const Task = require('../models/Task');
const catchAsync = require('../error/catchAsync');
const AppError = require('../error/AppError');

exports.getAllTasks = catchAsync(async (req, res, next) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;

    // Filter logic: Check if user is creator OR user ID exists in assignedTo array
    const filter = { 
        $or: [ 
            { user: req.user.id }, 
            { assignedTo: { $in: [req.user.id] } } // $in array ke liye use hota hai
        ] 
    };

    const tasks = await Task.find(filter) 
        .populate('assignedTo', 'name') 
        .sort('-createdAt')
        .skip(skip)
        .limit(limit);

    // FIX: totalTasks bhi wahi count hone chahiye jo user dekh sakta hai
    const totalTasks = await Task.countDocuments(filter);

    res.status(200).json({
        status: 'success',
        results: tasks.length,
        total: totalTasks,
        currentPage: page,
        data: tasks
    });
});

exports.createTask = catchAsync(async (req, res, next) => {
  const { title, description, dueDate, priority, assignedTo } = req.body;

  // Requirement Check: Title hona zaroori hai
  if (!title) return next(new AppError('Task title is required!', 400));

  const newTask = await Task.create({
    title,
    description,
    dueDate,
    priority,
    user: req.user.id, // Creator ID
    // Logic: Agar assignedTo ek single string (ID) hai toh use array bana do, 
    // agar pehle se array hai toh wahi rehne do. Agar khali hai toh khud ko assign karo.
    assignedTo: Array.isArray(assignedTo) 
      ? assignedTo 
      : assignedTo ? [assignedTo] : [req.user.id]
  });

  res.status(201).json({ status: 'success', data: newTask });
});

exports.updateTask = catchAsync(async (req, res, next) => {
    const task = await Task.findOneAndUpdate(
        {
            _id: req.params.id,
            $or: [{ user: req.user.id }, { assignedTo: req.user.id }]
        },
        req.body,
        { new: true, runValidators: true }
    );

    if (!task) return next(new AppError('Unauthorized to update this task', 404));
    res.status(200).json({ status: 'success', data: task });
});

// 4. Delete Task (With Owner check)
exports.deleteTask = catchAsync(async (req, res, next) => {
    const task = await Task.findOneAndDelete({
        _id: req.params.id,
        $or: [{ user: req.user.id }, { assignedTo: req.user.id }]
    });

    if (!task) return next(new AppError('Unauthorized to delete this task', 404));
    res.status(204).json({ status: 'success', data: null });
});

// 5. Get Single Task Details
exports.getTaskDetails = catchAsync(async (req, res, next) => {
    const task = await Task.findOne({
        _id: req.params.id,
        $or: [
            { user: req.user.id },       // Jisne banaya
            { assignedTo: req.user.id }  // Jise assign hua (Arjun)
        ]
    }).populate('assignedTo', 'name');

    if (!task) return next(new AppError('Task not found or unauthorized', 404));
    res.status(200).json({ status: 'success', data: task });
});