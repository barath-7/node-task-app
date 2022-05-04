const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api');





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
