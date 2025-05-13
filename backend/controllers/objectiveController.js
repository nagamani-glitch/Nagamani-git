// import Objective from '../models/objective.js';

// export const getObjectives = async (req, res) => {
//   try {
//     const { searchTerm, objectiveType, archived, userId } = req.query;
//     const filter = {};

//     if (searchTerm) {
//       filter.title = { $regex: searchTerm, $options: 'i' };
//     }

//     if (objectiveType) {
//       filter.objectiveType = objectiveType;
//     }

//     if (archived !== undefined) {
//       filter.archived = archived === 'true';
//     }
    
//     // If userId is provided, handle filtering based on objectiveType
//     if (userId) {
//       if (objectiveType === "self") {
//         // For self tab: only show self objectives of the current user
//         filter.userId = userId;
//         filter.objectiveType = "self";
//       } else {
//         // For all tab: show all team objectives and only the current user's self objectives
//         filter.$or = [
//           { objectiveType: "all" },
//           { objectiveType: "self", userId: userId }
//         ];
//       }
//     }

//     const objectives = await Objective.find(filter);
//     res.status(200).json(objectives);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const createObjective = async (req, res) => {
//   try {
//     const objective = new Objective(req.body);
//     const savedObjective = await objective.save();
//     res.status(201).json(savedObjective);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const updateObjective = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedObjective = await Objective.findByIdAndUpdate(
//       id,
//       req.body,
//       { new: true }
//     );
//     if (!updatedObjective) {
//       return res.status(404).json({ message: 'Objective not found' });
//     }
//     res.status(200).json(updatedObjective);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const deleteObjective = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedObjective = await Objective.findByIdAndDelete(id);
//     if (!deletedObjective) {
//       return res.status(404).json({ message: 'Objective not found' });
//     }
//     res.status(200).json({ message: 'Objective deleted successfully' });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const toggleArchive = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const objective = await Objective.findById(id);
    
//     if (!objective) {
//       return res.status(404).json({ message: 'Objective not found' });
//     }
    
//     objective.archived = !objective.archived;
//     const updatedObjective = await objective.save();
    
//     res.status(200).json(updatedObjective);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Add a new controller method to get objectives by userId
// export const getObjectivesByUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
    
//     if (!userId) {
//       return res.status(400).json({ message: 'User ID is required' });
//     }
    
//     const objectives = await Objective.find({ userId });
//     res.status(200).json(objectives);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

import Objective, { objectiveSchema } from '../models/objective.js';
import getModelForCompany from '../models/genericModelFactory.js';

