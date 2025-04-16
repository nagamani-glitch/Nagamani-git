import MyLeaveRequest from '../models/MyLeaveRequest.js';
import LeaveBalance from '../models/LeaveBalance.js';

// Helper function to calculate number of days between dates (excluding weekends)
const calculateBusinessDays = (startDate, endDate, isHalfDay) => {
  if (isHalfDay) return 0.5;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  let count = 0;
  const currentDate = new Date(start);
  
  while (currentDate <= end) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Not a weekend
      count++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return count;
};

// Process monthly accruals for earned leave
const processMonthlyAccrual = async (employeeCode) => {
  try {
    const leaveBalance = await LeaveBalance.findOne({ employeeCode });
    
    if (!leaveBalance) return;
    
    const now = new Date();
    const lastAccrual = new Date(leaveBalance.lastAccrualDate);
    
    // Calculate months difference
    const monthsDiff = (now.getFullYear() - lastAccrual.getFullYear()) * 12 + 
                       (now.getMonth() - lastAccrual.getMonth());
    
    // If we've passed at least one month since last accrual
    if (monthsDiff >= 1) {
      // Add 1 earned leave per month
      leaveBalance.earned.total += monthsDiff;
      
      // Add 1 casual leave per month up to the maximum of 12
      const casualToAdd = Math.min(monthsDiff, 12 - leaveBalance.casual.total);
      if (casualToAdd > 0) {
        leaveBalance.casual.total += casualToAdd;
      }
      
      // Update last accrual date
      leaveBalance.lastAccrualDate = now;
      
      await leaveBalance.save();
    }
  } catch (error) {
    console.error('Error processing monthly accrual:', error);
  }
};

