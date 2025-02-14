import SkillZone from '../models/SkillZone.js';

// Get all SkillZone entries
export const getSkillZones = async (req, res) => {
  try {
    const skillZones = await SkillZone.find();
    res.json(skillZones);
  } catch (error) {
    console.error('Error fetching SkillZones:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Create new SkillZone entry
export const createSkillZone = async (req, res) => {
  const { name, candidates } = req.body;

  try {
    const newSkillZone = new SkillZone({ name, candidates });
    await newSkillZone.save();
    res.json(newSkillZone);
  } catch (error) {
    console.error('Error creating SkillZone:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Edit an existing SkillZone entry (candidate)
export const updateSkillZoneCandidate = async (req, res) => {
  const { skillZoneId, candidateId } = req.params;
  const { name, reason } = req.body;

  try {
    const skillZone = await SkillZone.findById(skillZoneId);
    if (!skillZone) {
      return res.status(404).json({ message: 'SkillZone not found' });
    }

    const candidate = skillZone.candidates.id(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    candidate.name = name;
    candidate.reason = reason;

    await skillZone.save();
    res.json(skillZone);
  } catch (error) {
    console.error('Error updating SkillZone candidate:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


// Delete candidate from a SkillZone
export const deleteSkillZoneCandidate = async (req, res) => {
  const { skillZoneId, candidateId } = req.params;

  try {
    const skillZone = await SkillZone.findById(skillZoneId);
    if (!skillZone) {
      return res.status(404).json({ message: 'SkillZone not found' });
    }

    skillZone.candidates = skillZone.candidates.filter(
      (candidate) => candidate._id.toString() !== candidateId
    );

    await skillZone.save();
    res.json(skillZone);
  } catch (error) {
    console.error('Error deleting SkillZone candidate:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete an entire SkillZone entry
export const deleteSkillZone = async (req, res) => {
  const { skillZoneId } = req.params;

  try {
    const deletedSkillZone = await SkillZone.findByIdAndDelete(skillZoneId);

    if (!deletedSkillZone) {
      return res.status(404).json({ message: 'SkillZone not found' });
    }

    res.json({ message: 'SkillZone deleted successfully', deletedSkillZone });
  } catch (error) {
    console.error('Error deleting SkillZone:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// module.exports = {
//   getSkillZones,
//   createSkillZone,
//   updateSkillZoneCandidate,
//   deleteSkillZoneCandidate,
//   deleteSkillZone, // export deleteSkillZone function
// };
