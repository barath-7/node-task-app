const express = require('express')
const app = express()

const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users',(req,res)=>{
    console.log(req.body)
    res.json(req.body)
})

app.listen(port,()=>{
    console.log(`App Listening on PORT - ${port}`)
})

