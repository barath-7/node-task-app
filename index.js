const express = require('express')
const app = express()
require('./src/db/mongoose')
const User = require('./src/models/user')
const Tasks = require('./src/models/task')

const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users',async (req,res)=>{
    // let {name,age,password,email} = req.body
    let user = new User(req.body)
    try {
        await user.save()
        res.send(user)
    } catch (error) {
        res.status(400).send('Error- '+error)
    }
    
})

app.post('/tasks',async (req,res)=>{
    let task = new Tasks(req.body)

    try {
        await task.save()
        res.send(`Task saved succesfully${task}`)
    } catch (error) {
        res.status(400).send(`Error - ${error}`)
    }
    
})

//get all users

app.get('/all/users',async (req,res)=>{
    try {
        let users = await User.find({})
        res.status(201).send(users)
    } catch (error) {
        res.status(500).send(`Internal server error ${error}`)
    }
    
})
//get user by id

app.get('/user/:id',async (req,res)=>{
    // console.log(req.params.id)
    let id = req.params.id
    
    try {
       let user = await User.findById(id).exec()
       res.send(user)
       console.log(data)
    } catch (error) {
        
    }
})

//update user by id

app.patch('/update/user/:id',async (req,res)=>{
    let updates = Object.keys(req.body)
    let allowedUpdates = ['name','email','age','password']
    let isValidUpdate = updates.every(update=>allowedUpdates.includes(update))
    if(!isValidUpdate){
        return res.status(400).send('Invalid updates')
    }
    
    try {
        let id = req.params.id
        let user = await User.findByIdAndUpdate(id,req.body,{new:true})
        console.log(typeof user)
        console.log(JSON.stringify(user))
        // let user = await User.findByIdAndUpdate(id,{name:name})
        res.status(201).send(user)
    } catch (error) {
        res.status(500).send(`Internal server error ${error}`)
    }
})

//get all tasks

app.get('/all/tasks',async (req,res)=>{
    try {
        let tasks = await Tasks.find({})
        res.send(tasks)
    } catch (error) {
        res.status(500).send(`Internal server error ${error}`)
    }
    
})


//get task by id

app.get('/task/:id',async (req,res)=>{
    // console.log(req.params.id)
    let id = req.params.id
    
    try {
       let task = await Tasks.findById(id).exec()
       res.send(task)
    //    console.log(data)
    } catch (error) {
        
    }
})

//update task by id

app.patch('/update/task/:id',async (req,res)=>{
    let updates = Object.keys(req.body)
    let allowedUpdates = ['description','completed']
    let isValidUpdate = updates.every(update => allowedUpdates.includes(update))
    if(!isValidUpdate){
        return res.status(400).send('Invalid update')
    }

    try {
        let id = req.params.id
        let task = await Tasks.findByIdAndUpdate(id,req.body,{runValidators:true,new:true})
        if(!task){
            res.status(404).send('Task not found')
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.listen(port,()=>{
    console.log(`App Listening on PORT - ${port}`)
})

