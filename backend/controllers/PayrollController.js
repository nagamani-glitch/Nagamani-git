import UnifiedPayroll from "../models/UnifiedPayroll.js";
import { PayrollPDFService } from "../services/PayrollPDFService.js";
import fs from 'fs';

export class PayrollController {
  // Employee Management
  static async bulkCreateEmployees(req, res) {
    try {
      const { employees } = req.body;
      const createdEmployees = await Promise.all(
        employees.map(async (employeeData) => {
          const employee = new UnifiedPayroll({
            ...employeeData,
            lop: parseFloat(employeeData.lop) || 0,
            payableDays: parseFloat(employeeData.payableDays) || 30,
            allowances: [],
            deductions: [],
            payslips: []
          });
          return await employee.save();
        })
      );

      res.status(201).json({
        success: true,
        data: createdEmployees,
        message: "Employees imported successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async createEmployee(req, res) {
    try {
      const employeeData = {
        ...req.body,
        lop: parseFloat(req.body.lop) || 0,
        payableDays: parseFloat(req.body.payableDays) || 30,
        allowances: [],
        deductions: [],
        payslips: []
      };

      const employee = new UnifiedPayroll(employeeData);
      await employee.save();
      res.status(201).json({
        success: true,
        data: employee,
        message: "Employee created successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getAllEmployees(req, res) {
    try {
      const employees = await UnifiedPayroll.find();
      res.status(200).json({
        success: true,
        data: employees,
        count: employees.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async updateEmployee(req, res) {
    try {
      const updateData = {
        ...req.body,
        lop: Math.round(parseFloat(req.body.lop) * 2) / 2, // Rounds to nearest 0.5
        payableDays: parseFloat(req.body.payableDays),
      };

      const employee = await UnifiedPayroll.findOneAndUpdate(
        { empId: req.params.empId },
        updateData,
        { new: true, runValidators: true }
      );

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }

      res.status(200).json({
        success: true,
        data: employee,
        message: "Employee updated successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async updateEmployeeLOP(req, res) {
    try {
      const { lop } = req.body;
      const roundedLOP = Math.round(parseFloat(lop) * 2) / 2;

      const employee = await UnifiedPayroll.findOneAndUpdate(
        { empId: req.params.empId },
        { lop: roundedLOP },
        { new: true, runValidators: true }
      );

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }

      res.status(200).json({
        success: true,
        data: employee,
        message: "LOP updated successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async deleteEmployee(req, res) {
    try {
      const employee = await UnifiedPayroll.findOneAndDelete({
        empId: req.params.empId,
      });

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Employee and related records deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

   // Allowance Management
  

  
static async createAllowance(req, res) {
  try {
    console.log("Creating allowance:", req.body);
    const { empId, name, percentage, amount, category, status, isRecurring, isBasicPay, baseAfterDeductions } = req.body;
    
    const employee = await UnifiedPayroll.findOne({ empId });
    if (!employee) {
      console.error("Employee not found:", empId);
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }
    
    // Check if allowance already exists
    const existingIndex = employee.allowances.findIndex(a => a.name === name);
    
    if (existingIndex >= 0) {
      console.log("Updating existing allowance:", name);
      // Update existing allowance
      employee.allowances[existingIndex] = {
        name,
        percentage: parseFloat(percentage),
        amount: parseFloat(amount),
        category: category || 'Regular',
        status: status || 'Active',
        isRecurring: isRecurring !== undefined ? isRecurring : true,
        isBasicPay: isBasicPay || name === "BASIC PAY" // Set isBasicPay flag
      };
    } else {
      console.log("Adding new allowance:", name);
      // Add new allowance
      employee.allowances.push({
        name,
        percentage: parseFloat(percentage),
        amount: parseFloat(amount),
        category: category || 'Regular',
        status: status || 'Active',
        isRecurring: isRecurring !== undefined ? isRecurring : true,
        isBasicPay: isBasicPay || name === "BASIC PAY" // Set isBasicPay flag
      });
    }
    
    await employee.save();
    console.log("Allowance saved successfully");
    
    res.status(201).json({
      success: true,
      data: employee,
      message: "Allowance added successfully",
    });
  } catch (error) {
    console.error("Error creating allowance:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

  static async getAllAllowances(req, res) {
    try {
      const employees = await UnifiedPayroll.find();
      
      // Extract all allowances from all employees
      const allowances = [];
      employees.forEach(employee => {
        employee.allowances.forEach(allowance => {
          allowances.push({
            _id: `${employee.empId}_${allowance.name}`, // Create a virtual ID
            empId: employee.empId,
            empName: employee.empName,
            ...allowance.toObject()
          });
        });
      });
      
      res.status(200).json({
        success: true,
        data: allowances,
        count: allowances.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async updateAllowance(req, res) {
    try {
      const { id } = req.params;
      const [empId, allowanceName] = id.split('_');
      
      const { name, percentage, amount, category, status, isRecurring, isBasicPay } = req.body;
      
      const employee = await UnifiedPayroll.findOne({ empId });
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }
      
      const allowanceIndex = employee.allowances.findIndex(a => a.name === allowanceName);
      if (allowanceIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Allowance not found",
        });
      }
      
      // Update the allowance
      employee.allowances[allowanceIndex] = {
        name: name || allowanceName,
        percentage,
        amount,
        category: category || employee.allowances[allowanceIndex].category,
        status: status || employee.allowances[allowanceIndex].status,
        isRecurring: isRecurring !== undefined ? isRecurring : employee.allowances[allowanceIndex].isRecurring,
        isBasicPay: isBasicPay !== undefined ? isBasicPay : (name === "BASIC PAY" || allowanceName === "BASIC PAY")
      };
      
      await employee.save();
      
      res.status(200).json({
        success: true,
        data: {
          _id: `${empId}_${name || allowanceName}`,
          empId,
          empName: employee.empName,
          ...employee.allowances[allowanceIndex].toObject()
        },
        message: "Allowance updated successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async deleteAllowance(req, res) {
    try {
      const { id } = req.params;
      const [empId, allowanceName] = id.split('_');
      
      const employee = await UnifiedPayroll.findOne({ empId });
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }
      
      const allowanceIndex = employee.allowances.findIndex(a => a.name === allowanceName);
      if (allowanceIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Allowance not found",
        });
      }
      
      // Remove the allowance
      employee.allowances.splice(allowanceIndex, 1);
      await employee.save();
      
      res.status(200).json({
        success: true,
        message: "Allowance deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

 
  // Update the createDeduction method to properly handle the request
static async createDeduction(req, res) {
  try {
    console.log("Creating deduction:", req.body);
    const { empId, name, percentage, amount, category, status, isRecurring, isFixedAmount } = req.body;
    
    const employee = await UnifiedPayroll.findOne({ empId });
    if (!employee) {
      console.error("Employee not found:", empId);
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }
    
    // Check if deduction already exists
    const existingIndex = employee.deductions.findIndex(d => d.name === name);
    
    if (existingIndex >= 0) {
      console.log("Updating existing deduction:", name);
      // Update existing deduction
      employee.deductions[existingIndex] = {
        name,
        percentage: parseFloat(percentage),
        amount: parseFloat(amount),
        category: category || 'Tax',
        status: status || 'Active',
        isRecurring: isRecurring !== undefined ? isRecurring : true,
        isFixedAmount: isFixedAmount || parseFloat(percentage) === 0 // Set isFixedAmount flag
      };
    } else {
      console.log("Adding new deduction:", name);
      // Add new deduction
      employee.deductions.push({
        name,
        percentage: parseFloat(percentage),
        amount: parseFloat(amount),
        category: category || 'Tax',
        status: status || 'Active',
        isRecurring: isRecurring !== undefined ? isRecurring : true,
        isFixedAmount: isFixedAmount || parseFloat(percentage) === 0 // Set isFixedAmount flag
      });
    }
    
    await employee.save();
    console.log("Deduction saved successfully");
    
    res.status(201).json({
      success: true,
      data: employee,
      message: "Deduction added successfully",
    });
  } catch (error) {
    console.error("Error creating deduction:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}
  static async getAllDeductions(req, res) {
    try {
      const employees = await UnifiedPayroll.find();
      
      // Extract all deductions from all employees
      const deductions = [];
      employees.forEach(employee => {
        employee.deductions.forEach(deduction => {
          deductions.push({
            _id: `${employee.empId}_${deduction.name}`, // Create a virtual ID
            empId: employee.empId,
            empName: employee.empName,
            ...deduction.toObject()
          });
        });
      });
      
      res.status(200).json({
        success: true,
        data: deductions,
        count: deductions.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async updateDeduction(req, res) {
    try {
      const { id } = req.params;
      const [empId, deductionName] = id.split('_');
      
      const { name, percentage, amount, category, status, isRecurring, isFixedAmount } = req.body;
      
      const employee = await UnifiedPayroll.findOne({ empId });
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }
      
      const deductionIndex = employee.deductions.findIndex(d => d.name === deductionName);
      if (deductionIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Deduction not found",
        });
      }
      
      // Update the deduction
      employee.deductions[deductionIndex] = {
        name: name || deductionName,
        percentage,
        amount,
        category: category || employee.deductions[deductionIndex].category,
        status: status || employee.deductions[deductionIndex].status,
        isRecurring: isRecurring !== undefined ? isRecurring : employee.deductions[deductionIndex].isRecurring,
        isFixedAmount: isFixedAmount !== undefined ? isFixedAmount : percentage === 0
      };
      
      await employee.save();
      
      res.status(200).json({
        success: true,
        data: {
          _id: `${empId}_${name || deductionName}`,
          empId,
          empName: employee.empName,
          ...employee.deductions[deductionIndex].toObject()
        },
        message: "Deduction updated successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async deleteDeduction(req, res) {
    try {
      const { id } = req.params;
      const [empId, deductionName] = id.split('_');
      
      const employee = await UnifiedPayroll.findOne({ empId });
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }
      
      const deductionIndex = employee.deductions.findIndex(d => d.name === deductionName);
      if (deductionIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Deduction not found",
        });
      }
      
      // Remove the deduction
      employee.deductions.splice(deductionIndex, 1);
      await employee.save();
      
      res.status(200).json({
        success: true,
        message: "Deduction deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Payslip Management
  static async generatePayslip(req, res) {
    try {
      const payslipData = req.body;
      const { empId, month, year } = payslipData;
      
      const employee = await UnifiedPayroll.findOne({ empId });
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }
      
      // Check if payslip for this month/year already exists
      const existingPayslipIndex = employee.payslips.findIndex(
        p => p.month === month && p.year === year
      );
      
      // Create payslip object with additional fields
      const newPayslip = {
        month,
        year,
        generatedDate: new Date(),
        grossSalary: payslipData.grossSalary,
        totalDeductions: payslipData.totalDeductions,
        netSalary: payslipData.netSalary,
        status: 'Generated',
        baseAfterDeductions: payslipData.baseAfterDeductions,
        attendanceAdjustedBase: payslipData.attendanceAdjustedBase,
        lopImpact: payslipData.lopImpact || {
          totalPayBeforeLOP: employee.basicPay,
          lopDeduction: (employee.basicPay / employee.payableDays) * payslipData.lopDays,
          lopPercentage: (payslipData.lopDays / employee.payableDays) * 100
        }
      };
      
      // Generate PDF
      const pdfPath = await PayrollPDFService.generatePayslipPDF({
        ...payslipData,
        _id: `${empId}_${month}_${year}`, // Create a virtual ID for the PDF
        dateOfJoining: employee.joiningDate // Pass joining date to PDF service
      });
      
      newPayslip.pdfPath = pdfPath;
      
      if (existingPayslipIndex >= 0) {
        // Update existing payslip
        employee.payslips[existingPayslipIndex] = newPayslip;
      } else {
        // Add new payslip
        employee.payslips.push(newPayslip);
      }
      
      await employee.save();
      
      res.status(201).json({
        success: true,
        data: {
          _id: `${empId}_${month}_${year}`,
          ...newPayslip
        },
        message: "Payslip generated successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async bulkGeneratePayslips(req, res) {
    try {
      const { month, year } = req.body;
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);
      
      const employees = await UnifiedPayroll.find({ status: "Active" });
      const generatedPayslips = [];

      for (const employee of employees) {
        // Get active allowances and deductions
        const activeAllowances = employee.allowances.filter(a => a.status === "Active");
        const activeDeductions = employee.deductions.filter(d => d.status === "Active");
        
        // Calculate basic values
        const basicPay = employee.basicPay;
        const payableDays = employee.payableDays;
        const lopDays = employee.lop;
        
        // Calculate per day pay
        const perDayPay = basicPay / payableDays;
        
        // Calculate attendance adjusted basic pay
        const actualPayableDays = payableDays - lopDays;
        const attendanceRatio = actualPayableDays / payableDays;
        
        // Calculate total deductions first
        let totalDeductionAmount = 0;
        const deductionsWithAmounts = activeDeductions.map(deduction => {
          let amount;
          if (deduction.isFixedAmount || deduction.percentage === 0) {
            // Fixed amount deduction
            amount = deduction.amount;
            totalDeductionAmount += amount;
            return {
              name: deduction.name,
              amount,
              percentage: deduction.percentage,
              isFixedAmount: true
            };
          } else {
            // Percentage-based deduction
            amount = basicPay * (deduction.percentage / 100);
            totalDeductionAmount += amount;
            return {
              name: deduction.name,
              amount,
              percentage: deduction.percentage,
              isFixedAmount: false
            };
          }
        });
        
        // Calculate base after deductions
        const baseAfterDeductions = basicPay - totalDeductionAmount;
        
        // Apply attendance adjustment to the base
        const attendanceAdjustedBase = baseAfterDeductions * attendanceRatio;
        
        // Calculate allowances based on the attendance-adjusted base
        let totalAllowanceAmount = 0;
        const allowancesWithAmounts = activeAllowances.map(allowance => {
          // Calculate allowance amount based on percentage of base after deductions
          const amount = attendanceAdjustedBase * (allowance.percentage / 100);
          totalAllowanceAmount += amount;
          
          return {
            name: allowance.name,
            amount,
            percentage: allowance.percentage,
            isBasicPay: allowance.isBasicPay || allowance.name === "BASIC PAY"
          };
        });
        
        // Net salary is the total of all allowances
        const netSalary = totalAllowanceAmount;
        
        // Create payslip data
        const payslipData = {
          empId: employee.empId,
          empName: employee.empName,
          department: employee.department,
          designation: employee.designation,
          pfNo: employee.pfNo,
          uanNo: employee.uanNo,
          panNo: employee.panNo,
          month: monthNum,
          year: yearNum,
          basicPay,
          payableDays,
          lopDays,
          dateOfJoining: employee.joiningDate,
          bankDetails: {
            bankName: employee.bankName,
            accountNo: employee.bankAccountNo,
          },
          allowances: allowancesWithAmounts,
          deductions: deductionsWithAmounts,
          baseAfterDeductions,
          attendanceAdjustedBase,
          grossSalary: totalAllowanceAmount,
          totalDeductions: totalDeductionAmount,
          netSalary,
          lopImpact: {
            totalPayBeforeLOP: basicPay,
            lopDeduction: basicPay - (perDayPay * actualPayableDays),
            lopPercentage: (lopDays / payableDays) * 100
          }
        };
        
        // Generate PDF
        const pdfPath = await PayrollPDFService.generatePayslipPDF({
          ...payslipData,
          _id: `${employee.empId}_${monthNum}_${yearNum}`
        });
        
        // Create or update payslip in employee record
        const existingPayslipIndex = employee.payslips.findIndex(
          p => p.month === monthNum && p.year === yearNum
        );
        
        const newPayslip = {
          month: monthNum,
          year: yearNum,
          generatedDate: new Date(),
          grossSalary: totalAllowanceAmount,
          totalDeductions: totalDeductionAmount,
          netSalary,
          status: 'Generated',
          pdfPath,
          baseAfterDeductions,
          attendanceAdjustedBase,
          lopImpact: {
            totalPayBeforeLOP: basicPay,
            lopDeduction: basicPay - (perDayPay * actualPayableDays),
            lopPercentage: (lopDays / payableDays) * 100
          }
        };
        
        if (existingPayslipIndex >= 0) {
          employee.payslips[existingPayslipIndex] = newPayslip;
        } else {
          employee.payslips.push(newPayslip);
        }
        
        await employee.save();
        
        generatedPayslips.push({
          _id: `${employee.empId}_${monthNum}_${yearNum}`,
          empId: employee.empId,
          empName: employee.empName,
          ...newPayslip
        });
      }

      res.status(200).json({
        success: true,
        data: generatedPayslips,
        count: generatedPayslips.length,
        message: "Bulk payslips generated successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async downloadPayslip(req, res) {
    try {
      const { id } = req.params;
      const [empId, month, year] = id.split('_');
      
      const employee = await UnifiedPayroll.findOne({ empId });
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }
      
      const payslip = employee.payslips.find(
        p => p.month === parseInt(month) && p.year === parseInt(year)
      );
      
      if (!payslip || !payslip.pdfPath) {
        return res.status(404).json({
          success: false,
          message: "Payslip not found or PDF not generated",
        });
      }
      
      // Check if file exists
      if (!fs.existsSync(payslip.pdfPath)) {
        // If PDF doesn't exist, regenerate it
        const activeAllowances = employee.allowances.filter(a => a.status === "Active");
        const activeDeductions = employee.deductions.filter(d => d.status === "Active");
        
        // Calculate basic values
        const basicPay = employee.basicPay;
        const payableDays = employee.payableDays;
        const lopDays = employee.lop;
        
        // Calculate per day pay
        const perDayPay = basicPay / payableDays;
        
        // Calculate attendance adjusted basic pay
        const actualPayableDays = payableDays - lopDays;
        const attendanceRatio = actualPayableDays / payableDays;
        
        // Calculate total deductions first
        let totalDeductionAmount = 0;
        const deductionsWithAmounts = activeDeductions.map(deduction => {
          let amount;
          if (deduction.isFixedAmount || deduction.percentage === 0) {
            // Fixed amount deduction
            amount = deduction.amount;
            totalDeductionAmount += amount;
            return {
              name: deduction.name,
              amount,
              percentage: deduction.percentage,
              isFixedAmount: true
            };
          } else {
            // Percentage-based deduction
            amount = basicPay * (deduction.percentage / 100);
            totalDeductionAmount += amount;
            return {
              name: deduction.name,
              amount,
              percentage: deduction.percentage,
              isFixedAmount: false
            };
          }
        });
        
        // Calculate base after deductions
        const baseAfterDeductions = basicPay - totalDeductionAmount;
        
        // Apply attendance adjustment to the base
        const attendanceAdjustedBase = baseAfterDeductions * attendanceRatio;
        
        // Calculate allowances based on the attendance-adjusted base
        let totalAllowanceAmount = 0;
        const allowancesWithAmounts = activeAllowances.map(allowance => {
          // Calculate allowance amount based on percentage of base after deductions
          const amount = attendanceAdjustedBase * (allowance.percentage / 100);
          totalAllowanceAmount += amount;
          
          return {
            name: allowance.name,
            amount,
            percentage: allowance.percentage,
            isBasicPay: allowance.isBasicPay || allowance.name === "BASIC PAY"
          };
        });
        
        // Net salary is the total of all allowances
        const netSalary = totalAllowanceAmount;
        
        // Create payslip data
        const payslipData = {
          empId: employee.empId,
          empName: employee.empName,
          department: employee.department,
          designation: employee.designation,
          pfNo: employee.pfNo,
          uanNo: employee.uanNo,
          panNo: employee.panNo,
          month: parseInt(month),
          year: parseInt(year),
          basicPay,
          payableDays,
          lopDays,
          dateOfJoining: employee.joiningDate,
          bankDetails: {
            bankName: employee.bankName,
            accountNo: employee.bankAccountNo,
          },
          allowances: allowancesWithAmounts,
          deductions: deductionsWithAmounts,
          baseAfterDeductions,
          attendanceAdjustedBase,
          grossSalary: totalAllowanceAmount,
          totalDeductions: totalDeductionAmount,
          netSalary,
          lopImpact: {
            totalPayBeforeLOP: basicPay,
            lopDeduction: basicPay - (perDayPay * actualPayableDays),
            lopPercentage: (lopDays / payableDays) * 100
          }
        };
        
        // Regenerate PDF
        const pdfPath = await PayrollPDFService.generatePayslipPDF({
          ...payslipData,
          _id: id
        });
        
        // Update payslip record with new path
        payslip.pdfPath = pdfPath;
        await employee.save();
        
        return res.download(pdfPath);
      }
      
      res.download(payslip.pdfPath);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getPayslipsByEmployee(req, res) {
    try {
      const { empId } = req.params;
      
      const employee = await UnifiedPayroll.findOne({ empId });
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }
      
      // Map payslips to include virtual ID
      const payslips = employee.payslips.map(payslip => ({
        _id: `${empId}_${payslip.month}_${payslip.year}`,
        empId,
        empName: employee.empName,
        ...payslip.toObject()
      }));
      
      res.status(200).json({
        success: true,
        data: payslips,
        count: payslips.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getPayslipsByMonth(req, res) {
    try {
      const { month, year } = req.query;
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);
      
      if (isNaN(monthNum) || isNaN(yearNum)) {
        return res.status(400).json({
          success: false,
          message: "Invalid month or year",
        });
      }
      
      const employees = await UnifiedPayroll.find();
      const payslips = [];
      
      employees.forEach(employee => {
        const payslip = employee.payslips.find(
          p => p.month === monthNum && p.year === yearNum
        );
        
        if (payslip) {
          payslips.push({
            _id: `${employee.empId}_${monthNum}_${yearNum}`,
            empId: employee.empId,
            empName: employee.empName,
            ...payslip.toObject()
          });
        }
      });
      
      res.status(200).json({
        success: true,
        data: payslips,
        count: payslips.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getAllPayslips(req, res) {
    try {
      const employees = await UnifiedPayroll.find();
      const payslips = [];
      
      employees.forEach(employee => {
        employee.payslips.forEach(payslip => {
          payslips.push({
            _id: `${employee.empId}_${payslip.month}_${payslip.year}`,
            empId: employee.empId,
            empName: employee.empName,
            ...payslip.toObject()
          });
        });
      });
      
      res.status(200).json({
        success: true,
        data: payslips,
        count: payslips.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // New method to calculate base after deductions
  static async calculateBaseAfterDeductions(req, res) {
    try {
      const { empId } = req.params;
      
      const employee = await UnifiedPayroll.findOne({ empId });
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }
      
      // Calculate total deductions
      const activeDeductions = employee.deductions.filter(d => d.status === "Active");
      let totalDeductionAmount = 0;
      
      activeDeductions.forEach(deduction => {
        if (deduction.isFixedAmount || deduction.percentage === 0) {
          totalDeductionAmount += parseFloat(deduction.amount);
        } else {
          totalDeductionAmount += (employee.basicPay * (deduction.percentage / 100));
        }
      });
      
      // Calculate base after deductions
      const baseAfterDeductions = employee.basicPay - totalDeductionAmount;
      
      // Calculate attendance adjusted base
      const attendanceRatio = (employee.payableDays - employee.lop) / employee.payableDays;
      const attendanceAdjustedBase = baseAfterDeductions * attendanceRatio;
      
      res.status(200).json({
        success: true,
        data: {
          empId: employee.empId,
          basicPay: employee.basicPay,
          totalDeductions: totalDeductionAmount,
          baseAfterDeductions,
          attendanceAdjustedBase,
          attendanceRatio
        },
        message: "Base after deductions calculated successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}


