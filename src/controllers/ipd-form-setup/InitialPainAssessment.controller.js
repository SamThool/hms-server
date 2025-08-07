const Activity = require('../../models/Masters/ipd-form-setup/InitialPainAsessment/initialPainAssessment.model.js')


const getAllActivities = async (req, res) => {
    try {
        const activities = await Activity.find();
        res.status(200).json(activities);
    } catch (error) {
        console.error('Error in getIpdFormSetupController:', error);
        res.status(500).json({ error: 'Failed to fetch files' });
    }
}

const addActivity = async (req, res) => {
    try {
        const newActivity=new Activity(req.body);
        const savedActivity=await newActivity.save();
        res.status(201).json(savedActivity);
    } catch (error) {
        console.error('Error in createIpdFormSetupController:', error);
        res.status(400).json({ message:error.message });
    }
}

const editActivity = async (req, res) => {
   try{
    const updatedActivity=await Activity.findByIdAndUpdate(req.params.id,req.body,{new:true});
    if(!updatedActivity){
        return res.status(404).json({message:'Activity not found'});
    }
    res.status(200).json(updatedActivity);
   }catch(error){
    res.status(400).json({message:error.message});
   }
}

const deleteActivity = async (req, res) => {
    try {
       const deletedActivity=await Activity.findByIdAndDelete(req.params.id);
         if(!deletedActivity){
          return res.status(404).json({message:'Activity not found'});
         }
         res.status(200).json({message:'Activity deleted successfully'});
        }catch(error){
            res.status(400).json({message:error.message});
}
}

module.exports = {
    getAllActivities,
    addActivity,
    editActivity,
    deleteActivity
}