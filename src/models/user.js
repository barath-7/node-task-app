const bcryptjs = require("bcryptjs")
const mongoose = require("mongoose")

//add email model
//add validation to age
//add validator package
const userSchema = new mongoose.Schema({
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


userSchema.statics.findByCredentials = async (email,password)=>{
    let user = await User.findOne({email})
    if(!user){
        throw new Error('User not found')
    }

    let isMatch = await bcryptjs.compare(password,user.password)
    if(!isMatch){
        throw new Error('Invalid password')
    }

    return user;
}
userSchema.pre('save',async function(next){
let user = this
if(user.isModified('password')){
    user.password = await bcryptjs.hash(user.password,8)
}
    next()
})



const User = mongoose.model('User',userSchema)

module.exports = User