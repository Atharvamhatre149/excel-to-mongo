const mongoose=require('mongoose');

const candidateSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
    },
    dateOfBirth:{
        type:String,
        required:true
    },
    workExperience:{
        type:String,
        required:true,
    },
    resumeTitle:{
        type:String,
        required:true,
    },
    currentLocation:{
        type:String,
        required:true,
    },
    postalAddress:{
        type:String,
        required:true,
    },
    currentEmployer:String,
    currentDesignation:String, 

});

module.exports=mongoose.model('Candidates',candidateSchema);