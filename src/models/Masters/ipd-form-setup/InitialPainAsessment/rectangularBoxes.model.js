const mongoose=require('mongoose');

const rectangularBoxSchema=new mongoose.Schema({
    name:{type:String,required:true,unique:true},
    createdAt:{type:Date,default:Date.now},
});
module.exports=mongoose.model('RectangularBox',rectangularBoxSchema);