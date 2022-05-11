const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/user");
const router = express.Router();

router.post("/users", async (req, res) => {
  // let {name,age,password,email} = req.body
  let user = new User(req.body);
  try {
    await user.save();
  let token = await user.generateAuthToken()
    res.send({user,token});
  } catch (error) {
    res.status(400).send("Error- " + error);
  }
});

//get all users

router.get("/all/users", authMiddleware,async (req, res) => {
  try {
    let users = await User.find({});
    res.status(201).send(users);
  } catch (error) {
    res.status(500).send(`Internal server error ${error}`);
  }
  //comment all the code above and use the below code

  //res.send(req.user)
});
//get user by id

router.get("/user/:id" ,async (req, res) => {
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
    // let user = await User.findByIdAndUpdate(id, req.body, { new: true });
    let user = await User.findById(id)
    if(!user){
      return res.status(400).send("User not found");
    }
    updates.forEach(update=>user[update]=req.body[update])
    await user.save()
    

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


//login
router.post("/users/login",async (req,res)=>{
  //custom method, which will be defined in the model
  try {
  let user = await User.findByCredentials(req.body.email,req.body.password)
  
  let token = await user.generateAuthToken()
  res.send({user,token})
    // res.json({
    //   user,
    //   message:'Login succesful'
    // })
  } catch (error) {
    //console.log(error.message)
    res.status(400).send(error.message) 
  }

})

//logout from one session

router.post('/users/logout',authMiddleware,async (req,res)=>{
  try {
    req.user.tokens = req.user.tokens.filter(element=>element.token!==req.token)
    await req.user.save()
    res.send('Logged out succesfully')
  } catch (error) {
    res.status(500).send(error.message)
  }
})

//logout all session

router.post('/users/logout/allsession',authMiddleware,async (req,res)=>{
  try {
    req.user.tokens=[]
  await req.user.save()
  res.send('Logged out from all the sessions')
  } catch (error) {
    res.status(500).send(error.message)
  }
  
})
module.exports = router;
