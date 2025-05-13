// // import Contract from '../models/payrollContractModel.js';

// // export const getContracts = async (req, res) => {
// //   try {
// //     const contracts = await Contract.find();
// //     res.status(200).json({ success: true, data: contracts });
// //   } catch (error) {
// //     res.status(500).json({ success: false, error: error.message });
// //   }
// // };

// // export const getContractById = async (req, res) => {
// //   try {
// //     const contract = await Contract.findById(req.params.id);
// //     if (!contract) {
// //       return res.status(404).json({ success: false, error: 'Contract not found' });
// //     }
// //     res.status(200).json({ success: true, data: contract });
// //   } catch (error) {
// //     res.status(500).json({ success: false, error: error.message });
// //   }
// // };

// // export const createContract = async (req, res) => {
// //   try {
// //     // Check if filing status is valid (if provided)
// //     if (req.body.filingStatus) {
// //       const validFilingStatuses = [
// //         'Individual', 
// //         'Head of Household (HOH)', 
// //         'Married Filing Jointly (MFJ)', 
// //         'Married Filing Separately (MFS)', 
// //         'Single Filer'
// //       ];
      
// //       if (!validFilingStatuses.includes(req.body.filingStatus)) {
// //         return res.status(400).json({ 
// //           success: false, 
// //           error: 'Invalid filing status provided' 
// //         });
// //       }
// //     }
    
// //     // Check if this is a renewal
// //     if (req.body.previousContractId) {
// //       const previousContract = await Contract.findById(req.body.previousContractId);
// //       if (previousContract) {
// //         // Add renewal history
// //         req.body.renewalHistory = [{
// //           previousContractId: req.body.previousContractId,
// //           renewalDate: new Date(),
// //           reason: req.body.renewalReason || 'Contract renewal'
// //         }];
        
// //         // Copy salary history if it exists
// //         if (previousContract.salaryHistory && previousContract.salaryHistory.length > 0) {
// //           req.body.salaryHistory = [...previousContract.salaryHistory];
// //         }
        
// //         // Add current salary to history if it's different
// //         if (previousContract.basicSalary !== req.body.basicSalary) {
// //           if (!req.body.salaryHistory) req.body.salaryHistory = [];
// //           req.body.salaryHistory.push({
// //             amount: req.body.basicSalary,
// //             effectiveDate: new Date(),
// //             reason: 'Contract renewal with salary adjustment'
// //           });
// //         }
// //       }
// //     } else if (req.body.basicSalary) {
// //       // For new contracts, initialize salary history
// //       req.body.salaryHistory = [{
// //         amount: req.body.basicSalary,
// //         effectiveDate: req.body.startDate || new Date(),
// //         reason: 'Initial contract'
// //       }];
// //     }
    
// //     const newContract = new Contract(req.body);
// //     const savedContract = await newContract.save();
// //     res.status(201).json({ success: true, data: savedContract });
// //   } catch (error) {
// //     res.status(400).json({ success: false, error: error.message });
// //   }
// // };

// // export const updateContract = async (req, res) => {
// //   try {
// //     // Check if filing status is valid (if being updated)
// //     if (req.body.filingStatus) {
// //       const validFilingStatuses = [
// //         'Individual', 
// //         'Head of Household (HOH)', 
// //         'Married Filing Jointly (MFJ)', 
// //         'Married Filing Separately (MFS)', 
// //         'Single Filer'
// //       ];
      
// //       if (!validFilingStatuses.includes(req.body.filingStatus)) {
// //         return res.status(400).json({ 
// //           success: false, 
// //           error: 'Invalid filing status provided' 
// //         });
// //       }
// //     }
    
// //     const contract = await Contract.findById(req.params.id);
// //     if (!contract) {
// //       return res.status(404).json({ success: false, error: 'Contract not found' });
// //     }
    
// //     // Check if salary is being updated
// //     if (req.body.basicSalary && req.body.basicSalary !== contract.basicSalary) {
// //       if (!contract.salaryHistory) contract.salaryHistory = [];
      
// //       // Add to salary history
// //       req.body.salaryHistory = [
// //         ...(contract.salaryHistory || []),
// //         {
// //           amount: req.body.basicSalary,
// //           effectiveDate: new Date(),
// //           reason: req.body.salaryChangeReason || 'Salary adjustment'
// //         }
// //       ];
// //     }
    
