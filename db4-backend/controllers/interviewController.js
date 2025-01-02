import Interview from '../models/Interview.js';

// Create a new interview
export const createInterview = async (req, res) => {
  try {
    const interview = new Interview(req.body);
    await interview.save();
    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ error: 'Error creating interview' });
  }
};

// Get all interviews
export const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find();
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching interviews' });
  }
};

// Update an interview
export const updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!interview) return res.status(404).json({ error: 'Interview not found' });
    res.json(interview);
  } catch (error) {
    res.status(500).json({ error: 'Error updating interview' });
  }
};

// Delete an interview
export const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findByIdAndDelete(req.params.id);
    if (!interview) return res.status(404).json({ error: 'Interview not found' });
    res.json({ message: 'Interview deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting interview' });
  }
};
