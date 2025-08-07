const express=require("express");
const ChipRouter=express.Router();

const {getAllChips,createChip,updateChip,deleteChip}=require("../../controllers/ipd-form-setup/chip.controller")


ChipRouter.get('/',getAllChips);
ChipRouter.post('/', createChip);
ChipRouter.put('/:id', updateChip);
ChipRouter.delete('/:id',deleteChip);

module.exports=ChipRouter;