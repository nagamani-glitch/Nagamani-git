// import Offboarding from '../models/Offboarding.js';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export const getAllOffboardings = async (req, res) => {
//   try {
//     const offboardings = await Offboarding.find().sort({ createdAt: -1 });
//     res.status(200).json(offboardings);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const getOffboardingById = async (req, res) => {
//   try {
//     const offboarding = await Offboarding.findById(req.params.id);
//     if (!offboarding) {
//       return res.status(404).json({ message: 'Offboarding record not found' });
//     }
//     res.status(200).json(offboarding);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const createOffboarding = async (req, res) => {
//   try {
//     const newOffboarding = new Offboarding(req.body);
//     const savedOffboarding = await newOffboarding.save();
//     res.status(201).json(savedOffboarding);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const updateOffboarding = async (req, res) => {
//   try {
//     const updatedOffboarding = await Offboarding.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );
    
//     if (!updatedOffboarding) {
//       return res.status(404).json({ message: 'Offboarding record not found' });
//     }
    
//     res.status(200).json(updatedOffboarding);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const deleteOffboarding = async (req, res) => {
//   try {
//     const offboarding = await Offboarding.findById(req.params.id);
    
//     if (!offboarding) {
//       return res.status(404).json({ message: 'Offboarding record not found' });
//     }
    
//     // Delete associated documents if any
//     if (offboarding.documents && offboarding.documents.length > 0) {
//       offboarding.documents.forEach(doc => {
//         const filePath = path.join(__dirname, '..', 'uploads', doc.path);
//         if (fs.existsSync(filePath)) {
//           fs.unlinkSync(filePath);
//         }
//       });
//     }
    
//     await Offboarding.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: 'Offboarding deleted successfully' });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const getOffboardingsByStage = async (req, res) => {
//   try {
//     const offboardings = await Offboarding.find({ stage: req.params.stage }).sort({ createdAt: -1 });
//     res.status(200).json(offboardings);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const getOffboardingsByDepartment = async (req, res) => {
//   try {
//     const offboardings = await Offboarding.find({ department: req.params.department }).sort({ createdAt: -1 });
//     res.status(200).json(offboardings);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const getOffboardingsByManager = async (req, res) => {
//   try {
//     const offboardings = await Offboarding.find({ manager: req.params.manager }).sort({ createdAt: -1 });
//     res.status(200).json(offboardings);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const updateAssetStatus = async (req, res) => {
//   try {
//     const { id, assetIndex, status } = req.body;
    
//     const offboarding = await Offboarding.findById(id);
    
//     if (!offboarding) {
//       return res.status(404).json({ message: 'Offboarding record not found' });
//     }
    
//     if (!offboarding.assets || assetIndex >= offboarding.assets.length) {
//       return res.status(400).json({ message: 'Asset not found' });
//     }
    
//     offboarding.assets[assetIndex].status = status;
//     const updatedOffboarding = await offboarding.save();
    
//     res.status(200).json(updatedOffboarding);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const updateClearanceStatus = async (req, res) => {
//   try {
//     const { id, department, status } = req.body;
    
//     const offboarding = await Offboarding.findById(id);
    
//     if (!offboarding) {
//       return res.status(404).json({ message: 'Offboarding record not found' });
//     }
    
//     if (!offboarding.clearanceStatus) {
//       offboarding.clearanceStatus = {};
//     }
    
//     offboarding.clearanceStatus[department] = status;
    
//     // Check if all clearances are completed
//     const allCleared = Object.values(offboarding.clearanceStatus).every(val => val === true);
//     offboarding.exitChecklistCompleted = allCleared;
    
//     const updatedOffboarding = await offboarding.save();
    
//     res.status(200).json(updatedOffboarding);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const moveToNextStage = async (req, res) => {
//   try {
//     const { id, nextStage } = req.body;
    
//     const offboarding = await Offboarding.findById(id);
    
//     if (!offboarding) {
//       return res.status(404).json({ message: 'Offboarding record not found' });
//     }
    
//     offboarding.stage = nextStage;
//     const updatedOffboarding = await offboarding.save();
    
//     res.status(200).json(updatedOffboarding);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const uploadDocument = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }
    
//     const { employeeId, documentType } = req.body;
    
