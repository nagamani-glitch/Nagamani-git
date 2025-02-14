import Onboarding from '../models/Onboarding.js';
import { sendOnboardingEmail } from '../utils/mailer.js';

// Get all candidates
export const getCandidates = async (req, res) => {
  try {
    const candidates = await Onboarding.find();
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching candidates', error: error.message });
  }
};

// Create new candidate
export const createCandidate = async (req, res) => {
  try {
    const candidateData = {
      name: req.body.name,
      email: req.body.email,
      jobPosition: req.body.jobPosition,
      mobile: req.body.mobile,
      joiningDate: new Date(req.body.joiningDate),
      stage: req.body.stage || 'Test',
      portalStatus: req.body.portalStatus || 'Active',
      taskStatus: req.body.taskStatus || 'Pending'
    };

    const newCandidate = new Onboarding(candidateData);
    const savedCandidate = await newCandidate.save();
    res.status(201).json(savedCandidate);
  } catch (error) {
    console.error('Create Candidate Error:', error);
    res.status(500).json({ message: 'Error creating candidate', error: error.message });
  }
};

// Update candidate
export const updateCandidate = async (req, res) => {
  try {
    const updatedCandidate = await Onboarding.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCandidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.status(200).json(updatedCandidate);
  } catch (error) {
    res.status(500).json({ message: 'Error updating candidate', error: error.message });
  }
};

// Delete candidate
export const deleteCandidate = async (req, res) => {
  try {
    const deletedCandidate = await Onboarding.findByIdAndDelete(req.params.id);
    if (!deletedCandidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.status(200).json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting candidate', error: error.message });
  }
};

// Send email notification
export const sendEmail = async (req, res) => {
    const { email, name, jobPosition, joiningDate } = req.body;
    
    try {
      await sendOnboardingEmail(email, {
        name,
        jobPosition,
        joiningDate: new Date(joiningDate).toLocaleDateString()
      });
      
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Error sending email', error: error.message });
    }
  };


// Filter candidates by stage
export const filterByStage = async (req, res) => {
  try {
    const { stage } = req.query;
    const query = stage === 'All' ? {} : { stage };
    const candidates = await Onboarding.find(query);
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Error filtering candidates', error: error.message });
  }
};
