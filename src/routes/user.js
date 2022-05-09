const express = require("express");
const User = require("../models/user");
const router = express.Router();

router.post("/users", async (req, res) => {
  // let {name,age,password,email} = req.body
  let user = new User(req.body);
  try {
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send("Error- " + error);
  }
});

//get all users

router.get("/all/users", async (req, res) => {
  try {
    let users = await User.find({});
    res.status(201).send(users);
  } catch (error) {
    res.status(500).send(`Internal server error ${error}`);
  }
});
//get user by id

router.get("/user/:id", async (req, res) => {
  // console.log(req.params.id)
  let id = req.params.id;

  try {
    let user = await User.findById(id).exec();
    res.send(user);
    console.log(data);
  } catch (error) {}
});

//update user by id

router.patch("/update/user/:id", async (req, res) => {
  let updates = Object.keys(req.body);
  let allowedUpdates = ["name", "email", "age", "password"];
  let isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidUpdate) {
    return res.status(400).send("Invalid updates");
  }

  try {
    let id = req.params.id;
    let user = await User.findByIdAndUpdate(id, req.body, { new: true });
    console.log(typeof user);
    console.log(JSON.stringify(user));
    // let user = await User.findByIdAndUpdate(id,{name:name})
    res.status(201).send(user);
  } catch (error) {
    res.status(500).send(`Internal server error ${error}`);
  }
});

//delete user by id

router.delete("/delete/user/:id", async (req, res) => {
  let id = req.params.id;

  try {
    let deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).send("User not found");
    }
    res.send(deletedUser);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
