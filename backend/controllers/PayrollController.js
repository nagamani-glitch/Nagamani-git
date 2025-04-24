import UnifiedPayroll from "../models/UnifiedPayroll.js";
import { PayrollPDFService } from "../services/PayrollPDFService.js";

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
      const { empId, name, percentage, amount, category, status, isRecurring } = req.body;
      
      const employee = await UnifiedPayroll.findOne({ empId });
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }
      
      // Check if allowance already exists
      const existingIndex = employee.allowances.findIndex(a => a.name === name);
      
      if (existingIndex >= 0) {
        // Update existing allowance
        employee.allowances[existingIndex] = {
          name,
          percentage,
          amount,
          category: category || 'Regular',
          status: status || 'Active',
          isRecurring: isRecurring !== undefined ? isRecurring : true
        };
      } else {
        // Add new allowance
        employee.allowances.push({
          name,
          percentage,
          amount,
          category: category || 'Regular',
          status: status || 'Active',
          isRecurring: isRecurring !== undefined ? isRecurring : true
        });
      }
      
      await employee.save();
      
      res.status(201).json({
        success: true,
        data: employee,
        message: "Allowance added successfully",
      });
    } catch (error) {
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
      
      const { name, percentage, amount, category, status, isRecurring } = req.body;
      
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
        isRecurring: isRecurring !== undefined ? isRecurring : employee.allowances[allowanceIndex].isRecurring
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

  // Deduction Management - Similar to allowance management
  static async createDeduction(req, res) {
    try {
      const { empId, name, percentage, amount, category, status, isRecurring } = req.body;
      
      const employee = await UnifiedPayroll.findOne({ empId });
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }
      
      // Check if deduction already exists
      const existingIndex = employee.deductions.findIndex(d => d.name === name);
      
      if (existingIndex >= 0) {
        // Update existing deduction
        employee.deductions[existingIndex] = {
          name,
          percentage,
          amount,
          category: category || 'Tax',
          status: status || 'Active',
          isRecurring: isRecurring !== undefined ? isRecurring : true
        };
      } else {
        // Add new deduction
        employee.deductions.push({
          name,
          percentage,
          amount,
          category: category || 'Tax',
          status: status || 'Active',
          isRecurring: isRecurring !== undefined ? isRecurring : true
        });
      }
      
      await employee.save();
      
      res.status(201).json({
        success: true,
        data: employee,
        message: "Deduction added successfully",
      });
    } catch (error) {
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
      
      const { name, percentage, amount, category, status, isRecurring } = req.body;
      
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
        isRecurring: isRecurring !== undefined ? isRecurring : employee.deductions[deductionIndex].isRecurring
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
  // Add this method to your PayrollController class
static async getAllPayslips(req, res) {
  try {
    const employees = await UnifiedPayroll.find();
    
    // Extract all payslips from all employees
    const payslips = [];
    employees.forEach(employee => {
      employee.payslips.forEach(payslip => {
        payslips.push({
          _id: `${employee.empId}_${payslip.month}_${payslip.year}`, // Create a virtual ID
          empId: employee.empId,
          empName: employee.empName,
          department: employee.department,
          designation: employee.designation,
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
      
      // Create payslip object
      const newPayslip = {
        month,
        year,
        generatedDate: new Date(),
        grossSalary: payslipData.grossSalary,
        totalDeductions: payslipData.totalDeductions,
        netSalary: payslipData.netSalary,
        status: 'Generated'
      };
      
      // Generate PDF
      const pdfPath = await PayrollPDFService.generatePayslipPDF({
        ...payslipData,
        _id: `${empId}_${month}_${year}` // Create a virtual ID for the PDF
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
          message: "Payslip PDF not found",
        });
      }

      res.download(payslip.pdfPath);
    } catch (error) {
      res.status(404).json({
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

  static async bulkGeneratePayslips(req, res) {
    try {
      const { month, year } = req.body;
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);
      
      const employees = await UnifiedPayroll.find({ status: "Active" });
      const generatedPayslips = [];

      for (const employee of employees) {
        // Calculate allowances and deductions
        const activeAllowances = employee.allowances.filter(a => a.status === "Active");
        const activeDeductions = employee.deductions.filter(d => d.status === "Active");
        
        // Calculate gross salary, deductions, and net salary
        const basicPay = employee.basicPay;
        const payableDays = employee.payableDays;
        const lopDays = employee.lop;
        
        // Calculate per day pay
        const perDayPay = basicPay / payableDays;
        
        // Calculate attendance adjusted basic pay
        const actualPayableDays = payableDays - lopDays;
        const attendanceAdjustedBasicPay = perDayPay * actualPayableDays;
        
        // Calculate total allowances
        const totalAllowances = activeAllowances.reduce((sum, allowance) => {
          return sum + (basicPay * allowance.percentage / 100);
        }, 0);
        
        // Calculate gross salary
        const grossSalary = attendanceAdjustedBasicPay + totalAllowances;
        
        // Calculate total deductions
        const totalDeductions = activeDeductions.reduce((sum, deduction) => {
          return sum + (basicPay * deduction.percentage / 100);
        }, 0);
        
        // Calculate net salary
        const netSalary = grossSalary - totalDeductions;
        
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
          bankDetails: {
            bankName: employee.bankName,
            accountNo: employee.bankAccountNo,
          },
          allowances: activeAllowances.map(a => ({
            name: a.name,
            amount: basicPay * a.percentage / 100,
            percentage: a.percentage,
          })),
          deductions: activeDeductions.map(d => ({
            name: d.name,
            amount: basicPay * d.percentage / 100,
            percentage: d.percentage,
          })),
          grossSalary,
          totalDeductions,
          netSalary,
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
          grossSalary,
          totalDeductions,
          netSalary,
          status: 'Generated',
          pdfPath
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
}

