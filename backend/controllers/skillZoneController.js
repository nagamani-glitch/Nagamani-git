// import SkillZone from '../models/SkillZone.js';

// // Get all SkillZone entries
// export const getSkillZones = async (req, res) => {
//   try {
//     const skillZones = await SkillZone.find();
//     res.json(skillZones);
//   } catch (error) {
//     console.error('Error fetching SkillZones:', error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// // Create new SkillZone entry
// export const createSkillZone = async (req, res) => {
//   const { name, candidates } = req.body;

//   try {
//     const newSkillZone = new SkillZone({ name, candidates });
//     await newSkillZone.save();
//     res.json(newSkillZone);
//   } catch (error) {
//     console.error('Error creating SkillZone:', error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// // Edit an existing SkillZone entry (candidate)
// export const updateSkillZoneCandidate = async (req, res) => {
//   const { skillZoneId, candidateId } = req.params;
//   const { name, reason } = req.body;

//   try {
//     const skillZone = await SkillZone.findById(skillZoneId);
//     if (!skillZone) {
//       return res.status(404).json({ message: 'SkillZone not found' });
//     }

//     const candidate = skillZone.candidates.id(candidateId);
//     if (!candidate) {
//       return res.status(404).json({ message: 'Candidate not found' });
//     }

//     candidate.name = name;
//     candidate.reason = reason;

//     await skillZone.save();
//     res.json(skillZone);
//   } catch (error) {
//     console.error('Error updating SkillZone candidate:', error);
//     res.status(500).json({ message: 'Server Error', error: error.message });
//   }
// };


// // Delete candidate from a SkillZone
// export const deleteSkillZoneCandidate = async (req, res) => {
//   const { skillZoneId, candidateId } = req.params;

//   try {
//     const skillZone = await SkillZone.findById(skillZoneId);
//     if (!skillZone) {
//       return res.status(404).json({ message: 'SkillZone not found' });
//     }

//     skillZone.candidates = skillZone.candidates.filter(
//       (candidate) => candidate._id.toString() !== candidateId
//     );

//     await skillZone.save();
//     res.json(skillZone);
//   } catch (error) {
//     console.error('Error deleting SkillZone candidate:', error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// // Delete an entire SkillZone entry
// export const deleteSkillZone = async (req, res) => {
//   const { skillZoneId } = req.params;

//   try {
//     const deletedSkillZone = await SkillZone.findByIdAndDelete(skillZoneId);

//     if (!deletedSkillZone) {
//       return res.status(404).json({ message: 'SkillZone not found' });
//     }

//     res.json({ message: 'SkillZone deleted successfully', deletedSkillZone });
//   } catch (error) {
//     console.error('Error deleting SkillZone:', error);
//     res.status(500).json({ message: 'Server Error' });
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
  const { name, reason, addedOn } = req.body;
  
  try {
    const skill = await SkillZone.findById(skillId);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    skill.candidates.push({
      name,
      reason,
      addedOn
    });
    
    await skill.save();
    res.status(200).json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Error adding candidate to skill', error });
  }
};

// Update a candidate in a skill
export const updateCandidate = async (req, res) => {
  const { skillId, candidateId } = req.params;
  const { name, reason } = req.body;
  
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
    
    skill.candidates[candidateIndex].name = name;
    skill.candidates[candidateIndex].reason = reason;
    
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