//     const offboarding = await Offboarding.findById(employeeId);
    
//     if (!offboarding) {
//       // Delete the uploaded file
//       fs.unlinkSync(req.file.path);
//       return res.status(404).json({ message: 'Offboarding record not found' });
//     }
    
//     const document = {
//       name: req.file.originalname,
//       type: documentType,
//       path: req.file.filename,
//       uploadedAt: new Date()
//     };
    
//     if (!offboarding.documents) {
//       offboarding.documents = [];
//     }
    
//     offboarding.documents.push(document);
//     const updatedOffboarding = await offboarding.save();
    
//     res.status(200).json({
//       message: 'Document uploaded successfully',
//       document,
//       offboarding: updatedOffboarding
//     });
//   } catch (error) {
//     // Delete the uploaded file if there was an error
//     if (req.file) {
//       fs.unlinkSync(req.file.path);
//     }
//     res.status(400).json({ message: error.message });
//   }
// };

// export const getDocuments = async (req, res) => {
//   try {
//     const offboarding = await Offboarding.findById(req.params.id);
    
//     if (!offboarding) {
//       return res.status(404).json({ message: 'Offboarding record not found' });
//     }
    
//     res.status(200).json(offboarding.documents || []);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const downloadDocument = async (req, res) => {
//   try {
//     const { id, documentId } = req.params;
    
//     const offboarding = await Offboarding.findById(id);
    
//     if (!offboarding) {
//       return res.status(404).json({ message: 'Offboarding record not found' });
//     }
    
//     const document = offboarding.documents.find(doc => doc._id.toString() === documentId);
    
//     if (!document) {
//       return res.status(404).json({ message: 'Document not found' });
//     }
    
//     const filePath = path.join(__dirname, '..', 'uploads', document.path);
    
//     if (!fs.existsSync(filePath)) {
//       return res.status(404).json({ message: 'File not found on server' });
//     }
    
//     res.download(filePath, document.name);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const deleteDocument = async (req, res) => {
//   try {
//     const { id, documentId } = req.params;
    
//     const offboarding = await Offboarding.findById(id);
    
//     if (!offboarding) {
//       return res.status(404).json({ message: 'Offboarding record not found' });
//     }
    
//     const documentIndex = offboarding.documents.findIndex(doc => doc._id.toString() === documentId);
    
//     if (documentIndex === -1) {
//       return res.status(404).json({ message: 'Document not found' });
//     }
    
//     const document = offboarding.documents[documentIndex];
//     const filePath = path.join(__dirname, '..', 'uploads', document.path);
    
//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//     }
    
//     offboarding.documents.splice(documentIndex, 1);
//     const updatedOffboarding = await offboarding.save();
    
//     res.status(200).json({
//       message: 'Document deleted successfully',
//       offboarding: updatedOffboarding
//     });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // export const getOffboardingStats = async (req, res) => {
// //   try {
// //     const stats = {
// //       totalOffboardings: 0,
// //       byStage: {},
// //       byDepartment: {},
// //       recentOffboardings: [],
// //       upcomingExits: []
// //     };
    
// //     // Get total count
// //     stats.totalOffboardings = await Offboarding.countDocuments();
    
// //     // Get counts by stage
// //     const stages = ['Notice Period', 'Exit Interview', 'Work Handover', 'Clearance Process'];
// //     for (const stage of stages) {
// //       stats.byStage[stage] = await Offboarding.countDocuments({ stage });
// //     }
    
// //     // Get counts by department
// //     const departmentCounts = await Offboarding.aggregate([
// //       { $group: { _id: '$department', count: { $sum: 1 } } }
// //     ]);
    
// //     departmentCounts.forEach(dept => {
// //       if (dept._id) {
// //         stats.byDepartment[dept._id] = dept.count;
// //       }
// //     });
    
// //     // Get recent offboardings
// //     stats.recentOffboardings = await Offboarding.find()
// //       .sort({ createdAt: -1 })
// //       .limit(5)
// //       .select('employeeName department stage startDate endDate');
    
// //     // Get upcoming exits (employees whose end date is in the future)
// //     const today = new Date();
// //     today.setHours(0, 0, 0, 0);
    
