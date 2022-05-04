const express = require('express')
const app = express()
require('./src/db/mongoose')
const User = require('./src/models/user')

const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users',(req,res)=>{
    // let {name,age,password,email} = req.body
    let user = new User(req.body)
    user.save()
        .then(data=>res.send('Data saved succesfully'))
        .catch(err=>res.send('Error- '+err))
})

app.listen(port,()=>{
    console.log(`App Listening on PORT - ${port}`)
})

