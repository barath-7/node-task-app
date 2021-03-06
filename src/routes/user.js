const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/user");
const router = express.Router();
const multer = require('multer');
const sharp = require("sharp");

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
  // try {
  //   let users = await User.find({});
  //   res.status(201).send(users);
  // } catch (error) {
  //   res.status(500).send(`Internal server error ${error}`);
  // }
  //comment all the code above and use the below code

  res.send(req.user)
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

router.patch("/update/user", authMiddleware,async (req, res) => {
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
    // let user = await User.findById(id)
    let user = req.user
    //console.log(user)
    // if(!user){
    //   return res.status(400).send("User not found");
    // }
    updates.forEach(update=>user[update]=req.body[update])
    await user.save()
    

    // let user = await User.findByIdAndUpdate(id,{name:name})
    res.status(201).send(user);
  } catch (error) {
    res.status(500).send(`Internal server error ${error}`);
  }
});

//delete user by id

router.delete("/delete/user/profile", authMiddleware,async (req, res) => {
  let id = req.params.id;

  try {
    // let deletedUser = await User.findByIdAndDelete(id);
    // if (!deletedUser) {
    //   return res.status(404).send("User not found");
    // }
    // res.send(deletedUser);
    await req.user.remove()
    res.send(req.user)
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

//upload user profile pic

const upload = multer({
    limits:{
      fileSize:1000000
    },
    fileFilter(req,file,cb){
      if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
        return cb(new Error("Only images are allowed"))
      }
      cb(undefined,true)
    }
})
router.post('/user/profile/upload',authMiddleware,upload.single('profile'),async (req,res)=>{
  const buffer = await sharp(req.file.buffer).png().resize({width:250,height:250}).toBuffer()
    req.user.avatar=buffer
    await req.user.save()
    res.send('Profile picture upload succesful')
},(error,req,res,next)=>{
  res.status(400).send({
    error:error.message
  })
})
//delete profile pic
router.delete('/user/profile/delete',authMiddleware,async (req,res)=>{
  if(!req.user.avatar){
    return res.status(400).send("no profile pic found")
  }
req.user.avatar=undefined
await req.user.save()
res.send('Profile pic deleted succesfully !')

})

router.get('/user/:id/profile',async (req,res)=>{
  let id=req.params.id
  try {
  let user = await User.findById({_id:id})

  if(!user || !user.avatar){
    throw new Error('Error while fetching user image')
  }
  res.set('Content-Type','image/png')
  res.send(user.avatar)
    
  } catch (error) {
    return res.status(400).send(error.message)
  }
})
module.exports = router;
