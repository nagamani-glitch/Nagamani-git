// candidateController.js
import Candidate from '../models/candidate.js';

// Add new candidate
export const addCandidate = async (req, res) => {
  try {
    const newCandidate = new Candidate(req.body);
    await newCandidate.save();
    res.status(201).json(newCandidate);
  } catch (error) {
    console.error('Error adding candidate:', error);
    res.status(500).json({ message: 'Error adding candidate' });
  }
};

// Get candidates by recruitment
export const getCandidatesByRecruitment = async (req, res) => {
  try {
    const candidates = await Candidate.find({ recruitment: req.params.recruitment });
    res.status(200).json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ message: 'Error fetching candidates' });
  }
};

// Edit candidate
export const updateCandidate = async (req, res) => {
  try {
    const updatedCandidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCandidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.status(200).json(updatedCandidate);
  } catch (error) {
    console.error('Error updating candidate:', error);
    res.status(500).json({ message: 'Error updating candidate' });
  }
};

// Delete candidate
export const deleteCandidate = async (req, res) => {
  try {
    const deletedCandidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!deletedCandidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.status(200).json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    res.status(500).json({ message: 'Error deleting candidate' });
  }
};
