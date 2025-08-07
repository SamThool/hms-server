const express=require("express");
const RectangularBoxes=express.Router();

const {getAllBoxes,addBoxes,editBoxes,deleteBoxes} = require('../../controllers/ipd-form-setup/rectangularBoxes.controller')


RectangularBoxes.get('/', getAllBoxes)
RectangularBoxes.post('/', addBoxes)
RectangularBoxes.put('/:id', editBoxes)
RectangularBoxes.delete('/:id', deleteBoxes)


module.exports=RectangularBoxes;