// //     stats.upcomingExits = await Offboarding.find({ endDate: { $gte: today } })
// //       .sort({ endDate: 1 })
// //       .limit(5)
// //       .select('employeeName department stage startDate endDate');
    
// //     res.status(200).json(stats);
// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // };

// // Add this new function to offboardingController.js

// export const getOffboardingStats = async (req, res) => {
//   try {
//     const { period, startDate } = req.query;
    
//     // Parse the start date if provided
//     const queryStartDate = startDate ? new Date(startDate) : new Date();
    
//     // Set default period to 6 months if not specified
//     let queryPeriod = period || '6m';
    
//     // Calculate the date range based on the period
//     let dateFilter = {};
//     const endDate = new Date();
    
//     switch (queryPeriod) {
//       case '1m':
//         queryStartDate.setMonth(endDate.getMonth() - 1);
//         break;
//       case '3m':
//         queryStartDate.setMonth(endDate.getMonth() - 3);
//         break;
//       case '6m':
//         queryStartDate.setMonth(endDate.getMonth() - 6);
//         break;
//       case '1y':
//         queryStartDate.setFullYear(endDate.getFullYear() - 1);
//         break;
//       default:
//         queryStartDate.setMonth(endDate.getMonth() - 6);
//     }
    
//     dateFilter = {
//       endDate: { $gte: queryStartDate, $lte: endDate }
//     };
    
//     // Get total offboarded employees (those who completed the clearance process)
//     const totalOffboarded = await Offboarding.countDocuments({
//       stage: "Clearance Process",
//       exitChecklistCompleted: true
//     });
    
//     // Get monthly trends data
//     const offboardingTrends = await Offboarding.aggregate([
//       {
//         $match: {
//           ...dateFilter,
//           stage: "Clearance Process"
//         }
//       },
//       {
//         $group: {
//           _id: {
//             year: { $year: "$endDate" },
//             month: { $month: "$endDate" }
//           },
//           count: { $sum: 1 }
//         }
//       },
//       {
//         $sort: { "_id.year": 1, "_id.month": 1 }
//       }
//     ]);
    
//     // Format the trends data to match the expected format in the frontend
//     const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//     const trendData = offboardingTrends.map(item => ({
//       month: months[item._id.month - 1],
//       offboarded: item.count
//     }));
    
//     // Get department-wise offboarding data
//     const departmentData = await Offboarding.aggregate([
//       {
//         $match: {
//           stage: "Clearance Process",
//           exitChecklistCompleted: true
//         }
//       },
//       {
//         $group: {
//           _id: "$department",
//           value: { $sum: 1 }
//         }
//       },
//       {
//         $project: {
//           _id: 0,
//           name: "$_id",
//           value: 1
//         }
//       }
//     ]);
    
//     // Handle departments with null values
//     const formattedDepartmentData = departmentData.map(dept => ({
//       name: dept.name || "Unassigned",
//       value: dept.value
//     }));
    
//     res.status(200).json({
//       success: true,
//       data: {
//         totalOffboarded,
//         trendData,
//         departmentData: formattedDepartmentData
//       }
//     });
//   } catch (error) {
//     console.error("Error fetching offboarding stats:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: "Failed to fetch offboarding statistics",
//       error: error.message 
//     });
//   }
// };

import Offboarding, { offboardingSchema } from '../models/Offboarding.js';
import getModelForCompany from '../models/genericModelFactory.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllOffboardings = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Fetching all offboardings for company: ${companyCode}`);
    
    // Get company-specific Offboarding model
    const CompanyOffboarding = await getModelForCompany(companyCode, 'Offboarding', offboardingSchema);
    
    const offboardings = await CompanyOffboarding.find().sort({ createdAt: -1 });
    res.status(200).json(offboardings);
  } catch (error) {
    console.error('Error fetching all offboardings:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getOffboardingById = async (req, res) => {
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
    
    console.log(`Fetching offboarding ${id} for company: ${companyCode}`);
    
    // Get company-specific Offboarding model
    const CompanyOffboarding = await getModelForCompany(companyCode, 'Offboarding', offboardingSchema);
    
    const offboarding = await CompanyOffboarding.findById(id);
    if (!offboarding) {
      return res.status(404).json({ message: 'Offboarding record not found' });
    }
    res.status(200).json(offboarding);
  } catch (error) {
    console.error('Error fetching offboarding by ID:', error);
    res.status(500).json({ message: error.message });
  }
};

