import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

// POST - Create a new task
router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;

    // Check if title is provided
    if (!title) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    // Create new task
    const newTask = await Task.create({
      title,
      description,
    });

    res.status(201).json({
      message: "Task created successfully",
      task: newTask,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error creating task",
      error: error.message,
    });
  }
});

// GET - Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();

    res.status(200).json({
      message: "Tasks fetched successfully",
      totalTasks: tasks.length,
      tasks,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching tasks",
      error: error.message,
    });
  }
});
// GET - Get task by ID
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task fetched successfully",
      task,
    });

  } catch (error) {
    res.status(400).json({
      message: "Invalid task ID",
      error: error.message,
    });
  }
});
// PUT - Update a task
router.put("/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });

  } catch (error) {
    res.status(400).json({
      message: "Error updating task",
      error: error.message,
    });
  }
});

// DELETE - Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
      task: deletedTask,
    });

  } catch (error) {
    res.status(400).json({
      message: "Error deleting task",
      error: error.message,
    });
  }
});

export default router;