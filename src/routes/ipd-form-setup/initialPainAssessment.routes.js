const express=require("express");
const InitialPainAsessment=express.Router();

const {getAllActivities,addActivity,editActivity,deleteActivity} = require('../../controllers/ipd-form-setup/InitialPainAssessment.controller.js')


InitialPainAsessment.get('/', getAllActivities)
InitialPainAsessment.post('/', addActivity)
InitialPainAsessment.put('/:id', editActivity)
InitialPainAsessment.delete('/:id', deleteActivity)



module.exports=InitialPainAsessment;