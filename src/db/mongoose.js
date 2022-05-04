const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api');

//need to add email field to user schema
const User = mongoose.model('User',{
    name :{
        type:String,
        required:true,
        trim:true
    },
    age:{
        type:Number,
        default:0
    },
    password:{
        required:true,
        type:String,
        trim:true,
        minLength:7,
        validate(value){
            if(value.includes(['password'])){
                throw new Error('Enter a different pasword')
            }
        }
    }
})
let user = new User({
    name:'barath',
    age:234,
    password:'password'
})

user.save().then(data=>console.log(data)).catch(err=>console.log('Error-->',err))

const Tasks = mongoose.model('Tasks',{
    description:{
        type:String
    },
    completed:{
        type:Boolean,
        required:false,
        default:false
    }
})

let task = new Tasks({
    description:'Test description',
    completed:true
})

// task.save().then(data=>console.log(data)).catch(err=>console.log('Error-->',err))