export const createOffboarding = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Creating offboarding for company: ${companyCode}`);
    
    // Get company-specific Offboarding model
    const CompanyOffboarding = await getModelForCompany(companyCode, 'Offboarding', offboardingSchema);
    
    const newOffboarding = new CompanyOffboarding(req.body);
    const savedOffboarding = await newOffboarding.save();
    res.status(201).json(savedOffboarding);
  } catch (error) {
    console.error('Error creating offboarding:', error);
    res.status(400).json({ message: error.message });
  }
};

export const updateOffboarding = async (req, res) => {
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
    
    console.log(`Updating offboarding ${id} for company: ${companyCode}`);
    
    // Get company-specific Offboarding model
    const CompanyOffboarding = await getModelForCompany(companyCode, 'Offboarding', offboardingSchema);
    
    const updatedOffboarding = await CompanyOffboarding.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedOffboarding) {
      return res.status(404).json({ message: 'Offboarding record not found' });
    }
    
    res.status(200).json(updatedOffboarding);
  } catch (error) {
    console.error('Error updating offboarding:', error);
    res.status(400).json({ message: error.message });
  }
};

export const deleteOffboarding = async (req, res) => {
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
    
    console.log(`Deleting offboarding ${id} for company: ${companyCode}`);
    
    // Get company-specific Offboarding model
    const CompanyOffboarding = await getModelForCompany(companyCode, 'Offboarding', offboardingSchema);
    
    const offboarding = await CompanyOffboarding.findById(id);
    
    if (!offboarding) {
      return res.status(404).json({ message: 'Offboarding record not found' });
    }
    
    // Delete associated documents if any
    if (offboarding.documents && offboarding.documents.length > 0) {
      offboarding.documents.forEach(doc => {
        const filePath = path.join(__dirname, '..', 'uploads', doc.path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    
    await CompanyOffboarding.findByIdAndDelete(id);
    res.status(200).json({ message: 'Offboarding deleted successfully' });
  } catch (error) {
    console.error('Error deleting offboarding:', error);
    res.status(400).json({ message: error.message });
  }
};

export const getOffboardingsByStage = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { stage } = req.params;
    
    console.log(`Fetching offboardings by stage ${stage} for company: ${companyCode}`);
    
    // Get company-specific Offboarding model
    const CompanyOffboarding = await getModelForCompany(companyCode, 'Offboarding', offboardingSchema);
    
    const offboardings = await CompanyOffboarding.find({ stage }).sort({ createdAt: -1 });
    res.status(200).json(offboardings);
  } catch (error) {
    console.error('Error fetching offboardings by stage:', error);
    res.status(400).json({ message: error.message });
  }
};

export const getOffboardingsByDepartment = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { department } = req.params;
    
    console.log(`Fetching offboardings by department ${department} for company: ${companyCode}`);
    
    // Get company-specific Offboarding model
    const CompanyOffboarding = await getModelForCompany(companyCode, 'Offboarding', offboardingSchema);
    
    const offboardings = await CompanyOffboarding.find({ department }).sort({ createdAt: -1 });
    res.status(200).json(offboardings);
  } catch (error) {
    console.error('Error fetching offboardings by department:', error);
    res.status(400).json({ message: error.message });
  }
};

export const getOffboardingsByManager = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { manager } = req.params;
    
    console.log(`Fetching offboardings by manager ${manager} for company: ${companyCode}`);
    
    // Get company-specific Offboarding model
    const CompanyOffboarding = await getModelForCompany(companyCode, 'Offboarding', offboardingSchema);
    
    const offboardings = await CompanyOffboarding.find({ manager }).sort({ createdAt: -1 });
    res.status(200).json(offboardings);
  } catch (error) {
    console.error('Error fetching offboardings by manager:', error);
    res.status(400).json({ message: error.message });
  }
};

export const updateAssetStatus = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { id, assetIndex, status } = req.body;
    
    console.log(`Updating asset status for offboarding ${id} for company: ${companyCode}`);
    
    // Get company-specific Offboarding model
    const CompanyOffboarding = await getModelForCompany(companyCode, 'Offboarding', offboardingSchema);
    
    const offboarding = await CompanyOffboarding.findById(id);
    
    if (!offboarding) {
      return res.status(404).json({ message: 'Offboarding record not found' });
    }
    
    if (!offboarding.assets || assetIndex >= offboarding.assets.length) {
      return res.status(400).json({ message: 'Asset not found' });
    }
    
    offboarding.assets[assetIndex].status = status;
    const updatedOffboarding = await offboarding.save();
    
    res.status(200).json(updatedOffboarding);
  } catch (error) {
    console.error('Error updating asset status:', error);
    res.status(400).json({ message: error.message });
  }
};

export const updateClearanceStatus = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { id, department, status } = req.body;
    
        console.log(`Updating clearance status for offboarding ${id} for company: ${companyCode}`);
    
    // Get company-specific Offboarding model
    const CompanyOffboarding = await getModelForCompany(companyCode, 'Offboarding', offboardingSchema);
    
    const offboarding = await CompanyOffboarding.findById(id);
    
    if (!offboarding) {
      return res.status(404).json({ message: 'Offboarding record not found' });
    }
    
    if (!offboarding.clearanceStatus) {
      offboarding.clearanceStatus = {};
    }
    
    // Update the specific department's clearance status
    offboarding.clearanceStatus[department] = status;
    
    // Check if all clearances are completed
    const { hr, it, finance, admin } = offboarding.clearanceStatus;
    offboarding.exitChecklistCompleted = hr && it && finance && admin;
    
    const updatedOffboarding = await offboarding.save();
    
    res.status(200).json(updatedOffboarding);
  } catch (error) {
    console.error('Error updating clearance status:', error);
    res.status(400).json({ message: error.message });
  }
};

export const completeOffboarding = async (req, res) => {
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
    
    console.log(`Completing offboarding ${id} for company: ${companyCode}`);
    
    // Get company-specific Offboarding model
    const CompanyOffboarding = await getModelForCompany(companyCode, 'Offboarding', offboardingSchema);
    
    const offboarding = await CompanyOffboarding.findById(id);
    
    if (!offboarding) {
      return res.status(404).json({ message: 'Offboarding record not found' });
    }
    
    // Check if all clearances are completed
    if (!offboarding.exitChecklistCompleted) {
      return res.status(400).json({ message: 'Cannot complete offboarding until all clearances are approved' });
    }
    
    offboarding.officiallyOffboarded = true;
    offboarding.officiallyOffboardedDate = new Date();
    
    const updatedOffboarding = await offboarding.save();
    
    res.status(200).json(updatedOffboarding);
  } catch (error) {
    console.error('Error completing offboarding:', error);
    res.status(400).json({ message: error.message });
  }
};

export const getOffboardingStats = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Fetching offboarding stats for company: ${companyCode}`);
    
    // Get company-specific Offboarding model
    const CompanyOffboarding = await getModelForCompany(companyCode, 'Offboarding', offboardingSchema);
    
    // Get counts by stage
    const noticePeriodCount = await CompanyOffboarding.countDocuments({ stage: 'Notice Period' });
    const exitInterviewCount = await CompanyOffboarding.countDocuments({ stage: 'Exit Interview' });
    const workHandoverCount = await CompanyOffboarding.countDocuments({ stage: 'Work Handover' });
    const clearanceProcessCount = await CompanyOffboarding.countDocuments({ stage: 'Clearance Process' });
    
    // Get counts for completed offboardings
    const completedCount = await CompanyOffboarding.countDocuments({ officiallyOffboarded: true });
    
    // Get counts by department
    const departments = await CompanyOffboarding.distinct('department');
    const departmentCounts = {};
    
    for (const dept of departments) {
      if (dept) {
        departmentCounts[dept] = await CompanyOffboarding.countDocuments({ department: dept });
      }
    }
    
    // Get monthly offboarding counts for the current year
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31);
    
    const monthlyOffboardings = await CompanyOffboarding.aggregate([
      {
        $match: {
          officiallyOffboardedDate: { $gte: startOfYear, $lte: endOfYear }
        }
      },
      {
        $group: {
          _id: { $month: '$officiallyOffboardedDate' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Format monthly data
    const monthlyData = Array(12).fill(0);
    monthlyOffboardings.forEach(item => {
      monthlyData[item._id - 1] = item.count;
    });
    
    const stats = {
      totalOffboardings: await CompanyOffboarding.countDocuments(),
      byStage: {
        noticePeriod: noticePeriodCount,
        exitInterview: exitInterviewCount,
        workHandover: workHandoverCount,
        clearanceProcess: clearanceProcessCount
      },
      completed: completedCount,
      byDepartment: departmentCounts,
      monthlyData
    };
    
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching offboarding stats:', error);
    res.status(500).json({ message: error.message });
  }
};

export const uploadDocument = async (req, res) => {
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
    
    console.log(`Uploading document for offboarding ${id} for company: ${companyCode}`);
    
    // Get company-specific Offboarding model
    const CompanyOffboarding = await getModelForCompany(companyCode, 'Offboarding', offboardingSchema);
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const offboarding = await CompanyOffboarding.findById(id);
    
    if (!offboarding) {
      return res.status(404).json({ message: 'Offboarding record not found' });
    }
    
    const newDocument = {
      name: req.file.originalname,
      type: req.file.mimetype,
      path: req.file.filename,
      uploadedAt: new Date()
    };
    
    if (!offboarding.documents) {
      offboarding.documents = [];
    }
    
    offboarding.documents.push(newDocument);
    const updatedOffboarding = await offboarding.save();
    
    res.status(200).json(updatedOffboarding);
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(400).json({ message: error.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { id, documentIndex } = req.params;
    
    console.log(`Deleting document for offboarding ${id} for company: ${companyCode}`);
    
    // Get company-specific Offboarding model
    const CompanyOffboarding = await getModelForCompany(companyCode, 'Offboarding', offboardingSchema);
    
    const offboarding = await CompanyOffboarding.findById(id);
    
    if (!offboarding) {
      return res.status(404).json({ message: 'Offboarding record not found' });
    }
    
    if (!offboarding.documents || documentIndex >= offboarding.documents.length) {
      return res.status(400).json({ message: 'Document not found' });
    }
    
    // Delete the file from the filesystem
    const documentPath = offboarding.documents[documentIndex].path;
    const filePath = path.join(__dirname, '..', 'uploads', documentPath);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Remove the document from the array
    offboarding.documents.splice(documentIndex, 1);
    const updatedOffboarding = await offboarding.save();
    
    res.status(200).json(updatedOffboarding);
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(400).json({ message: error.message });
  }
};

export const getOffboardingsByDateRange = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { startDate, endDate } = req.query;
    
    console.log(`Fetching offboardings by date range for company: ${companyCode}`);
    
    // Get company-specific Offboarding model
    const CompanyOffboarding = await getModelForCompany(companyCode, 'Offboarding', offboardingSchema);
    
    const query = {};
    
    if (startDate && endDate) {
      query.startDate = { $gte: new Date(startDate) };
      query.endDate = { $lte: new Date(endDate) };
    } else if (startDate) {
      query.startDate = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.endDate = { $lte: new Date(endDate) };
    }
    
    const offboardings = await CompanyOffboarding.find(query).sort({ startDate: 1 });
    res.status(200).json(offboardings);
  } catch (error) {
    console.error('Error fetching offboardings by date range:', error);
    res.status(400).json({ message: error.message });
  }
};

export const searchOffboardings = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { term } = req.query;
    
    console.log(`Searching offboardings with term "${term}" for company: ${companyCode}`);
    
    // Get company-specific Offboarding model
    const CompanyOffboarding = await getModelForCompany(companyCode, 'Offboarding', offboardingSchema);
    
    if (!term) {
      return res.status(400).json({ message: 'Search term is required' });
    }
    
    const offboardings = await CompanyOffboarding.find({
      $or: [
        { employeeName: { $regex: term, $options: 'i' } },
        { employeeId: { $regex: term, $options: 'i' } },
        { department: { $regex: term, $options: 'i' } },
        { position: { $regex: term, $options: 'i' } },
        { manager: { $regex: term, $options: 'i' } },
        { reason: { $regex: term, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
    
    res.status(200).json(offboardings);
  } catch (error) {
    console.error('Error searching offboardings:', error);
    res.status(400).json({ message: error.message });
  }
};