// //     const updatedContract = await Contract.findByIdAndUpdate(
// //       req.params.id,
// //       req.body,
// //       { new: true, runValidators: true }
// //     );
    
// //     res.status(200).json({ success: true, data: updatedContract });
// //   } catch (error) {
// //     res.status(400).json({ success: false, error: error.message });
// //   }
// // };

// // export const deleteContract = async (req, res) => {
// //   try {
// //     const contract = await Contract.findById(req.params.id);
// //     if (!contract) {
// //       return res.status(404).json({ success: false, error: 'Contract not found' });
// //     }
    
// //     await Contract.findByIdAndDelete(req.params.id);
// //     res.status(200).json({ success: true, message: 'Contract deleted successfully' });
// //   } catch (error) {
// //     res.status(400).json({ success: false, error: error.message });
// //   }
// // };

// // export const filterContracts = async (req, res) => {
// //   try {
// //     const { 
// //       contractStatus, 
// //       employeeName, 
// //       wageType,
// //       department,
// //       minSalary,
// //       maxSalary,
// //       startDate,
// //       endDate,
// //       filingStatus
// //     } = req.query;
    
// //     console.log("Received filter query:", req.query);
    
// //     const filter = {};

// //     // Handle employee name filter - frontend sends employeeName but schema has employee field
// //     if (employeeName) {
// //       filter.employee = { $regex: employeeName, $options: 'i' };
// //     }
    
// //     // Handle contract status filter - exact match
// //     if (contractStatus) {
// //       filter.contractStatus = contractStatus;
// //     }
    
// //     // Handle wage type filter - exact match
// //     if (wageType) {
// //       filter.wageType = wageType;
// //     }

// //     // Handle filing status filter - exact match
// //      if (filingStatus) {
// //       filter.filingStatus = filingStatus;
// //     }
    
// //     // Handle additional filters (these are optional but included for completeness)
// //     if (department) {
// //       filter.department = department;
// //     }
    
// //     if (startDate) {
// //       filter.startDate = { $gte: startDate };
// //     }
    
// //     if (endDate) {
// //       filter.endDate = { $lte: endDate };
// //     }
    
// //     if (minSalary || maxSalary) {
// //       filter.basicSalary = {};
// //       if (minSalary) {
// //         filter.basicSalary.$gte = Number(minSalary);
// //       }
// //       if (maxSalary) {
// //         filter.basicSalary.$lte = Number(maxSalary);
// //       }
// //     }
    
// //     console.log('Final filter query:', filter);
    
// //     const contracts = await Contract.find(filter);
// //     console.log(`Found ${contracts.length} matching contracts`);
    
// //     res.status(200).json({ success: true, data: contracts });
// //   } catch (error) {
// //     console.error('Filter error:', error);
// //     res.status(400).json({ success: false, error: error.message });
// //   }
// // };

// // export const updateApprovalStatus = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { approverName, approverRole, status, comments } = req.body;
    
// //     if (!approverName || !approverRole || !status) {
// //       return res.status(400).json({ 
// //         success: false, 
// //         error: 'Approver name, role and status are required' 
// //       });
// //     }
    
// //     const contract = await Contract.findById(id);
// //     if (!contract) {
// //       return res.status(404).json({ success: false, error: 'Contract not found' });
// //     }
    
// //     // Initialize approval status if it doesn't exist
// //     if (!contract.approvalStatus) {
// //       contract.approvalStatus = {
// //         status: 'Pending',
// //         approvers: []
// //       };
// //     }
    
// //     // Check if this approver already exists
// //     const approverIndex = contract.approvalStatus.approvers.findIndex(
// //       a => a.name === approverName && a.role === approverRole
// //     );
    
// //     if (approverIndex >= 0) {
// //       // Update existing approver
// //       contract.approvalStatus.approvers[approverIndex] = {
// //         name: approverName,
// //         role: approverRole,
// //         status,
// //         date: new Date(),
// //         comments: comments || contract.approvalStatus.approvers[approverIndex].comments
// //       };
// //     } else {
// //       // Add new approver
// //       contract.approvalStatus.approvers.push({
// //         name: approverName,
// //         role: approverRole,
// //         status,
// //         date: new Date(),
// //         comments
// //       });
// //     }
    
