const express = require('express')
const app = express()
require('./src/db/mongoose')
const User = require('./src/models/user')
const Tasks = require('./src/models/task')
const userRouter = require('./src/routes/user')
const taskRouter = require('./src/routes/task')
const bcryptjs = require('bcryptjs')
const authMiddleware = require('./src/middleware/authMiddleware')

const port = process.env.PORT || 3000


app.use(express.json())
app.use(userRouter)
app.use(taskRouter)




app.listen(port,()=>{
    console.log(`App Listening on PORT - ${port}`)
})