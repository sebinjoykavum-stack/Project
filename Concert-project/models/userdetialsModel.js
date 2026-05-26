const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true, "Name is required"],
        minlength:[3,'Name must be at least 3 characters'],
        maxlength:[30,'Name cannot exceed 30 characteres'],
        trim: true
    },
    email:{
        type: String,
        required:true,
        unique:true, 
        match:[ /^\S+@\S+\.\S+$/,
      "Please enter a valid email"]
    },
    age:{
        type: Number,
        required:true,
        min:[18,"Age must be more than 18"]
    },
    password:{
        type:String,
        required:true,
        minlength:[8,'Password must be more than 8 characters'],
        match:[/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/,
      "Password must be at least 8 characters and include uppercase, lowercase, and special character"]

    },
    Admin:{
        type:Boolean,
        default:false
    }
});
const User = mongoose.model('User',userSchema);
module.exports=User;