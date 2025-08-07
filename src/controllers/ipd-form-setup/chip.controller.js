const Chip=require("../../models/Masters/ipd-form-setup/InitialPainAsessment/chips.model");


const getAllChips=async(req,res)=>{
    try {
        const chips = await Chip.find().sort({ createdAt: -1 });
        res.json(chips);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}
const createChip = async (req, res) => {
    try {
      const { name } = req.body;
      
      if (!name || !name.trim()) {
        return res.status(400).json({ message: 'Name is required' });
      }
  
      const existingChip = await Chip.findOne({ name: name.trim() });
      if (existingChip) {
        return res.status(409).json({ message: 'Chip with this name already exists' });
      }
      const chip = new Chip({ name: name.trim() });
      await chip.save();
      res.status(201).json(chip);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
const updateChip= async (req, res) => {
    try {
      const chip = await Chip.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(chip);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  const deleteChip=async(req,res)=>{
        try {
          await Chip.findByIdAndDelete(req.params.id);
          res.json({ message: 'Chip deleted' });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
  }
  module.exports={getAllChips,createChip,updateChip,deleteChip}
