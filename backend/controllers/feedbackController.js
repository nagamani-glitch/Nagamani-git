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

// // New controller methods for enhanced features

// export const getFeedbackHistory = async (req, res) => {
//   try {
//     // In a real implementation, you would fetch history from a separate collection
//     // For now, we'll return a mock history
//     res.status(200).json({
//       history: [
//         { 
//           date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
//           action: 'Created',
//           user: 'John Doe',
//           details: 'Feedback created'
//         },
//         {
//           date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
//           action: 'Updated',
//           user: 'Jane Smith',
//           details: 'Status changed from Not Started to In Progress'
//         },
//         {
//           date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
//           action: 'Comment',
//           user: 'Mike Johnson',
//           details: 'Please provide more specific examples in your feedback'
//         }
//       ]
//     });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const addFeedbackComment = async (req, res) => {
//   try {
//     // In a real implementation, you would add the comment to a history collection
//     // For now, we'll just return success
//     res.status(201).json({ 
//       message: 'Comment added successfully',
//       comment: {
//         date: new Date().toISOString(),
//         action: 'Comment',
//         user: 'Current User',
//         details: req.body.comment
//       }
//     });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const setFeedbackReminder = async (req, res) => {
//   try {
//     // In a real implementation, you would store the reminder in a database
//     // For now, we'll just return success
//     res.status(201).json({ 
//       message: 'Reminder set successfully',
//       reminder: req.body
//     });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const getFeedbackAnalytics = async (req, res) => {
//   try {
//     const feedbacks = await Feedback.find();
    
//     const analytics = {
//       total: feedbacks.length,
//       byStatus: {
//         completed: feedbacks.filter(f => f.status === 'Completed').length,
//         inProgress: feedbacks.filter(f => f.status === 'In Progress').length,
//         notStarted: feedbacks.filter(f => f.status === 'Not Started').length,
//         pending: feedbacks.filter(f => f.status === 'Pending').length,
//       },
//       byType: {
//         selfFeedback: feedbacks.filter(f => f.feedbackType === 'selfFeedback').length,
//         requestedFeedback: feedbacks.filter(f => f.feedbackType === 'requestedFeedback').length,
//         feedbackToReview: feedbacks.filter(f => f.feedbackType === 'feedbackToReview').length,
//         anonymousFeedback: feedbacks.filter(f => f.feedbackType === 'anonymousFeedback').length,
//       },
//       overdue: feedbacks.filter(f => 
//         new Date(f.dueDate) < new Date() && f.status !== 'Completed'
//       ).length,
//       completionRate: feedbacks.length > 0 
//         ? ((feedbacks.filter(f => f.status === 'Completed').length / feedbacks.length) * 100).toFixed(1)
//         : 0
//     };
    
//     res.status(200).json(analytics);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

import Feedback from '../models/Feedback.js';

