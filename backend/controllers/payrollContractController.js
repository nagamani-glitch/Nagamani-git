// import Contract from '../models/payrollContractModel.js';;

// export const getContracts = async (req, res) => {
//   try {
//     const contracts = await Contract.find();
//     res.status(200).json({ success: true, data: contracts });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// export const createContract = async (req, res) => {
//   try {
//     const newContract = new Contract(req.body);
//     const savedContract = await newContract.save();
//     res.status(201).json({ success: true, data: savedContract });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// export const updateContract = async (req, res) => {
//   try {
//     const updatedContract = await Contract.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     res.status(200).json({ success: true, data: updatedContract });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// export const deleteContract = async (req, res) => {
//   try {
//     await Contract.findByIdAndDelete(req.params.id);
//     res.status(200).json({ success: true, message: 'Contract deleted successfully' });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// export const filterContracts = async (req, res) => {
//   try {
//     const { contractStatus, employeeName, startDate, endDate, wageType } = req.query;
//     const filter = {};

//     if (contractStatus) filter.contractStatus = contractStatus;
//     if (employeeName) filter.employee = { $regex: employeeName, $options: 'i' };
//     if (startDate) filter.startDate = { $gte: startDate };
//     if (endDate) filter.endDate = { $lte: endDate };
//     if (wageType) filter.wageType = wageType;

//     const contracts = await Contract.find(filter);
//     res.status(200).json({ success: true, data: contracts });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

import Contract from '../models/payrollContractModel.js';

