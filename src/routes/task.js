const express = require("express");
const Tasks = require('../models/task')
const router = express.Router();

router.post("/tasks", async (req, res) => {
  let task = new Tasks(req.body);

  try {
    await task.save();
    res.send(`Task saved succesfully${task}`);
  } catch (error) {
    res.status(400).send(`Error - ${error}`);
  }
});

//get all tasks

router.get("/all/tasks", async (req, res) => {
  try {
    let tasks = await Tasks.find({});
    res.send(tasks);
  } catch (error) {
    res.status(500).send(`Internal server error ${error}`);
  }
});

//get task by id

router.get("/task/:id", async (req, res) => {
  // console.log(req.params.id)
  let id = req.params.id;

  try {
    let task = await Tasks.findById(id).exec();
    res.send(task);
    //    console.log(data)
  } catch (error) {}
});

//update task by id

router.patch("/update/task/:id", async (req, res) => {
  let updates = Object.keys(req.body);
  let allowedUpdates = ["description", "completed"];
  let isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidUpdate) {
    return res.status(400).send("Invalid update");
  }

  try {
    let id = req.params.id;
    let task = await Tasks.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    if (!task) {
      res.status(404).send("Task not found");
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

//delete task by id

router.delete("/delete/task/:id", async (req, res) => {
  let id = req.params.id;

  try {
    let deletedTask = await Tasks.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).send("Task not found");
    }
    res.send(deletedTask);
  } catch (error) {
    res.status(500).send(error);
  }
});


module.exports = router;