import Feedback from '../models/Feedback.js';
import Employee from '../models/employeeRegisterModel.js';



export const createFeedback = async (req, res) => {
  try {
    const feedbackData = req.body;
    
    // If it's self-feedback that needs review, handle the special workflow
    if (feedbackData.feedbackType === 'selfFeedback' && feedbackData.needsReview) {
      // Create the self-feedback
      const selfFeedback = new Feedback({
        ...feedbackData,
        feedbackType: 'selfFeedback',
        status: 'In Progress'
      });
      
      // Add initial history entry
      selfFeedback.history = [{
        date: new Date(),
        action: 'Created',
        user: feedbackData.createdBy || 'System',
        details: 'Self feedback created and sent for review'
      }];
      
      await selfFeedback.save();
      
      // Create a copy in the feedbackToReview category
      const reviewFeedback = new Feedback({
        ...feedbackData,
        feedbackType: 'feedbackToReview',
        originalFeedbackId: selfFeedback._id,
        status: 'Pending',
        history: [{
          date: new Date(),
          action: 'Created',
          user: feedbackData.createdBy || 'System',
          details: 'Feedback submitted for review'
        }]
      });
      
      await reviewFeedback.save();
      
      return res.status(201).json({ 
        success: true, 
        message: 'Feedback created and sent for review',
        data: {
          selfFeedback,
          reviewFeedback
        }
      });
    }
    
    // Regular feedback creation (existing code)
    const feedback = new Feedback(feedbackData);
    
    // Add initial history entry
    feedback.history = [{
      date: new Date(),
      action: 'Created',
      user: feedbackData.createdBy || 'System',
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
    
    // If this feedback has a linked feedback (original or review), update that too
    if (currentFeedback.originalFeedbackId) {
      // This is a review feedback, update the original
      await Feedback.findByIdAndUpdate(
        currentFeedback.originalFeedbackId,
        { status: updateData.status },
        { new: false }
      );
    } else {
      // Check if this is an original feedback with reviews
      const linkedReviews = await Feedback.find({ originalFeedbackId: id });
      
      if (linkedReviews.length > 0) {
        // Update all linked reviews
        await Promise.all(
          linkedReviews.map(review => 
            Feedback.findByIdAndUpdate(
              review._id,
              { status: updateData.status },
              { new: false }
            )
          )
        );
      }
    }
    
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
    
    // If this is an original feedback with reviews, delete those too
    if (!feedback.originalFeedbackId) {
      await Feedback.deleteMany({ originalFeedbackId: id });
    }
    // If this is a review feedback, update the original
    else {
      const originalFeedback = await Feedback.findById(feedback.originalFeedbackId);
      if (originalFeedback) {
        // Add a history entry about the review being deleted
        originalFeedback.history.push({
          date: new Date(),
          action: 'Updated',
          user: req.body.deletedBy || 'System',
          details: 'Review feedback was deleted'
        });
        await originalFeedback.save();
      }
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

export const getFeedbackAnalytics = async (req, res) => {
  try {
    // Get all feedbacks
    const feedbacks = await Feedback.find();
    
    // Calculate analytics
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
    console.error('Error generating analytics:', error);
    res.status(500).json({ message: error.message });
  }
};

export const submitFeedbackResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, rating, submittedBy } = req.body;
    
    if (!text && !rating) {
      return res.status(400).json({ message: 'Response text or rating is required' });
    }
    
    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    // Create response object
    const response = {
      text,
      rating,
      submittedBy: submittedBy || 'Anonymous',
      submittedAt: new Date()
    };
    
    // Update feedback with response
    feedback.response = response;
    
    // Update status to completed
    feedback.status = 'Completed';
    
    // Add to history
    feedback.history.push({
      date: new Date(),
      action: 'Response Submitted',
      user: submittedBy || 'Anonymous',
      details: `Feedback response submitted with rating: ${rating || 'N/A'}`
    });
    
    await feedback.save();
    
    res.status(200).json({ 
      message: 'Feedback response submitted successfully',
      feedback
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getFeedbacksByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    // Find feedbacks where this employee is either the employee or manager
    const feedbacks = await Feedback.find({
      $or: [
        { employee: employeeId },
        { 'employee.id': employeeId },
        { manager: employeeId },
        { 'manager.id': employeeId }
      ]
    });
    
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getFeedbacksByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    
    // Find feedbacks where employee or manager is from this department
    // This assumes employee and manager objects have department field
    const feedbacks = await Feedback.find({
      $or: [
        { 'employee.department': department },
        { 'manager.department': department }
      ]
    });
    
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getFeedbacksOverdue = async (req, res) => {
  try {
    const today = new Date();
    
    // Find feedbacks that are past due date and not completed
    const overdueFeedbacks = await Feedback.find({
      dueDate: { $lt: today },
      status: { $ne: 'Completed' }
    });
    
    res.status(200).json(overdueFeedbacks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getFeedbacksDueThisWeek = async (req, res) => {
  try {
    const today = new Date();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(today.getDate() + 7);
    
    // Find feedbacks due within the next week and not completed
    const dueThisWeek = await Feedback.find({
      dueDate: { $gte: today, $lte: oneWeekFromNow },
      status: { $ne: 'Completed' }
    });
    
    res.status(200).json(dueThisWeek);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const bulkUpdateFeedbacks = async (req, res) => {
  try {
    const { ids, updateData } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Feedback IDs are required' });
    }
    
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'Update data is required' });
    }
    
    // Update multiple feedbacks
    const result = await Feedback.updateMany(
      { _id: { $in: ids } },
      { $set: updateData }
    );
    
    res.status(200).json({ 
      message: 'Feedbacks updated successfully',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const bulkDeleteFeedbacks = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Feedback IDs are required' });
    }
    
    // Delete multiple feedbacks
    const result = await Feedback.deleteMany({ _id: { $in: ids } });
    
    res.status(200).json({ 
      message: 'Feedbacks deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Add this new function to get feedback by user ID
export const getFeedbacksByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // First get the employee ID from the user ID
    const employee = await Employee.findOne({ userId });
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found for this user ID'
      });
    }
    
    const employeeId = employee.Emp_ID;
    
    // Get all feedbacks
    const feedbacks = await Feedback.find();
    
    // Filter and organize by feedback type and employee ID
    const organizedFeedbacks = {
      selfFeedback: feedbacks.filter(f => 
        f.feedbackType === 'selfFeedback' && 
        (f.employeeId === employeeId || 
         (typeof f.employee === 'object' && f.employee.id === employeeId) ||
         (typeof f.employee === 'string' && f.employee.includes(employeeId)))
      ),
      requestedFeedback: feedbacks.filter(f => 
        f.feedbackType === 'requestedFeedback' && 
        (f.employeeId === employeeId || 
         (typeof f.employee === 'object' && f.employee.id === employeeId) ||
         (typeof f.employee === 'string' && f.employee.includes(employeeId)))
      ),
      feedbackToReview: feedbacks.filter(f => 
        f.feedbackType === 'feedbackToReview'
      ),
      anonymousFeedback: feedbacks.filter(f => 
        f.feedbackType === 'anonymousFeedback'
      )
    };
    
    res.status(200).json({
      success: true,
      data: organizedFeedbacks
    });
  } catch (error) {
    console.error('Error fetching feedback by user ID:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const updateFeedbackReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewStatus, reviewedBy, comments } = req.body;
    
    // Find the feedback to review
    const reviewFeedback = await Feedback.findById(id);
    
    if (!reviewFeedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    // Update the review status
    reviewFeedback.reviewStatus = reviewStatus;
    
    // Add to history
    reviewFeedback.history.push({
      date: new Date(),
      action: 'Updated',
      user: reviewedBy || 'System',
      details: `Review status updated to ${reviewStatus}${comments ? ': ' + comments : ''}`
    });
    
    await reviewFeedback.save();
    
    // If there's an original feedback, update it too
    if (reviewFeedback.originalFeedbackId) {
      const originalFeedback = await Feedback.findById(reviewFeedback.originalFeedbackId);
      
      if (originalFeedback) {
        // Update the status based on review decision
        if (reviewStatus === 'Approved') {
          originalFeedback.status = 'Completed';
        } else if (reviewStatus === 'Rejected') {
          originalFeedback.status = 'Pending';
        }
        
        // Add to history
        originalFeedback.history.push({
          date: new Date(),
          action: 'Updated',
          user: reviewedBy || 'System',
          details: `Feedback review ${reviewStatus.toLowerCase()}${comments ? ': ' + comments : ''}`
        });
        
        await originalFeedback.save();
      }
    }
    
    res.status(200).json({ 
      message: 'Feedback review status updated successfully',
      data: reviewFeedback
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const completeFeedbackReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved, reviewedBy, comments } = req.body;
    
    // Find the feedback
    const feedback = await Feedback.findById(id);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    // Update the status based on approval
    feedback.reviewStatus = approved ? 'Approved' : 'Rejected';
    feedback.status = approved ? 'Completed' : 'Pending';
    
    // Add to history
    feedback.history.push({
      date: new Date(),
      action: 'Updated',
      user: reviewedBy || 'System',
      details: `Feedback review ${approved ? 'approved' : 'rejected'}${comments ? ': ' + comments : ''}`
    });
    
    await feedback.save();
    
    // If this is a review feedback, update the original
    if (feedback.originalFeedbackId) {
      const originalFeedback = await Feedback.findById(feedback.originalFeedbackId);
      
      if (originalFeedback) {
        originalFeedback.status = approved ? 'Completed' : 'Pending';
        originalFeedback.reviewStatus = approved ? 'Approved' : 'Rejected';
        
        // Add to history
        originalFeedback.history.push({
          date: new Date(),
          action: 'Updated',
          user: reviewedBy || 'System',
          details: `Feedback review ${approved ? 'approved' : 'rejected'}${comments ? ': ' + comments : ''}`
        });
        
        await originalFeedback.save();
      }
    }
    
    res.status(200).json({ 
      message: `Feedback ${approved ? 'approved' : 'rejected'} successfully`,
      data: feedback
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const getLinkedFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the feedback
    const feedback = await Feedback.findById(id);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    let linkedFeedback;
    
    // If this is an original feedback, find its reviews
    if (!feedback.originalFeedbackId) {
      linkedFeedback = await Feedback.find({ originalFeedbackId: id });
    } 
    // If this is a review feedback, find its original
    else {
      linkedFeedback = await Feedback.findById(feedback.originalFeedbackId);
    }
    
    res.status(200).json({
      success: true,
      data: linkedFeedback
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const getFeedbacksToReviewByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // First get the employee ID from the user ID
    const employee = await Employee.findOne({ userId });
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found for this user ID'
      });
    }
    
    const employeeId = employee.Emp_ID;
    
    // Find all feedback that this employee should review
    // This could be based on their role, department, or specific assignment
    const feedbackToReview = await Feedback.find({
      feedbackType: 'feedbackToReview',
      $or: [
        { 'manager.id': employeeId },
        { manager: employeeId },
        { reviewAssignedTo: employeeId }
      ]
    });
    
    res.status(200).json({
      success: true,
      data: feedbackToReview
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const assignFeedbackForReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewerId, assignedBy, comments } = req.body;
    
    // Find the feedback
    const feedback = await Feedback.findById(id);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    // Update the reviewer
    feedback.reviewAssignedTo = reviewerId;
    
    // Add to history
    feedback.history.push({
      date: new Date(),
      action: 'Updated',
      user: assignedBy || 'System',
      details: `Assigned for review to ${reviewerId}${comments ? ': ' + comments : ''}`
    });
    
    await feedback.save();
    
    res.status(200).json({
      success: true,
      message: 'Feedback assigned for review successfully',
      data: feedback
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const getFeedbackStatsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // First get the employee ID from the user ID
    const employee = await Employee.findOne({ userId });
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found for this user ID'
      });
    }
    
    const employeeId = employee.Emp_ID;
    
    // Get all feedback related to this employee
    const allFeedback = await Feedback.find({
      $or: [
        { employeeId: employeeId },
        { 'employee.id': employeeId },
        { employee: employeeId },
        { 'manager.id': employeeId },
        { manager: employeeId },
        { reviewAssignedTo: employeeId },
        { createdBy: employeeId }
      ]
    });
    
    // Calculate statistics
    const stats = {
      total: allFeedback.length,
      selfFeedback: allFeedback.filter(f => f.feedbackType === 'selfFeedback').length,
      requestedFeedback: allFeedback.filter(f => f.feedbackType === 'requestedFeedback').length,
      feedbackToReview: allFeedback.filter(f => f.feedbackType === 'feedbackToReview').length,
      anonymousFeedback: allFeedback.filter(f => f.feedbackType === 'anonymousFeedback').length,
      completed: allFeedback.filter(f => f.status === 'Completed').length,
      inProgress: allFeedback.filter(f => f.status === 'In Progress').length,
      notStarted: allFeedback.filter(f => f.status === 'Not Started').length,
      pending: allFeedback.filter(f => f.status === 'Pending').length,
      overdue: allFeedback.filter(f => 
        new Date(f.dueDate) < new Date() && f.status !== 'Completed'
      ).length,
      completionRate: allFeedback.length > 0 
        ? ((allFeedback.filter(f => f.status === 'Completed').length / allFeedback.length) * 100).toFixed(1)
        : 0
    };
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};