export const getObjectives = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Fetching objectives for company: ${companyCode}`);
    
    // Get company-specific Objective model
    const CompanyObjective = await getModelForCompany(companyCode, 'Objective', objectiveSchema);
    
    const { searchTerm, objectiveType, archived, userId } = req.query;
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
    
    // If userId is provided, handle filtering based on objectiveType
    if (userId) {
      if (objectiveType === "self") {
        // For self tab: only show self objectives of the current user
        filter.userId = userId;
        filter.objectiveType = "self";
      } else {
        // For all tab: show all team objectives and only the current user's self objectives
        filter.$or = [
          { objectiveType: "all" },
          { objectiveType: "self", userId: userId }
        ];
      }
    }

    const objectives = await CompanyObjective.find(filter);
    res.status(200).json(objectives);
  } catch (error) {
    console.error('Error fetching objectives:', error);
    res.status(500).json({ 
      error: 'Error fetching objectives', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const createObjective = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Creating objective for company: ${companyCode}`);
    
    // Get company-specific Objective model
    const CompanyObjective = await getModelForCompany(companyCode, 'Objective', objectiveSchema);
    
    // Validate required fields
    const { title, duration, description, objectiveType } = req.body;
    if (!title || !duration || !description || !objectiveType) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Missing required fields: title, duration, description, and objectiveType are required'
      });
    }
    
    // Create new objective in company database
    const objective = new CompanyObjective(req.body);
    const savedObjective = await objective.save();
    
    console.log(`Objective created successfully: ${savedObjective.title}`);
    res.status(201).json(savedObjective);
  } catch (error) {
    console.error('Error creating objective:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        message: error.message,
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(400).json({ 
      error: 'Error creating objective', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const updateObjective = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ 
        error: 'Invalid request', 
        message: 'Objective ID is required' 
      });
    }
    
    console.log(`Updating objective ${id} for company: ${companyCode}`);
    
    // Get company-specific Objective model
    const CompanyObjective = await getModelForCompany(companyCode, 'Objective', objectiveSchema);
    
    // Update objective in company database with validation
    const updatedObjective = await CompanyObjective.findByIdAndUpdate(
      id,
      req.body,
      { 
        new: true,
        runValidators: true // This ensures validation runs on update
      }
    );
    
    if (!updatedObjective) {
      return res.status(404).json({ 
        error: 'Objective not found',
        message: `No objective found with ID: ${id}`
      });
    }
    
    console.log(`Objective ${id} updated successfully`);
    res.status(200).json(updatedObjective);
  } catch (error) {
    console.error(`Error updating objective ${req.params.id}:`, error);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        message: error.message,
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'The provided objective ID is not valid'
      });
    }
    
    res.status(400).json({ 
      error: 'Error updating objective', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const deleteObjective = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ 
        error: 'Invalid request', 
        message: 'Objective ID is required' 
      });
    }
    
    console.log(`Deleting objective ${id} for company: ${companyCode}`);
    
    // Get company-specific Objective model
    const CompanyObjective = await getModelForCompany(companyCode, 'Objective', objectiveSchema);
    
    // Delete objective from company database
    const deletedObjective = await CompanyObjective.findByIdAndDelete(id);
    
    if (!deletedObjective) {
      return res.status(404).json({ 
        error: 'Objective not found',
        message: `No objective found with ID: ${id}`
      });
    }
    
    console.log(`Objective ${id} deleted successfully`);
    res.status(200).json({ message: 'Objective deleted successfully' });
  } catch (error) {
    console.error(`Error deleting objective ${req.params.id}:`, error);
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'The provided objective ID is not valid'
      });
    }
    
    res.status(400).json({ 
      error: 'Error deleting objective', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const toggleArchive = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ 
        error: 'Invalid request', 
        message: 'Objective ID is required' 
      });
    }
    
    console.log(`Toggling archive status for objective ${id} for company: ${companyCode}`);
    
    // Get company-specific Objective model
    const CompanyObjective = await getModelForCompany(companyCode, 'Objective', objectiveSchema);
    
    // Find the objective
    const objective = await CompanyObjective.findById(id);
    
    if (!objective) {
      return res.status(404).json({ 
        error: 'Objective not found',
        message: `No objective found with ID: ${id}`
      });
    }
    
    // Toggle the archived status
    objective.archived = !objective.archived;
    const updatedObjective = await objective.save();
    
    console.log(`Objective ${id} archive status toggled to ${updatedObjective.archived}`);
    res.status(200).json(updatedObjective);
  } catch (error) {
    console.error(`Error toggling archive for objective ${req.params.id}:`, error);
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'The provided objective ID is not valid'
      });
    }
    
    res.status(400).json({ 
      error: 'Error toggling archive status', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Continuing the getObjectivesByUser function
export const getObjectivesByUser = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    console.log(`Fetching objectives for user ${userId} in company: ${companyCode}`);
    
    // Get company-specific Objective model
    const CompanyObjective = await getModelForCompany(companyCode, 'Objective', objectiveSchema);
    
    // Find objectives for this user
    const objectives = await CompanyObjective.find({ userId });
    
    res.status(200).json(objectives);
  } catch (error) {
    console.error(`Error fetching objectives for user ${req.params.userId}:`, error);
    
    res.status(500).json({ 
      error: 'Error fetching objectives by user', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