export const createFeedback = async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    
    // Add initial history entry
    feedback.history = [{
      date: new Date(),
      action: 'Created',
      user: req.body.createdBy || 'System', // In a real app, this would come from auth
      details: 'Feedback created'
    }];
    
    const savedFeedback = await feedback.save();
    res.status(201).json(savedFeedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllFeedbacks = async (req, res) => {
  try {
    // Extract query parameters
    const { 
      searchTerm, 
      status, 
      employee, 
      manager, 
      startDate, 
      endDate, 
      priority, 
      period,
      sortBy = 'createdAt',
      sortDirection = 'desc',
      page = 1,
      limit = 10
    } = req.query;
    
    // Build query
    let query = {};
    
    if (searchTerm) {
      query.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { 'employee.name': { $regex: searchTerm, $options: 'i' } },
        { employee: { $regex: searchTerm, $options: 'i' } },
        { 'manager.name': { $regex: searchTerm, $options: 'i' } },
        { manager: { $regex: searchTerm, $options: 'i' } }
      ];
    }
    
    if (status) query.status = status;
    if (employee) {
      query.$or = query.$or || [];
      query.$or.push(
        { 'employee.name': { $regex: employee, $options: 'i' } },
        { employee: { $regex: employee, $options: 'i' } }
      );
    }
    if (manager) {
      query.$or = query.$or || [];
      query.$or.push(
        { 'manager.name': { $regex: manager, $options: 'i' } },
        { manager: { $regex: manager, $options: 'i' } }
      );
    }
    if (startDate) query.startDate = { $gte: new Date(startDate) };
    if (endDate) query.dueDate = { $lte: new Date(endDate) };
    if (priority) query.priority = priority;
    if (period) query.period = period;
    
    // Count total documents for pagination
    const total = await Feedback.countDocuments(query);
    
    // Execute query with pagination and sorting
    const feedbacks = await Feedback.find(query)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    // Organize by feedback type
    const organizedFeedbacks = {
      selfFeedback: feedbacks.filter(f => f.feedbackType === 'selfFeedback'),
      requestedFeedback: feedbacks.filter(f => f.feedbackType === 'requestedFeedback'),
      feedbackToReview: feedbacks.filter(f => f.feedbackType === 'feedbackToReview'),
      anonymousFeedback: feedbacks.filter(f => f.feedbackType === 'anonymousFeedback')
    };
    
    // Set pagination headers
    res.set('X-Total-Count', total);
    res.set('X-Page', page);
    res.set('X-Limit', limit);
    res.set('X-Total-Pages', Math.ceil(total / limit));
    
    res.status(200).json(organizedFeedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Get the current feedback to track changes
    const currentFeedback = await Feedback.findById(id);
    if (!currentFeedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    // Track history if status changed
    if (updateData.status && updateData.status !== currentFeedback.status) {
      const historyEntry = {
        date: new Date(),
        action: 'Updated',
        user: updateData.updatedBy || 'System', // In a real app, this would come from auth
        details: `Status changed from ${currentFeedback.status} to ${updateData.status}`
      };
      
      updateData.history = [...currentFeedback.history, historyEntry];
    }
    
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    res.status(200).json(updatedFeedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findById(id);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    await Feedback.findByIdAndDelete(id);
    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getFeedbacksByType = async (req, res) => {
  try {
    const { type } = req.params;
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortDirection = 'desc'
    } = req.query;
    
    // Count total documents for pagination
    const total = await Feedback.countDocuments({ feedbackType: type });
    
    // Execute query with pagination and sorting
    const feedbacks = await Feedback.find({ feedbackType: type })
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    // Set pagination headers
    res.set('X-Total-Count', total);
    res.set('X-Page', page);
    res.set('X-Limit', limit);
    res.set('X-Total-Pages', Math.ceil(total / limit));
    
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getFeedbackHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findById(id);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    res.status(200).json({ history: feedback.history || [] });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addFeedbackComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, user } = req.body;
    
    if (!comment) {
      return res.status(400).json({ message: 'Comment is required' });
    }
    
    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    const historyEntry = {
      date: new Date(),
      action: 'Comment',
      user: user || 'Anonymous',
      details: comment
    };
    
    feedback.history.push(historyEntry);
    await feedback.save();
    
    res.status(201).json({ 
      message: 'Comment added successfully',
      comment: historyEntry
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const setFeedbackReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reminderDate, reminderNote, recipients, isEmailNotification = true } = req.body;
    
    if (!reminderDate || !recipients || !recipients.length) {
      return res.status(400).json({ message: 'Reminder date and recipients are required' });
    }
    
    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    const reminder = {
      reminderDate: new Date(reminderDate),
      reminderNote,
      recipients,
      isEmailNotification,
      isCompleted: false
    };
    
    if (!feedback.reminders) {
      feedback.reminders = [];
    }
    
    feedback.reminders.push(reminder);
    await feedback.save();
    
    // Add to history
    const historyEntry = {
      date: new Date(),
      action: 'Reminder Set',
      user: req.body.user || 'System',
      details: `Reminder set for ${new Date(reminderDate).toLocaleString()}`
    };
    
    feedback.history.push(historyEntry);
    await feedback.save();
    
    res.status(201).json({ 
      message: 'Reminder set successfully',
      reminder
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
      byPriority: {
        low: feedbacks.filter(f => f.priority === 'Low').length,
        medium: feedbacks.filter(f => f.priority === 'Medium').length,
        high: feedbacks.filter(f => f.priority === 'High').length,
        critical: feedbacks.filter(f => f.priority === 'Critical').length,
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

export const submitFeedbackResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, rating, submittedBy } = req.body;
    
    if (!text || !rating) {
      return res.status(400).json({ message: 'Response text and rating are required' });
    }
    
    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    feedback.response = {
      text,
      rating,
      submittedBy: submittedBy || 'Anonymous',
      submittedAt: new Date()
    };
    
    feedback.status = 'Completed';
    
        // Add to history
        const historyEntry = {
          date: new Date(),
          action: 'Response Submitted',
          user: submittedBy || 'Anonymous',
          details: `Feedback response submitted with rating: ${rating}/5`
        };
        
        feedback.history.push(historyEntry);
        await feedback.save();
        
        res.status(200).json({ 
          message: 'Feedback response submitted successfully',
          feedback
        });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    };
    
    export const bulkUpdateFeedback = async (req, res) => {
      try {
        const { ids, action, value } = req.body;
        
        if (!ids || !ids.length) {
          return res.status(400).json({ message: 'Feedback IDs are required' });
        }
        
        if (!action) {
          return res.status(400).json({ message: 'Action is required' });
        }
        
        let updateData = {};
        let result;
        
        switch (action) {
          case 'status':
            updateData = { status: value };
            result = await Feedback.updateMany(
              { _id: { $in: ids } },
              { $set: updateData }
            );
            break;
            
          case 'delete':
            result = await Feedback.deleteMany({ _id: { $in: ids } });
            break;
            
          default:
            return res.status(400).json({ message: 'Invalid action' });
        }
        
        res.status(200).json({ 
          message: `Bulk ${action} completed successfully`,
          affected: result.modifiedCount || result.deletedCount || 0
        });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    };
    
    export const getFeedbacksByEmployee = async (req, res) => {
      try {
        const { employeeId } = req.params;
        
        // Find feedbacks where this employee is either the subject or the reviewer
        const feedbacks = await Feedback.find({
          $or: [
            { 'employee.id': employeeId },
            { employee: employeeId },
            { 'manager.id': employeeId },
            { manager: employeeId }
          ]
        });
        
        res.status(200).json(feedbacks);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    };
    
    export const getOverdueFeedbacks = async (req, res) => {
      try {
        const today = new Date();
        
        const overdueFeedbacks = await Feedback.find({
          dueDate: { $lt: today },
          status: { $ne: 'Completed' }
        });
        
        res.status(200).json(overdueFeedbacks);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    };
    
    export const getUpcomingFeedbacks = async (req, res) => {
      try {
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        
        const upcomingFeedbacks = await Feedback.find({
          dueDate: { $gte: today, $lte: nextWeek },
          status: { $ne: 'Completed' }
        });
        
        res.status(200).json(upcomingFeedbacks);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    };
    
    export const getDueFeedbackReminders = async (req, res) => {
      try {
        const now = new Date();
        
        // Find all feedbacks with reminders due now
        const feedbacks = await Feedback.find({
          'reminders.reminderDate': { $lte: now },
          'reminders.isCompleted': false
        });
        
        // Extract just the due reminders
        const dueReminders = feedbacks.flatMap(feedback => {
          const reminders = feedback.reminders.filter(r => 
            new Date(r.reminderDate) <= now && !r.isCompleted
          ).map(r => ({
            ...r.toObject(),
            feedbackId: feedback._id,
            feedbackTitle: feedback.title
          }));
          
          return reminders;
        });
        
        res.status(200).json(dueReminders);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    };
    
    export const markReminderComplete = async (req, res) => {
      try {
        const { feedbackId, reminderId } = req.params;
        
        const feedback = await Feedback.findById(feedbackId);
        if (!feedback) {
          return res.status(404).json({ message: 'Feedback not found' });
        }
        
        const reminderIndex = feedback.reminders.findIndex(r => r._id.toString() === reminderId);
        if (reminderIndex === -1) {
          return res.status(404).json({ message: 'Reminder not found' });
        }
        
        feedback.reminders[reminderIndex].isCompleted = true;
        await feedback.save();
        
        res.status(200).json({ message: 'Reminder marked as complete' });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    };
    
