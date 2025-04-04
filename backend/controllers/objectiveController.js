import Objective from '../models/objective.js';

export const getObjectives = async (req, res) => {
  try {
    const { searchTerm, objectiveType, archived } = req.query;
    const filter = {};

    if (searchTerm) {
      filter.title = { $regex: searchTerm, $options: 'i' };
    }

    if (objectiveType) {
      filter.objectiveType = objectiveType;
    }

    if (archived !== undefined) {
      filter.archived = archived === 'true';
    }

    const objectives = await Objective.find(filter);
    res.status(200).json(objectives);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createObjective = async (req, res) => {
  try {
    const objective = new Objective(req.body);
    const savedObjective = await objective.save();
    res.status(201).json(savedObjective);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateObjective = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedObjective = await Objective.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!updatedObjective) {
      return res.status(404).json({ message: 'Objective not found' });
    }
    res.status(200).json(updatedObjective);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteObjective = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedObjective = await Objective.findByIdAndDelete(id);
    if (!deletedObjective) {
      return res.status(404).json({ message: 'Objective not found' });
    }
    res.status(200).json({ message: 'Objective deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// export const toggleArchive = async (req, res) => {
//     try {
//       const { id } = req.params;
//       const objective = await Objective.findById(id);
      
//       if (!objective) {
//         return res.status(404).json({ message: 'Objective not found' });
//       }
      
//       objective.archived = !objective.archived;
//       const updatedObjective = await objective.save();
//       res.status(200).json(updatedObjective);
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   };

export const toggleArchive = async (req, res) => {
  try {
    const { id } = req.params;
    const objective = await Objective.findById(id);
    
    if (!objective) {
      return res.status(404).json({ message: 'Objective not found' });
    }
    
    objective.archived = !objective.archived;
    const updatedObjective = await objective.save();
    
    res.status(200).json(updatedObjective);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
  
