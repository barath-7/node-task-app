const mongoose = require("mongoose")

//add email model
//add validation to age
//add validator package

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
    },
    email:{
        type:String,
        required:true,
        trim:true,
    }
})

module.exports = User