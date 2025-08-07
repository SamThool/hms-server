const mongoose=require("mongoose");
const RectangularBox = require('../../models/Masters/ipd-form-setup/InitialPainAsessment/rectangularBoxes.model')


const getAllBoxes = async (req, res) => {
    try {
        const boxes = await RectangularBox.find();
        res.status(200).json(boxes);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch rectangular boxes' });
      }
}

const addBoxes = async (req, res) => {
    try {
      console.log("Received request body:", req.body);
        const { name } = req.body;
        
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        console.log("Received Box Name",name);
        const newBox = new RectangularBox({ name });
        await newBox.save();
        res.status(201).json(newBox);
      } catch (error) {
        res.status(500).json({ error: 'Failed to add rectangular box' });
      }
}
const editBoxes = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  console.log("Name",name);
  console.log("Id is",id,name);
  // Check if the id is a valid ObjectId
 
  try {
    const updatedBox = await RectangularBox.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true } // Ensures schema rules apply
      
    );

    if (!updatedBox) {
      return res.status(404).json({ error: 'Rectangular box not found' });
    }

    res.status(200).json(updatedBox);
  } catch (error) {
    console.error('Error updating rectangular box:', error);

    // Catch duplicate name error
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Box name must be unique' });
    }

    res.status(500).json({ error: 'Failed to update rectangular box' });
  }
};


const deleteBoxes = async (req, res) => {
  console.log("req.params",req.params);
    const { id } = req.params;
    console.log("Id deleteBoxes:",id);
  try {
    const deletedBox = await RectangularBox.findByIdAndDelete(id);
    if (!deletedBox) {
      return res.status(404).json({ error: 'Rectangular box not found' });
    }
    res.status(200).json({ message: 'Rectangular box deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete rectangular box' });
  }
}

module.exports = {
    getAllBoxes,
    addBoxes,
    editBoxes,
    deleteBoxes
}