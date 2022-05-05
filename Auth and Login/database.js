let mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/db_Users",(err)=>{
    if(err){
        console.log("error while connecting");
    }
    else{
        console.log('connected')
    }
})
let UserSchema=mongoose.Schema({username:{type:String,required:true},password:{type:String,required:true}});
let user=mongoose.model("user",UserSchema);
let findUser=async(obj)=>{
    let result = await user.findOne({username:obj.username}).lean();
    if(result==null)
    return true;
    else 
    return false;
}
module.exports.createUser=async(obj)=>{
    let result =await findUser(obj);
    if(result){
        user.create(obj);
        console.log("created user : ".concat(obj.username))
        return true;
    }
    else{
        console.log("user already exists");
        return false;
    }
}

module.exports.LoginUser=async(obj)=>{
    let result=await user.findOne({username:obj.username,password:obj.password});
    if(result==null){
        console.log('access denied')
        return false;
    }
    else{
        console.log("access granted");
        return true
    }
}

