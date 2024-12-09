const Task = require('../models/task');
const Joi = require('joi');

const taskSchema = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string(),
  status: Joi.string().valid('TODO', 'IN_PROGRESS', 'COMPLETED').default('TODO'),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH'),
  dueDate: Joi.date(),
});

const createTask = async (req, res) => {
  const { error } = taskSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTasks = async (req, res) => {
  const { status, priority, sort, limit, skip } = req.query;
  const query = {};
  if (status) query.status = status;
  if (priority) query.priority = priority;

  try {
    const tasks = await Task.find(query)
      .sort(sort ? { [sort]: 1 } : {})
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateTask = async (req, res) => {
  const { error } = taskSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
