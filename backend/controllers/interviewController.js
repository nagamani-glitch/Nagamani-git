// import Interview from '../models/Interview.js';

// // Create a new interview
// export const createInterview = async (req, res) => {
//   try {
//     const interview = new Interview(req.body);
//     await interview.save();
//     res.status(201).json(interview);
//   } catch (error) {
//     res.status(500).json({ error: 'Error creating interview' });
//   }
// };

// // Get all interviews
// export const getInterviews = async (req, res) => {
//   try {
//     const interviews = await Interview.find();
//     res.json(interviews);
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching interviews' });
//   }
// };

// // Update an interview
// export const updateInterview = async (req, res) => {
//   try {
//     const interview = await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!interview) return res.status(404).json({ error: 'Interview not found' });
//     res.json(interview);
//   } catch (error) {
//     res.status(500).json({ error: 'Error updating interview' });
//   }
// };

// // Delete an interview
// export const deleteInterview = async (req, res) => {
//   try {
//     const interview = await Interview.findByIdAndDelete(req.params.id);
//     if (!interview) return res.status(404).json({ error: 'Interview not found' });
//     res.json({ message: 'Interview deleted' });
//   } catch (error) {
//     res.status(500).json({ error: 'Error deleting interview' });
//   }
// };

import Interview, { interviewSchema } from '../models/Interview.js';
import getModelForCompany from '../models/genericModelFactory.js';

// Create a new interview
export const createInterview = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    // Get company-specific Interview model
    const CompanyInterview = await getModelForCompany(companyCode, 'Interview', interviewSchema);
    
    // Create new interview in company database
    const interview = new CompanyInterview(req.body);
    await interview.save();
    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ error: 'Error creating interview', message: error.message });
  }
};

// Get all interviews
export const getInterviews = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    // Get company-specific Interview model
    const CompanyInterview = await getModelForCompany(companyCode, 'Interview', interviewSchema);
    
    // Get interviews from company database
    const interviews = await CompanyInterview.find();
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching interviews', message: error.message });
  }
};

// Update an interview
export const updateInterview = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    // Get company-specific Interview model
    const CompanyInterview = await getModelForCompany(companyCode, 'Interview', interviewSchema);
    
    // Update interview in company database
    const interview = await CompanyInterview.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!interview) return res.status(404).json({ error: 'Interview not found' });
    res.json(interview);
  } catch (error) {
    res.status(500).json({ error: 'Error updating interview', message: error.message });
  }
};

// Delete an interview
export const deleteInterview = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    // Get company-specific Interview model
    const CompanyInterview = await getModelForCompany(companyCode, 'Interview', interviewSchema);
    
    // Delete interview from company database
    const interview = await CompanyInterview.findByIdAndDelete(req.params.id);
    if (!interview) return res.status(404).json({ error: 'Interview not found' });
    res.json({ message: 'Interview deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting interview', message: error.message });
  }
};
