// import SkillZone from '../models/SkillZone.js';

// // Get all skills
// export const getAllSkills = async (req, res) => {
//   try {
//     const skills = await SkillZone.find();
//     res.status(200).json(skills);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching skills', error });
//   }
// };

// // Add a new skill
// export const addSkill = async (req, res) => {
//   const { name, candidates } = req.body;
//   try {
//     const newSkill = new SkillZone({ name, candidates });
//     await newSkill.save();
//     res.status(201).json(newSkill);
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding skill', error });
//   }
// };

// // Add a candidate to a skill
// export const addCandidate = async (req, res) => {
//   const { skillId } = req.params;
//   const { name, reason, addedOn } = req.body;
  
//   try {
//     const skill = await SkillZone.findById(skillId);
//     if (!skill) {
//       return res.status(404).json({ message: 'Skill not found' });
//     }
    
//     skill.candidates.push({
//       name,
//       reason,
//       addedOn
//     });
    
//     await skill.save();
//     res.status(200).json(skill);
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding candidate to skill', error });
//   }
// };

// // Update a candidate in a skill
// export const updateCandidate = async (req, res) => {
//   const { skillId, candidateId } = req.params;
//   const { name, reason } = req.body;
  
//   try {
//     const skill = await SkillZone.findById(skillId);
//     if (!skill) {
//       return res.status(404).json({ message: 'Skill not found' });
//     }
    
//     const candidateIndex = skill.candidates.findIndex(
//       c => c._id.toString() === candidateId
//     );
    
//     if (candidateIndex === -1) {
//       return res.status(404).json({ message: 'Candidate not found' });
//     }
    
//     skill.candidates[candidateIndex].name = name;
//     skill.candidates[candidateIndex].reason = reason;
    
//     await skill.save();
//     res.status(200).json(skill);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating candidate', error });
//   }
// };

// // Delete a candidate from a skill
// export const deleteCandidate = async (req, res) => {
//   const { skillId, candidateId } = req.params;
  
//   try {
//     const skill = await SkillZone.findById(skillId);
//     if (!skill) {
//       return res.status(404).json({ message: 'Skill not found' });
//     }
    
//     skill.candidates = skill.candidates.filter(
//       candidate => candidate._id.toString() !== candidateId
//     );
    
//     await skill.save();
//     res.status(200).json({ message: 'Candidate deleted successfully', skill });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting candidate', error });
//   }
// };

// // Delete a skill
// export const deleteSkill = async (req, res) => {
//   const { skillId } = req.params;
  
//   try {
//     const deletedSkill = await SkillZone.findByIdAndDelete(skillId);
//     if (!deletedSkill) {
//       return res.status(404).json({ message: 'Skill not found' });
//     }
    
//     res.status(200).json({ message: 'Skill deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting skill', error });
//   }
// };

import SkillZone from '../models/SkillZone.js';

// Get all skills
export const getAllSkills = async (req, res) => {
  try {
    const skills = await SkillZone.find();
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching skills', error });
  }
};

// Add a new skill
export const addSkill = async (req, res) => {
  const { name, candidates } = req.body;
  try {
    const newSkill = new SkillZone({ name, candidates });
    await newSkill.save();
    res.status(201).json(newSkill);
  } catch (error) {
    res.status(500).json({ message: 'Error adding skill', error });
  }
};

// Add a candidate to a skill
export const addCandidate = async (req, res) => {
  const { skillId } = req.params;
  const { name, reason, addedOn, employeeId, email, department, designation } = req.body;
  
  try {
    const skill = await SkillZone.findById(skillId);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    // Create candidate object with all fields
    const candidateData = {
      name,
      reason,
      addedOn: addedOn || new Date().toLocaleDateString()
    };
    
    // Only add employee fields if they exist
    if (employeeId) candidateData.employeeId = employeeId;
    if (email) candidateData.email = email;
    if (department) candidateData.department = department;
    if (designation) candidateData.designation = designation;
    
    skill.candidates.push(candidateData);
    
    await skill.save();
    res.status(200).json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Error adding candidate to skill', error });
  }
};

// Update a candidate in a skill
export const updateCandidate = async (req, res) => {
  const { skillId, candidateId } = req.params;
  const { name, reason, employeeId, email, department, designation } = req.body;
  
  try {
    const skill = await SkillZone.findById(skillId);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    const candidateIndex = skill.candidates.findIndex(
      c => c._id.toString() === candidateId
    );
    
    if (candidateIndex === -1) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    
    // Update basic fields
    skill.candidates[candidateIndex].name = name;
    skill.candidates[candidateIndex].reason = reason;
    
    // Update employee fields if provided
    if (employeeId !== undefined) {
      skill.candidates[candidateIndex].employeeId = employeeId;
    }
    
    if (email !== undefined) {
      skill.candidates[candidateIndex].email = email;
    }
    
    if (department !== undefined) {
      skill.candidates[candidateIndex].department = department;
    }
    
    if (designation !== undefined) {
      skill.candidates[candidateIndex].designation = designation;
    }
    
    await skill.save();
    res.status(200).json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Error updating candidate', error });
  }
};

// Delete a candidate from a skill
export const deleteCandidate = async (req, res) => {
  const { skillId, candidateId } = req.params;
  
  try {
    const skill = await SkillZone.findById(skillId);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    skill.candidates = skill.candidates.filter(
      candidate => candidate._id.toString() !== candidateId
    );
    
    await skill.save();
    res.status(200).json({ message: 'Candidate deleted successfully', skill });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting candidate', error });
  }
};

// Delete a skill
export const deleteSkill = async (req, res) => {
  const { skillId } = req.params;
  
  try {
    const deletedSkill = await SkillZone.findByIdAndDelete(skillId);
    if (!deletedSkill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    res.status(200).json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting skill', error });
  }
};