export const getContracts = async (req, res) => {
  try {
    const contracts = await Contract.find();
    res.status(200).json({ success: true, data: contracts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getContractById = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({ success: false, error: 'Contract not found' });
    }
    res.status(200).json({ success: true, data: contract });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createContract = async (req, res) => {
  try {
    // Check if this is a renewal
    if (req.body.previousContractId) {
      const previousContract = await Contract.findById(req.body.previousContractId);
      if (previousContract) {
        // Add renewal history
        req.body.renewalHistory = [{
          previousContractId: req.body.previousContractId,
          renewalDate: new Date(),
          reason: req.body.renewalReason || 'Contract renewal'
        }];
        
        // Copy salary history if it exists
        if (previousContract.salaryHistory && previousContract.salaryHistory.length > 0) {
          req.body.salaryHistory = [...previousContract.salaryHistory];
        }
        
        // Add current salary to history if it's different
        if (previousContract.basicSalary !== req.body.basicSalary) {
          if (!req.body.salaryHistory) req.body.salaryHistory = [];
          req.body.salaryHistory.push({
            amount: req.body.basicSalary,
            effectiveDate: new Date(),
            reason: 'Contract renewal with salary adjustment'
          });
        }
      }
    } else if (req.body.basicSalary) {
      // For new contracts, initialize salary history
      req.body.salaryHistory = [{
        amount: req.body.basicSalary,
        effectiveDate: req.body.startDate || new Date(),
        reason: 'Initial contract'
      }];
    }
    
    const newContract = new Contract(req.body);
    const savedContract = await newContract.save();
    res.status(201).json({ success: true, data: savedContract });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const updateContract = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({ success: false, error: 'Contract not found' });
    }
    
    // Check if salary is being updated
    if (req.body.basicSalary && req.body.basicSalary !== contract.basicSalary) {
      if (!contract.salaryHistory) contract.salaryHistory = [];
      
      // Add to salary history
      req.body.salaryHistory = [
        ...(contract.salaryHistory || []),
        {
          amount: req.body.basicSalary,
          effectiveDate: new Date(),
          reason: req.body.salaryChangeReason || 'Salary adjustment'
        }
      ];
    }
    
    const updatedContract = await Contract.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({ success: true, data: updatedContract });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const deleteContract = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({ success: false, error: 'Contract not found' });
    }
    
    await Contract.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Contract deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const filterContracts = async (req, res) => {
  try {
    const { 
      contractStatus, 
      employeeName, 
      startDate, 
      endDate, 
      wageType,
      department,
      position,
      workType,
      minSalary,
      maxSalary,
      expiringSoon
    } = req.query;
    
    const filter = {};

    if (contractStatus) filter.contractStatus = contractStatus;
    if (employeeName) filter.employee = { $regex: employeeName, $options: 'i' };
    if (startDate) filter.startDate = { $gte: startDate };
    if (endDate) filter.endDate = { $lte: endDate };
    if (wageType) filter.wageType = wageType;
    if (department) filter.department = department;
    if (position) filter.position = position;
    if (workType) filter.workType = workType;
    
    // Salary range filter
    if (minSalary || maxSalary) {
      filter.basicSalary = {};
      if (minSalary) filter.basicSalary.$gte = Number(minSalary);
      if (maxSalary) filter.basicSalary.$lte = Number(maxSalary);
    }
    
    let contracts;
    
    // Special filter for contracts expiring soon
    if (expiringSoon === 'true') {
      const today = new Date();
      const thirtyDaysLater = new Date();
      thirtyDaysLater.setDate(today.getDate() + 30);
      
      filter.endDate = { 
        $gte: today.toISOString().split('T')[0],
        $lte: thirtyDaysLater.toISOString().split('T')[0]
      };
      filter.contractStatus = 'Active';
    }
    
    contracts = await Contract.find(filter);
    res.status(200).json({ success: true, data: contracts });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const updateApprovalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { approverName, approverRole, status, comments } = req.body;
    
    if (!approverName || !approverRole || !status) {
      return res.status(400).json({ 
        success: false, 
        error: 'Approver name, role and status are required' 
      });
    }
    
    const contract = await Contract.findById(id);
    if (!contract) {
      return res.status(404).json({ success: false, error: 'Contract not found' });
    }
    
    // Initialize approval status if it doesn't exist
    if (!contract.approvalStatus) {
      contract.approvalStatus = {
        status: 'Pending',
        approvers: []
      };
    }
    
    // Check if this approver already exists
    const approverIndex = contract.approvalStatus.approvers.findIndex(
      a => a.name === approverName && a.role === approverRole
    );
    
    if (approverIndex >= 0) {
      // Update existing approver
      contract.approvalStatus.approvers[approverIndex] = {
        name: approverName,
        role: approverRole,
        status,
        date: new Date(),
        comments: comments || contract.approvalStatus.approvers[approverIndex].comments
      };
    } else {
      // Add new approver
      contract.approvalStatus.approvers.push({
        name: approverName,
        role: approverRole,
        status,
        date: new Date(),
        comments
      });
    }
    
    // Update overall status based on approvers
    const allApproved = contract.approvalStatus.approvers.every(a => a.status === 'Approved');
    const anyRejected = contract.approvalStatus.approvers.some(a => a.status === 'Rejected');
    
    if (anyRejected) {
      contract.approvalStatus.status = 'Rejected';
    } else if (allApproved) {
      contract.approvalStatus.status = 'Approved';
    } else {
      contract.approvalStatus.status = 'Pending';
    }
    
    await contract.save();
    
    res.status(200).json({ success: true, data: contract });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const updateComplianceDocuments = async (req, res) => {
  try {
    const { id } = req.params;
    const { documentName, status, dueDate, submittedDate } = req.body;
    
    if (!documentName || !status) {
      return res.status(400).json({ 
        success: false, 
        error: 'Document name and status are required' 
      });
    }
    
    const contract = await Contract.findById(id);
    if (!contract) {
      return res.status(404).json({ success: false, error: 'Contract not found' });
    }
    
    // Initialize compliance documents if they don't exist
    if (!contract.complianceDocuments) {
      contract.complianceDocuments = [];
    }
    
    // Check if this document already exists
    const docIndex = contract.complianceDocuments.findIndex(
      d => d.documentName === documentName
    );
    
    if (docIndex >= 0) {
      // Update existing document
      contract.complianceDocuments[docIndex] = {
        documentName,
        status,
        dueDate: dueDate || contract.complianceDocuments[docIndex].dueDate,
        submittedDate: submittedDate || contract.complianceDocuments[docIndex].submittedDate
      };
    } else {
      // Add new document
      contract.complianceDocuments.push({
        documentName,
        status,
        dueDate,
        submittedDate
      });
    }
    
    await contract.save();
    
    res.status(200).json({ success: true, data: contract });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const terminateContract = async (req, res) => {
  try {
    const { id } = req.params;
    const { terminationReason, terminationDate } = req.body;
    
    if (!terminationReason) {
      return res.status(400).json({ 
        success: false, 
        error: 'Termination reason is required' 
      });
    }
    
    const contract = await Contract.findById(id);
    if (!contract) {
      return res.status(404).json({ success: false, error: 'Contract not found' });
    }
    
    // Update contract status to terminated
    contract.contractStatus = 'Terminated';
    
    // Add termination details to notes
    const terminationNote = `Contract terminated on ${terminationDate || new Date().toISOString().split('T')[0]} due to: ${terminationReason}`;
    contract.note = contract.note 
      ? `${contract.note}\n\n${terminationNote}` 
      : terminationNote;
    
    // If termination date is provided, update end date
    if (terminationDate) {
      contract.endDate = terminationDate;
    }
    
    await contract.save();
    
    res.status(200).json({ 
      success: true, 
      data: contract,
      message: 'Contract terminated successfully' 
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    // Get total count of contracts
    const totalContracts = await Contract.countDocuments();
    
    // Get count by status
    const activeContracts = await Contract.countDocuments({ contractStatus: 'Active' });
    const draftContracts = await Contract.countDocuments({ contractStatus: 'Draft' });
    const expiredContracts = await Contract.countDocuments({ contractStatus: 'Expired' });
    const terminatedContracts = await Contract.countDocuments({ contractStatus: 'Terminated' });
    
    // Get count by contract type
    const fullTimeContracts = await Contract.countDocuments({ contract: 'Full-time' });
    const partTimeContracts = await Contract.countDocuments({ contract: 'Part-time' });
    
    // Get contracts expiring in the next 30 days
    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);
    
    const expiringContracts = await Contract.find({
      endDate: { 
        $gte: today.toISOString().split('T')[0],
        $lte: thirtyDaysLater.toISOString().split('T')[0]
      },
      contractStatus: 'Active'
    });
    
    // Get contracts by department
    const departmentStats = await Contract.aggregate([
      { $match: { department: { $exists: true, $ne: "" } } },
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get salary distribution
    const salaryStats = await Contract.aggregate([
      { 
        $group: { 
          _id: null, 
          avgSalary: { $avg: "$basicSalary" },
          minSalary: { $min: "$basicSalary" },
          maxSalary: { $max: "$basicSalary" },
          totalSalary: { $sum: "$basicSalary" }
        } 
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalContracts,
        byStatus: {
          active: activeContracts,
          draft: draftContracts,
          expired: expiredContracts,
          terminated: terminatedContracts
        },
        byType: {
          fullTime: fullTimeContracts,
          partTime: partTimeContracts
        },
        expiringContracts: {
          count: expiringContracts.length,
          contracts: expiringContracts
        },
        departmentStats,
        salaryStats: salaryStats[0] || {
          avgSalary: 0,
          minSalary: 0,
          maxSalary: 0,
          totalSalary: 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const renewContract = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      startDate, 
      endDate, 
      basicSalary, 
      renewalReason 
    } = req.body;
    
    if (!startDate) {
      return res.status(400).json({ 
        success: false, 
        error: 'Start date is required for renewal' 
      });
    }
    
    // Find the original contract
    const originalContract = await Contract.findById(id);
    if (!originalContract) {
      return res.status(404).json({ success: false, error: 'Contract not found' });
    }
    
    // Create a new contract based on the original
    const newContractData = {
      contract: originalContract.contract,
      employee: originalContract.employee,
      startDate,
      endDate,
      wageType: originalContract.wageType,
      basicSalary: basicSalary || originalContract.basicSalary,
      filingStatus: originalContract.filingStatus,
      contractStatus: 'Active',
      department: originalContract.department,
      position: originalContract.position,
      role: originalContract.role,
      shift: originalContract.shift,
      workType: originalContract.workType,
      noticePeriod: originalContract.noticePeriod,
      deductFromBasicPay: originalContract.deductFromBasicPay,
      calculateDailyLeave: originalContract.calculateDailyLeave,
      payFrequency: originalContract.payFrequency,
      renewalHistory: [{
        previousContractId: originalContract._id,
        renewalDate: new Date(),
        reason: renewalReason || 'Contract renewal'
      }]
    };
    
    // Add salary history if salary changed
    if (basicSalary && basicSalary !== originalContract.basicSalary) {
      newContractData.salaryHistory = [
        ...(originalContract.salaryHistory || []),
        {
          amount: basicSalary,
          effectiveDate: new Date(startDate),
          reason: 'Salary adjustment during contract renewal'
        }
      ];
    } else {
      newContractData.salaryHistory = originalContract.salaryHistory;
    }
    
    // Create the new contract
    const newContract = new Contract(newContractData);
    const savedContract = await newContract.save();
    
    // Update the original contract status to expired if it was active
    if (originalContract.contractStatus === 'Active') {
      originalContract.contractStatus = 'Expired';
      originalContract.note = originalContract.note 
        ? `${originalContract.note}\n\nRenewed on ${new Date().toISOString().split('T')[0]}. New contract ID: ${savedContract._id}`
        : `Renewed on ${new Date().toISOString().split('T')[0]}. New contract ID: ${savedContract._id}`;
      
      await originalContract.save();
    }
    
    res.status(201).json({ 
      success: true, 
      data: savedContract,
      message: 'Contract renewed successfully'
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const bulkUpdateContracts = async (req, res) => {
  try {
    const { ids, updateData } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Contract IDs array is required' 
      });
    }
    
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Update data is required' 
      });
    }
    
    const result = await Contract.updateMany(
      { _id: { $in: ids } },
      { $set: updateData }
    );
    
    res.status(200).json({ 
      success: true, 
      message: `${result.modifiedCount} contracts updated successfully`,
      data: { modifiedCount: result.modifiedCount }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
