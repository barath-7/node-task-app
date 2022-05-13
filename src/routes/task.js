const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Tasks = require('../models/task')
const router = express.Router();

router.post("/tasks",authMiddleware, async (req, res) => {
  // let task = new Tasks(req.body);
  let task = new Tasks({
    ...req.body,
    owner:req.user._id
  });

  try {
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//get all tasks
//changed it to get the tasks created by ech individual user

router.get("/all/tasks", authMiddleware,async (req, res) => {
  try {
    // let tasks = await Tasks.find({});

    let tasks = await Tasks.find({owner:req.user._id});
    res.send(tasks);
    // await req.user.populate('tasks')
    // res.send(req.user.tasks)
  } catch (error) {
    res.status(500).send(`Internal server error ${error}`);
  }
});

//get task by id

router.get("/task/:id", authMiddleware,async (req, res) => {
  // console.log(req.params.id)
  let id = req.params.id;

  try {
    // let task = await Tasks.findById(id).exec();
    let task = await Tasks.findOne({_id:id,owner:req.user._id})
    if(!task){
      return res.status(400).send('No Task found')
    }
    res.send(task);
    //    console.log(data)
  } catch (error) {}
});

//update task by id

router.patch("/update/task/:id",authMiddleware, async (req, res) => {
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
    // let task = await Tasks.findByIdAndUpdate(id, req.body, {
    //   runValidators: true,
    //   new: true,
    // });
    // let task = await Tasks.findById(id)
    let task = await Tasks.findOne({_id:id,owner:req.user._id})
    if (!task) {
      return res.status(404).send("Task not found");
    }
    // console.log(task)
    updates.forEach(update=>task[update]=req.body[update])
    await task.save()
    
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

//delete task by id

router.delete("/delete/task/:id", authMiddleware,async (req, res) => {
  let id = req.params.id;

  try {
    // let deletedTask = await Tasks.findByIdAndDelete(id);
    let deletedTask = await Tasks.findOneAndDelete({_id:id,owner:req.user._id});
    if (!deletedTask) {
      return res.status(404).send("Task not found");
    }
    res.send(deletedTask);
  } catch (error) {
    res.status(500).send(error);
  }
});


module.exports = router;