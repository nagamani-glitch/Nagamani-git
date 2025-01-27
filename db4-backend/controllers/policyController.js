import Policy from '../models/Policy.js';

export const policyController = {
  // Get all policies
  getAllPolicies: async (req, res) => {
    try {
      const policies = await Policy.find().sort({ createdAt: -1 });
      res.status(200).json(policies);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create new policy
  createPolicy: async (req, res) => {
    try {
      const newPolicy = new Policy({
        title: req.body.title,
        content: req.body.content
      });
      const savedPolicy = await newPolicy.save();
      res.status(201).json(savedPolicy);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update policy
  updatePolicy: async (req, res) => {
    try {
      const updatedPolicy = await Policy.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          updatedAt: Date.now()
        },
        { new: true }
      );
      if (!updatedPolicy) {
        return res.status(404).json({ message: 'Policy not found' });
      }
      res.status(200).json(updatedPolicy);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete policy
  deletePolicy: async (req, res) => {
    try {
      const deletedPolicy = await Policy.findByIdAndDelete(req.params.id);
      if (!deletedPolicy) {
        return res.status(404).json({ message: 'Policy not found' });
      }
      res.status(200).json({ message: 'Policy deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};
