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
        res.send(users)
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

app.listen(port,()=>{
    console.log(`App Listening on PORT - ${port}`)
})