// //     // Update overall status based on approvers
// //     const allApproved = contract.approvalStatus.approvers.every(a => a.status === 'Approved');
// //     const anyRejected = contract.approvalStatus.approvers.some(a => a.status === 'Rejected');
    
// //     if (anyRejected) {
// //       contract.approvalStatus.status = 'Rejected';
// //     } else if (allApproved) {
// //       contract.approvalStatus.status = 'Approved';
// //     } else {
// //       contract.approvalStatus.status = 'Pending';
// //     }
    
// //     await contract.save();
    
// //     res.status(200).json({ success: true, data: contract });
// //   } catch (error) {
// //     res.status(400).json({ success: false, error: error.message });
// //   }
// // };

// export const updateComplianceDocuments = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { documentName, status, dueDate, submittedDate } = req.body;
    
//     if (!documentName || !status) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Document name and status are required' 
//       });
//     }
    
//     const contract = await Contract.findById(id);
//     if (!contract) {
//       return res.status(404).json({ success: false, error: 'Contract not found' });
//     }
    
//     // Initialize compliance documents if they don't exist
//     if (!contract.complianceDocuments) {
//       contract.complianceDocuments = [];
//     }
    
//     // Check if this document already exists
//     const docIndex = contract.complianceDocuments.findIndex(
//       d => d.documentName === documentName
//     );
    
//     if (docIndex >= 0) {
//       // Update existing document
//       contract.complianceDocuments[docIndex] = {
//         documentName,
//         status,
//         dueDate: dueDate || contract.complianceDocuments[docIndex].dueDate,
//         submittedDate: submittedDate || contract.complianceDocuments[docIndex].submittedDate
//       };
//     } else {
//       // Add new document
//       contract.complianceDocuments.push({
//         documentName,
//         status,
//         dueDate,
//         submittedDate
//       });
//     }
    
//     await contract.save();
    
//     res.status(200).json({ success: true, data: contract });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// export const terminateContract = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { terminationReason, terminationDate } = req.body;
    
//     if (!terminationReason) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Termination reason is required' 
//       });
//     }
    
//     const contract = await Contract.findById(id);
//     if (!contract) {
//       return res.status(404).json({ success: false, error: 'Contract not found' });
//     }
    
//     // Update contract status to terminated
//     contract.contractStatus = 'Terminated';
    
//     // Add termination details to notes
//     const terminationNote = `Contract terminated on ${terminationDate || new Date().toISOString().split('T')[0]} due to: ${terminationReason}`;
//     contract.note = contract.note 
//       ? `${contract.note}\n\n${terminationNote}` 
//       : terminationNote;
    
//     // If termination date is provided, update end date
//     if (terminationDate) {
//       contract.endDate = terminationDate;
//     }
    
//     await contract.save();
    
//     res.status(200).json({ 
//       success: true, 
//       data: contract,
//       message: 'Contract terminated successfully' 
//     });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// export const getDashboardStats = async (req, res) => {
//   try {
//     // Get total count of contracts
//     const totalContracts = await Contract.countDocuments();
    
//     // Get count by status
//     const activeContracts = await Contract.countDocuments({ contractStatus: 'Active' });
//     const draftContracts = await Contract.countDocuments({ contractStatus: 'Draft' });
//     const expiredContracts = await Contract.countDocuments({ contractStatus: 'Expired' });
//     const terminatedContracts = await Contract.countDocuments({ contractStatus: 'Terminated' });
    
//     // Get count by contract type
//     const fullTimeContracts = await Contract.countDocuments({ contract: 'Full-time' });
//     const partTimeContracts = await Contract.countDocuments({ contract: 'Part-time' });
    
//     // Get contracts expiring in the next 30 days
//     const today = new Date();
//     const thirtyDaysLater = new Date();
//     thirtyDaysLater.setDate(today.getDate() + 30);
    
//     const expiringContracts = await Contract.find({
//       endDate: { 
//         $gte: today.toISOString().split('T')[0],
//         $lte: thirtyDaysLater.toISOString().split('T')[0]
//       },
//       contractStatus: 'Active'
//     });
    
//     // Get contracts by department
//     const departmentStats = await Contract.aggregate([
//       { $match: { department: { $exists: true, $ne: "" } } },
//       { $group: { _id: "$department", count: { $sum: 1 } } },
//       { $sort: { count: -1 } }
//     ]);
    
