// import Feedback from '../models/Feedback.js';

// export const createFeedback = async (req, res) => {
//   try {
//     const feedback = new Feedback(req.body);
//     const savedFeedback = await feedback.save();
//     res.status(201).json(savedFeedback);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const getAllFeedbacks = async (req, res) => {
//   try {
//     const feedbacks = await Feedback.find();
//     const organizedFeedbacks = {
//       selfFeedback: feedbacks.filter(f => f.feedbackType === 'selfFeedback'),
//       requestedFeedback: feedbacks.filter(f => f.feedbackType === 'requestedFeedback'),
//       feedbackToReview: feedbacks.filter(f => f.feedbackType === 'feedbackToReview'),
//       anonymousFeedback: feedbacks.filter(f => f.feedbackType === 'anonymousFeedback')
//     };
//     res.status(200).json(organizedFeedbacks);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const updateFeedback = async (req, res) => {
//   try {
//     const updatedFeedback = await Feedback.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     res.status(200).json(updatedFeedback);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const deleteFeedback = async (req, res) => {
//   try {
//     await Feedback.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: 'Feedback deleted successfully' });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const getFeedbacksByType = async (req, res) => {
//   try {
//     const feedbacks = await Feedback.find({ feedbackType: req.params.type });
//     res.status(200).json(feedbacks);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

import Feedback from '../models/Feedback.js';

export const createFeedback = async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    const savedFeedback = await feedback.save();
    res.status(201).json(savedFeedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    const organizedFeedbacks = {
      selfFeedback: feedbacks.filter(f => f.feedbackType === 'selfFeedback'),
      requestedFeedback: feedbacks.filter(f => f.feedbackType === 'requestedFeedback'),
      feedbackToReview: feedbacks.filter(f => f.feedbackType === 'feedbackToReview'),
      anonymousFeedback: feedbacks.filter(f => f.feedbackType === 'anonymousFeedback')
    };
    res.status(200).json(organizedFeedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFeedback = async (req, res) => {
  try {
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedFeedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getFeedbacksByType = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ feedbackType: req.params.type });
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// New controller methods for enhanced features

export const getFeedbackHistory = async (req, res) => {
  try {
    // In a real implementation, you would fetch history from a separate collection
    // For now, we'll return a mock history
    res.status(200).json({
      history: [
        { 
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          action: 'Created',
          user: 'John Doe',
          details: 'Feedback created'
        },
        {
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          action: 'Updated',
          user: 'Jane Smith',
          details: 'Status changed from Not Started to In Progress'
        },
        {
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          action: 'Comment',
          user: 'Mike Johnson',
          details: 'Please provide more specific examples in your feedback'
        }
      ]
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addFeedbackComment = async (req, res) => {
  try {
    // In a real implementation, you would add the comment to a history collection
    // For now, we'll just return success
    res.status(201).json({ 
      message: 'Comment added successfully',
      comment: {
        date: new Date().toISOString(),
        action: 'Comment',
        user: 'Current User',
        details: req.body.comment
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const setFeedbackReminder = async (req, res) => {
  try {
    // In a real implementation, you would store the reminder in a database
    // For now, we'll just return success
    res.status(201).json({ 
      message: 'Reminder set successfully',
      reminder: req.body
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getFeedbackAnalytics = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    
    const analytics = {
      total: feedbacks.length,
      byStatus: {
        completed: feedbacks.filter(f => f.status === 'Completed').length,
        inProgress: feedbacks.filter(f => f.status === 'In Progress').length,
        notStarted: feedbacks.filter(f => f.status === 'Not Started').length,
        pending: feedbacks.filter(f => f.status === 'Pending').length,
      },
      byType: {
        selfFeedback: feedbacks.filter(f => f.feedbackType === 'selfFeedback').length,
        requestedFeedback: feedbacks.filter(f => f.feedbackType === 'requestedFeedback').length,
        feedbackToReview: feedbacks.filter(f => f.feedbackType === 'feedbackToReview').length,
        anonymousFeedback: feedbacks.filter(f => f.feedbackType === 'anonymousFeedback').length,
      },
      overdue: feedbacks.filter(f => 
        new Date(f.dueDate) < new Date() && f.status !== 'Completed'
      ).length,
      completionRate: feedbacks.length > 0 
        ? ((feedbacks.filter(f => f.status === 'Completed').length / feedbacks.length) * 100).toFixed(1)
        : 0
    };
    
    res.status(200).json(analytics);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

