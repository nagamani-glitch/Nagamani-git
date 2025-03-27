import EmployeePayroll from "../models/EmployeePayroll.js";
import PayrollAllowance from "../models/PayrollAllowance.js";
import PayrollDeduction from "../models/PayrollDeduction.js";
import MonthlyPayslip from "../models/MonthlyPayslip.js";
import { PayrollPDFService } from "../services/PayrollPDFService.js";

export class PayrollController {
  // Employee Management
  // static async createEmployee(req, res) {
  //   try {
  //     const employee = new EmployeePayroll(req.body);
  //     await employee.save();
  //     res.status(201).json({
  //       success: true,
  //       data: employee,
  //       message: 'Employee created successfully'
  //     });
  //   } catch (error) {
  //     res.status(400).json({
  //       success: false,
  //       message: error.message
  //     });
  //   }
  // }

  static async bulkCreateEmployees(req, res) {
    try {
      const { employees } = req.body;
      const createdEmployees = await Promise.all(
        employees.map(async (employeeData) => {
          const employee = new EmployeePayroll({
            ...employeeData,
            lop: parseFloat(employeeData.lop) || 0,
            payableDays: parseFloat(employeeData.payableDays) || 30,
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
      };

      const employee = new EmployeePayroll(employeeData);
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
      const employees = await EmployeePayroll.find();
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

      const employee = await EmployeePayroll.findOneAndUpdate(
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

      const employee = await EmployeePayroll.findOneAndUpdate(
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
      const employee = await EmployeePayroll.findOneAndDelete({
        empId: req.params.empId,
      });

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }

      // Delete related records
      await PayrollAllowance.deleteMany({ empId: req.params.empId });
      await PayrollDeduction.deleteMany({ empId: req.params.empId });

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
      const allowance = new PayrollAllowance(req.body);
      await allowance.save();
      res.status(201).json({
        success: true,
        data: allowance,
        message: "Allowance created successfully",
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
      const allowances = await PayrollAllowance.find();
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
      const allowance = await PayrollAllowance.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!allowance) {
        return res.status(404).json({
          success: false,
          message: "Allowance not found",
        });
      }

      res.status(200).json({
        success: true,
        data: allowance,
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
      const allowance = await PayrollAllowance.findByIdAndDelete(req.params.id);

      if (!allowance) {
        return res.status(404).json({
          success: false,
          message: "Allowance not found",
        });
      }

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

  // Deduction Management
  static async createDeduction(req, res) {
    try {
      const deduction = new PayrollDeduction(req.body);
      await deduction.save();
      res.status(201).json({
        success: true,
        data: deduction,
        message: "Deduction created successfully",
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
      const deductions = await PayrollDeduction.find();
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
      const deduction = await PayrollDeduction.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!deduction) {
        return res.status(404).json({
          success: false,
          message: "Deduction not found",
        });
      }

      res.status(200).json({
        success: true,
        data: deduction,
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
      const deduction = await PayrollDeduction.findByIdAndDelete(req.params.id);

      if (!deduction) {
        return res.status(404).json({
          success: false,
          message: "Deduction not found",
        });
      }

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
      const payslip = new MonthlyPayslip(payslipData);

      const pdfPath = await PayrollPDFService.generatePayslipPDF(payslip);
      payslip.pdfPath = pdfPath;

      await payslip.save();

      res.status(201).json({
        success: true,
        data: payslip,
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
      const payslip = await MonthlyPayslip.findById(req.params.id);

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
      const payslips = await MonthlyPayslip.find({ empId: req.params.empId });
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
      const payslips = await MonthlyPayslip.find({ month, year });
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
      const employees = await EmployeePayroll.find({ status: "Active" });
      const generatedPayslips = [];

      for (const employee of employees) {
        const allowances = await PayrollAllowance.find({
          empId: employee.empId,
          status: "Active",
        });
        const deductions = await PayrollDeduction.find({
          empId: employee.empId,
          status: "Active",
        });

        const payslipData = {
          empId: employee.empId,
          empName: employee.empName,
          month,
          year,
          basicPay: employee.basicPay,
          payableDays: employee.payableDays,
          lopDays: employee.lop,
          allowances,
          deductions,
          // Calculate other fields
        };

        const payslip = new MonthlyPayslip(payslipData);
        const pdfPath = await PayrollPDFService.generatePayslipPDF(payslip);
        payslip.pdfPath = pdfPath;
        await payslip.save();
        generatedPayslips.push(payslip);
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