//     // Get salary distribution
//     const salaryStats = await Contract.aggregate([
//       { 
//         $group: { 
//           _id: null, 
//           avgSalary: { $avg: "$basicSalary" },
//           minSalary: { $min: "$basicSalary" },
//           maxSalary: { $max: "$basicSalary" },
//           totalSalary: { $sum: "$basicSalary" }
//         } 
//       }
//     ]);
    
//     res.status(200).json({
//       success: true,
//       data: {
//         totalContracts,
//         byStatus: {
//           active: activeContracts,
//           draft: draftContracts,
//           expired: expiredContracts,
//           terminated: terminatedContracts
//         },
//         byType: {
//           fullTime: fullTimeContracts,
//           partTime: partTimeContracts
//         },
//         expiringContracts: {
//           count: expiringContracts.length,
//           contracts: expiringContracts
//         },
//         departmentStats,
//         salaryStats: salaryStats[0] || {
//           avgSalary: 0,
//           minSalary: 0,
//           maxSalary: 0,
//           totalSalary: 0
//         }
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// export const renewContract = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { 
//       startDate, 
//       endDate, 
//       basicSalary, 
//       renewalReason 
//     } = req.body;
    
//     if (!startDate) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Start date is required for renewal' 
//       });
//     }
    
//     // Find the original contract
//     const originalContract = await Contract.findById(id);
//     if (!originalContract) {
//       return res.status(404).json({ success: false, error: 'Contract not found' });
//     }
    
//     // Create a new contract based on the original
//     const newContractData = {
//       contract: originalContract.contract,
//       employee: originalContract.employee,
//       startDate,
//       endDate,
//       wageType: originalContract.wageType,
//       basicSalary: basicSalary || originalContract.basicSalary,
//       filingStatus: originalContract.filingStatus,
//       contractStatus: 'Active',
//       department: originalContract.department,
//       position: originalContract.position,
//       role: originalContract.role,
//       shift: originalContract.shift,
//       workType: originalContract.workType,
//       noticePeriod: originalContract.noticePeriod,
//       deductFromBasicPay: originalContract.deductFromBasicPay,
//       calculateDailyLeave: originalContract.calculateDailyLeave,
//       payFrequency: originalContract.payFrequency,
//       renewalHistory: [{
//         previousContractId: originalContract._id,
//         renewalDate: new Date(),
//         reason: renewalReason || 'Contract renewal'
//       }]
//     };
    
//     // Add salary history if salary changed
//     if (basicSalary && basicSalary !== originalContract.basicSalary) {
//       newContractData.salaryHistory = [
//         ...(originalContract.salaryHistory || []),
//         {
//           amount: basicSalary,
//           effectiveDate: new Date(startDate),
//           reason: 'Salary adjustment during contract renewal'
//         }
//       ];
//     } else {
//       newContractData.salaryHistory = originalContract.salaryHistory;
//     }
    
//     // Create the new contract
//     const newContract = new Contract(newContractData);
//     const savedContract = await newContract.save();
    
//     // Update the original contract status to expired if it was active
//     if (originalContract.contractStatus === 'Active') {
//       originalContract.contractStatus = 'Expired';
//       originalContract.note = originalContract.note 
//         ? `${originalContract.note}\n\nRenewed on ${new Date().toISOString().split('T')[0]}. New contract ID: ${savedContract._id}`
//         : `Renewed on ${new Date().toISOString().split('T')[0]}. New contract ID: ${savedContract._id}`;
      
//       await originalContract.save();
//     }
    
//     res.status(201).json({ 
//       success: true, 
//       data: savedContract,
//       message: 'Contract renewed successfully'
//     });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// export const bulkUpdateContracts = async (req, res) => {
//   try {
//     const { ids, updateData } = req.body;
    
//     if (!ids || !Array.isArray(ids) || ids.length === 0) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Contract IDs array is required' 
//       });
//     }
    
//     if (!updateData || Object.keys(updateData).length === 0) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Update data is required' 
//       });
//     }
    
//     // Check if filing status is being updated and is valid
//     if (updateData.filingStatus) {
//       const validFilingStatuses = [
//         'Individual', 
//         'Head of Household (HOH)', 
//         'Married Filing Jointly (MFJ)', 
//         'Married Filing Separately (MFS)', 
//         'Single Filer'
//       ];
      