// Get leave balance for an employee
export const getLeaveBalance = async (req, res) => {
  try {
    const { employeeCode } = req.params;
    
    // Process any pending accruals first
    await processMonthlyAccrual(employeeCode);
    
    // Find or create leave balance
    let leaveBalance = await LeaveBalance.findOne({ employeeCode });
    
    if (!leaveBalance) {
      leaveBalance = new LeaveBalance({ employeeCode });
      await leaveBalance.save();
    }
    
    res.status(200).json(leaveBalance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await MyLeaveRequest.find().sort({ createdAt: -1 });
    res.status(200).json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createLeaveRequest = async (req, res) => {
  try {
    const { employeeCode, leaveType, startDate, endDate, halfDay } = req.body;
    
    // Calculate number of days
    const numberOfDays = calculateBusinessDays(startDate, endDate, halfDay);
    
    // Check if employee has sufficient leave balance
    let leaveBalance = await LeaveBalance.findOne({ employeeCode });
    
    if (!leaveBalance) {
      // Create new balance if not exists
      leaveBalance = new LeaveBalance({ employeeCode });
      await leaveBalance.save();
    } else {
      // Process any pending accruals
      await processMonthlyAccrual(employeeCode);
      
      // Refresh leave balance after accrual
      leaveBalance = await LeaveBalance.findOne({ employeeCode });
    }
    
    // // Check if employee has enough balance
    // const availableBalance = leaveBalance[leaveType].total - leaveBalance[leaveType].used - leaveBalance[leaveType].pending;
    
    // if (numberOfDays > availableBalance) {
    //   return res.status(400).json({ 
    //     message: `Insufficient ${leaveType} leave balance. Available: ${availableBalance} days, Requested: ${numberOfDays} days` 
    //   });
    // }
    
    // Check if employee has enough balance
const availableBalance = leaveBalance[leaveType].total - leaveBalance[leaveType].used - leaveBalance[leaveType].pending;

if (numberOfDays > availableBalance) {
  return res.status(400).json({ 
    message: `Insufficient ${leaveType} leave balance. Available: ${availableBalance} days, Requested: ${numberOfDays} days` 
  });
}

    // Create leave request with calculated days
    const leaveData = {
      ...req.body,
      status: 'pending',
      numberOfDays
    };
    
    const newLeaveRequest = new MyLeaveRequest(leaveData);
    const savedLeaveRequest = await newLeaveRequest.save();
    
    // Update pending balance
    leaveBalance[leaveType].pending += numberOfDays;
    await leaveBalance.save();
    
    res.status(201).json(savedLeaveRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update leave comment
export const updateLeaveComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    
    const updatedLeaveRequest = await MyLeaveRequest.findByIdAndUpdate(
      id,
      { comment },
      { new: true }
    );
    
    if (!updatedLeaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    res.status(200).json(updatedLeaveRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteLeaveRequest = async (req, res) => {
  try {
    // Find the leave request first
    const leaveRequest = await MyLeaveRequest.findById(req.params.id);
    
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    // Only allow deletion if the request is still pending
    if (leaveRequest.status !== 'pending') {
      return res.status(400).json({ 
        message: 'Cannot delete a leave request that has already been processed' 
      });
    }
    
    // Update leave balance
    const leaveBalance = await LeaveBalance.findOne({ employeeCode: leaveRequest.employeeCode });
    
    if (leaveBalance) {
      leaveBalance[leaveRequest.leaveType].pending -= leaveRequest.numberOfDays;
      await leaveBalance.save();
    }
    
    await MyLeaveRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Leave request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// These functions will be used by the admin/HR in the LeaveRequests component
export const approveLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await MyLeaveRequest.findById(req.params.id);
    
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    // Only approve if it's pending
    if (leaveRequest.status !== 'pending') {
      return res.status(400).json({ message: 'This request is not in pending status' });
    }
    
    // Update leave balance
    const leaveBalance = await LeaveBalance.findOne({ employeeCode: leaveRequest.employeeCode });
    
    if (leaveBalance) {
      // Move from pending to used
      leaveBalance[leaveRequest.leaveType].pending -= leaveRequest.numberOfDays;
      leaveBalance[leaveRequest.leaveType].used += leaveRequest.numberOfDays;
      await leaveBalance.save();
    }
    
    // Update leave request status
    const updatedLeaveRequest = await MyLeaveRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    
    res.status(200).json(updatedLeaveRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const rejectLeaveRequest = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    
    const leaveRequest = await MyLeaveRequest.findById(req.params.id);
    
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    // Only reject if it's pending
    if (leaveRequest.status !== 'pending') {
      return res.status(400).json({ message: 'This request is not in pending status' });
    }
    
    // Update leave balance
    const leaveBalance = await LeaveBalance.findOne({ employeeCode: leaveRequest.employeeCode });
    
    if (leaveBalance) {
      // Remove from pending
      leaveBalance[leaveRequest.leaveType].pending -= leaveRequest.numberOfDays;
      await leaveBalance.save();
    }
    
    const updatedLeaveRequest = await MyLeaveRequest.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'rejected',
        rejectionReason 
      },
      { new: true }
    );
    
    res.status(200).json(updatedLeaveRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get leave requests for a specific employee
export const getEmployeeLeaveRequests = async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const leaveRequests = await MyLeaveRequest.find({ employeeCode }).sort({ createdAt: -1 });
    res.status(200).json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

    // Get leave statistics for dashboard
    export const getLeaveStatistics = async (req, res) => {
      try {
        const { employeeCode } = req.params;
        
        // Process any pending accruals first
        await processMonthlyAccrual(employeeCode);
        
        // Get leave balance
        let leaveBalance = await LeaveBalance.findOne({ employeeCode });
        
        if (!leaveBalance) {
          leaveBalance = new LeaveBalance({ employeeCode });
          await leaveBalance.save();
        }
        
        // Get all leave requests for this employee
        const leaveRequests = await MyLeaveRequest.find({ employeeCode }).sort({ createdAt: -1 });
        
        // Calculate monthly usage
        const monthlyUsage = {};
        const now = new Date();
        const currentYear = now.getFullYear();
        
        // Initialize all months
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        months.forEach(month => {
          monthlyUsage[month] = 0;
        });
        
        // Calculate leave type usage
        const leaveTypeUsage = {};
        
        // Get approved leaves only
        const approvedLeaves = leaveRequests.filter(leave => leave.status === 'approved');
        
        approvedLeaves.forEach(leave => {
          // Only count leaves from current year
          const leaveYear = new Date(leave.startDate).getFullYear();
          if (leaveYear === currentYear) {
            const month = months[new Date(leave.startDate).getMonth()];
            monthlyUsage[month] += leave.numberOfDays;
          }
          
          // Count by leave type
          if (!leaveTypeUsage[leave.leaveType]) {
            leaveTypeUsage[leave.leaveType] = 0;
          }
          leaveTypeUsage[leave.leaveType] += leave.numberOfDays;
        });
        
        // Get upcoming leaves (pending and approved, with future dates)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const upcomingLeaves = leaveRequests.filter(leave => {
          const startDate = new Date(leave.startDate);
          return (leave.status === 'approved' || leave.status === 'pending') && startDate >= today;
        }).sort((a, b) => new Date(a.startDate) - new Date(b.startDate)).slice(0, 5);
        
        res.status(200).json({
          statistics: {
            monthlyUsage,
            leaveTypeUsage
          },
          upcomingLeaves
        });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    };
    
    // Reset annual leaves at the beginning of the year
    export const resetAnnualLeaves = async (req, res) => {
      try {
        // This would typically be run by a cron job on Jan 1
        // But we'll provide an API endpoint for manual triggering
        
        const { year } = req.body;
        
        if (!year) {
          return res.status(400).json({ message: 'Year parameter is required' });
        }
        
        // Reset annual leave for all employees
        await LeaveBalance.updateMany(
          {},
          { 
            $set: {
              'annual.total': 15,
              'annual.used': 0,
              'annual.pending': 0,
              'sick.total': 12,
              'sick.used': 0,
              'casual.total': 12,
              'casual.used': 0
            }
          }
        );
        
        res.status(200).json({ message: `Annual leaves reset for ${year}` });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    };

    // Add this function to your controller
export const updateEarnedLeaveBalance = async (req, res) => {
  try {
    await LeaveBalance.updateMany(
      {}, 
      { $set: { "earned.total": 15 } }
    );
    
    res.status(200).json({ message: "Earned leave balance updated for all employees" });
  } catch (error) {
    console.error("Error updating earned leave balance:", error);
    res.status(500).json({ message: "Error updating earned leave balance" });
  }
};

    