//       if (!validFilingStatuses.includes(updateData.filingStatus)) {
//         return res.status(400).json({ 
//           success: false, 
//           error: 'Invalid filing status provided' 
//         });
//       }
//     }
    
//     const result = await Contract.updateMany(
//       { _id: { $in: ids } },
//       { $set: updateData }
//     );
    
//     res.status(200).json({ 
//       success: true, 
//       message: `${result.modifiedCount} contracts updated successfully`,
//       data: { modifiedCount: result.modifiedCount }
//     });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// };



import Contract, { contractSchema } from '../models/payrollContractModel.js';
import getModelForCompany from '../models/genericModelFactory.js';

export const getContracts = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Fetching contracts for company: ${companyCode}`);
    
    // Get company-specific Contract model
    const CompanyContract = await getModelForCompany(companyCode, 'Contract', contractSchema);
    
    // Get contracts from company database
    const contracts = await CompanyContract.find();
    
    console.log(`Retrieved ${contracts.length} contracts for company ${companyCode}`);
    res.status(200).json({ success: true, data: contracts });
  } catch (error) {
    console.error(`Error fetching contracts:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getContractById = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Contract ID is required' 
      });
    }
    
    console.log(`Fetching contract ${id} for company: ${companyCode}`);
    
    // Get company-specific Contract model
    const CompanyContract = await getModelForCompany(companyCode, 'Contract', contractSchema);
    
    // Get contract from company database
    const contract = await CompanyContract.findById(id);
    
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
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Creating contract for company: ${companyCode}`);
    
    // Get company-specific Contract model
    const CompanyContract = await getModelForCompany(companyCode, 'Contract', contractSchema);
    
    // Check if filing status is valid (if provided)
    if (req.body.filingStatus) {
      const validFilingStatuses = [
        'Individual', 
        'Head of Household (HOH)', 
        'Married Filing Jointly (MFJ)', 
        'Married Filing Separately (MFS)', 
        'Single Filer'
      ];
      
      if (!validFilingStatuses.includes(req.body.filingStatus)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid filing status provided' 
        });
      }
    }
    
    // Check if this is a renewal
    if (req.body.previousContractId) {
      const previousContract = await CompanyContract.findById(req.body.previousContractId);
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
    
    const newContract = new CompanyContract(req.body);
    const savedContract = await newContract.save();
    
    console.log(`Contract created successfully for ${req.body.employee}`);
    res.status(201).json({ success: true, data: savedContract });
  } catch (error) {
    console.error('Error creating contract:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

export const updateContract = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Contract ID is required' 
      });
    }
    
    console.log(`Updating contract ${id} for company: ${companyCode}`);
    
    // Get company-specific Contract model
    const CompanyContract = await getModelForCompany(companyCode, 'Contract', contractSchema);
    
    // Check if filing status is valid (if being updated)
    if (req.body.filingStatus) {
      const validFilingStatuses = [
        'Individual', 
        'Head of Household (HOH)', 
        'Married Filing Jointly (MFJ)', 
        'Married Filing Separately (MFS)', 
        'Single Filer'
      ];
      
      if (!validFilingStatuses.includes(req.body.filingStatus)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid filing status provided' 
        });
      }
    }
    
    const contract = await CompanyContract.findById(req.params.id);
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
    
    const updatedContract = await CompanyContract.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    console.log(`Contract ${id} updated successfully`);
    res.status(200).json({ success: true, data: updatedContract });
  } catch (error) {
    console.error(`Error updating contract ${req.params.id}:`, error);
    res.status(400).json({ success: false, error: error.message });
  }
};

export const deleteContract = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Contract ID is required' 
      });
    }
    
    console.log(`Deleting contract ${id} for company: ${companyCode}`);
    
    // Get company-specific Contract model
    const CompanyContract = await getModelForCompany(companyCode, 'Contract', contractSchema);
    
    const contract = await CompanyContract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({ success: false, error: 'Contract not found' });
    }
    
    await CompanyContract.findByIdAndDelete(req.params.id);
    
    console.log(`Contract ${id} deleted successfully`);
    res.status(200).json({ success: true, message: 'Contract deleted successfully' });
  } catch (error) {
    console.error(`Error deleting contract ${req.params.id}:`, error);
    res.status(400).json({ success: false, error: error.message });
  }
};

export const filterContracts = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { 
      contractStatus, 
      employeeName, 
      wageType,
      department,
      minSalary,
      maxSalary,
      startDate,
      endDate,
      filingStatus
    } = req.query;
    
    console.log("Received filter query:", req.query);
    
    // Get company-specific Contract model
    const CompanyContract = await getModelForCompany(companyCode, 'Contract', contractSchema);
    
    const filter = {};

    // Handle employee name filter - frontend sends employeeName but schema has employee field
    if (employeeName) {
      filter.employee = { $regex: employeeName, $options: 'i' };
    }
    
    // Handle contract status filter - exact match
    if (contractStatus) {
      filter.contractStatus = contractStatus;
    }
    
    // Handle wage type filter - exact match
    if (wageType) {
      filter.wageType = wageType;
    }

    // Handle filing status filter - exact match
     if (filingStatus) {
      filter.filingStatus = filingStatus;
    }
    
    // Handle additional filters (these are optional but included for completeness)
    if (department) {
      filter.department = department;
    }
    
    if (startDate) {
      filter.startDate = { $gte: startDate };
    }
    
    if (endDate) {
      filter.endDate = { $lte: endDate };
    }
    
    if (minSalary || maxSalary) {
      filter.basicSalary = {};
      if (minSalary) {
        filter.basicSalary.$gte = Number(minSalary);
      }
      if (maxSalary) {
        filter.basicSalary.$lte = Number(maxSalary);
      }
    }
    
    console.log('Final filter query:', filter);
    
    const contracts = await CompanyContract.find(filter);
    console.log(`Found ${contracts.length} matching contracts`);
    
    res.status(200).json({ success: true, data: contracts });
  } catch (error) {
    console.error('Filter error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

export const updateApprovalStatus = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { id } = req.params;
    const { approverName, approverRole, status, comments } = req.body;
    
    if (!approverName || !approverRole || !status) {
      return res.status(400).json({ 
        success: false, 
        error: 'Approver name, role and status are required' 
      });
    }
    
    // Get company-specific Contract model
    const CompanyContract = await getModelForCompany(companyCode, 'Contract', contractSchema);
    
    const contract = await CompanyContract.findById(id);
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
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { id } = req.params;
    const { documents } = req.body;
    
    if (!Array.isArray(documents)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Documents must be an array' 
      });
    }
    
    // Get company-specific Contract model
    const CompanyContract = await getModelForCompany(companyCode, 'Contract', contractSchema);
    
    const contract = await CompanyContract.findById(id);
    if (!contract) {
      return res.status(404).json({ success: false, error: 'Contract not found' });
    }
    
    // Update compliance documents
    contract.complianceDocuments = documents;
    await contract.save();
    
    res.status(200).json({ success: true, data: contract });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const terminateContract = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { id } = req.params;
    const { terminationReason } = req.body;
    
    // Get company-specific Contract model
    const CompanyContract = await getModelForCompany(companyCode, 'Contract', contractSchema);
    
    const contract = await CompanyContract.findById(id);
    if (!contract) {
      return res.status(404).json({ success: false, error: 'Contract not found' });
    }
    
    // Update contract status
    contract.contractStatus = 'Terminated';
    
    // Add termination reason to notes if provided
    if (terminationReason) {
      contract.note = contract.note 
        ? `${contract.note}\n\nTermination reason: ${terminationReason}`
        : `Termination reason: ${terminationReason}`;
    }
    
    await contract.save();
    
    res.status(200).json({ success: true, data: contract });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    // Get company-specific Contract model
    const CompanyContract = await getModelForCompany(companyCode, 'Contract', contractSchema);
    
    // Get total count of contracts
    const totalContracts = await CompanyContract.countDocuments();
    
    // Get count by status
    const activeContracts = await CompanyContract.countDocuments({ contractStatus: 'Active' });
    const draftContracts = await CompanyContract.countDocuments({ contractStatus: 'Draft' });
    const expiredContracts = await CompanyContract.countDocuments({ contractStatus: 'Expired' });
    const terminatedContracts = await CompanyContract.countDocuments({ contractStatus: 'Terminated' });
    
    // Get count by approval status
    const pendingApproval = await CompanyContract.countDocuments({ 'approvalStatus.status': 'Pending' });
    const approved = await CompanyContract.countDocuments({ 'approvalStatus.status': 'Approved' });
    const rejected = await CompanyContract.countDocuments({ 'approvalStatus.status': 'Rejected' });
    
    // Get contracts expiring in the next 30 days
    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);
    
    const todayStr = today.toISOString().split('T')[0];
    const thirtyDaysLaterStr = thirtyDaysLater.toISOString().split('T')[0];
    
    const expiringContracts = await CompanyContract.countDocuments({
      contractStatus: 'Active',
      endDate: { 
        $gte: todayStr, 
        $lte: thirtyDaysLaterStr 
      }
    });
    
    // Get average contract duration in days
    const contracts = await CompanyContract.find({
      startDate: { $exists: true },
      endDate: { $exists: true }
    });
    
    let totalDuration = 0;
    let contractsWithDuration = 0;
    
    contracts.forEach(contract => {
      if (contract.startDate && contract.endDate) {
        const start = new Date(contract.startDate);
        const end = new Date(contract.endDate);
        const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        
        if (duration > 0) {
          totalDuration += duration;
          contractsWithDuration++;
        }
      }
    });
    
    const averageDuration = contractsWithDuration > 0 
      ? Math.round(totalDuration / contractsWithDuration) 
      : 0;
    
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
        byApproval: {
          pending: pendingApproval,
          approved: approved,
          rejected: rejected
        },
        expiringContracts,
        averageDuration
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const renewContract = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { id } = req.params;
    const { 
      startDate, 
      endDate, 
      basicSalary, 
      renewalReason,
      contractStatus = 'Active'
    } = req.body;
    
    if (!startDate) {
      return res.status(400).json({ 
        success: false, 
        error: 'Start date is required for renewal' 
      });
    }
    
    // Get company-specific Contract model
    const CompanyContract = await getModelForCompany(companyCode, 'Contract', contractSchema);
    
    // Get the original contract
    const originalContract = await CompanyContract.findById(id);
    if (!originalContract) {
      return res.status(404).json({ success: false, error: 'Contract not found' });
    }
    
    // Create a new contract based on the original
    const newContractData = {
      ...originalContract.toObject(),
      _id: undefined, // Remove the _id so a new one will be generated
      startDate,
      endDate,
      basicSalary: basicSalary || originalContract.basicSalary,
      contractStatus,
      renewalHistory: [
        ...(originalContract.renewalHistory || []),
        {
          previousContractId: originalContract._id,
          renewalDate: new Date(),
          reason: renewalReason || 'Contract renewal'
        }
      ]
    };
    
    // Update salary history if salary changed
    if (basicSalary && basicSalary !== originalContract.basicSalary) {
      newContractData.salaryHistory = [
        ...(originalContract.salaryHistory || []),
        {
          amount: basicSalary,
          effectiveDate: new Date(startDate),
          reason: 'Contract renewal with salary adjustment'
        }
      ];
    }
    
    // Create the new contract
    const newContract = new CompanyContract(newContractData);
    await newContract.save();
    
    // Update the original contract if it's still active
    if (originalContract.contractStatus === 'Active') {
      originalContract.contractStatus = 'Expired';
      originalContract.note = originalContract.note 
        ? `${originalContract.note}\n\nRenewed on ${new Date().toISOString().split('T')[0]}`
        : `Renewed on ${new Date().toISOString().split('T')[0]}`;
      
      await originalContract.save();
    }
    
    res.status(201).json({ 
      success: true, 
      data: newContract,
      message: 'Contract renewed successfully'
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const bulkUpdateContracts = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { contractIds, updates } = req.body;
    
    if (!Array.isArray(contractIds) || contractIds.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Contract IDs array is required and must not be empty' 
      });
    }
    
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Updates object is required and must not be empty' 
      });
    }
    
    // Get company-specific Contract model
    const CompanyContract = await getModelForCompany(companyCode, 'Contract', contractSchema);
    
    // Update multiple contracts
    const result = await CompanyContract.updateMany(
      { _id: { $in: contractIds } },
      { $set: updates }
    );
    
    res.status(200).json({ 
      success: true, 
      data: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      },
      message: `Updated ${result.modifiedCount} of ${result.matchedCount} contracts`
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};



