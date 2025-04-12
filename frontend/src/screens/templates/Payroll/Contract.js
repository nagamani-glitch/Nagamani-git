import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  FaFilter,
  FaSortUp,
  FaSortDown,
  FaInfoCircle,
  FaEdit,
  FaTrash,
  FaSave,
  FaClipboardCheck,
  FaExclamationTriangle,
  FaFileExport,
  FaFileCsv,
  FaFileExcel,
  FaFilePdf,
  FaPrint,
  FaChartBar,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaEllipsisV,
  FaRedo,
  FaPlus,
  FaSearch,
  FaFileContract,
  FaArrowLeft,
  FaEye,
} from "react-icons/fa";
import { CSVLink } from "react-csv";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Contract.css";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Stack,
  Paper,
} from "@mui/material";
import {
  Close,
  Save as SaveIcon,
  Cancel as CancelIcon,
  AttachMoney as AttachMoneyIcon,
} from "@mui/icons-material";

const Contract = () => {
  // State variables
  const [searchTerm, setSearchTerm] = useState("");
  const [contracts, setContracts] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [showCreatePage, setShowCreatePage] = useState(false);
  const [formData, setFormData] = useState({
    contractStatus: "Active",
    contractTitle: "",
    employee: "",
    startDate: "",
    endDate: "",
    wageType: "",
    payFrequency: "",
    basicSalary: "",
    filingStatus: "",
    department: "",
    position: "",
    role: "",
    shift: "",
    workType: "",
    noticePeriod: "",
    contractDocument: null,
    deductFromBasicPay: false,
    calculateDailyLeave: false,
    note: "",
  });
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [filterData, setFilterData] = useState({
    employeeName: "",
    contractStatus: "",
    startDate: "",
    endDate: "",
    contract: "",
    wageType: "",
    department: "",
    minSalary: "",
    maxSalary: "",
    filingStatus: "",
  });
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [selectedContracts, setSelectedContracts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [dashboardOrientation, setDashboardOrientation] = useState("landscape");
  const [dashboardStats, setDashboardStats] = useState(null);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [renewalData, setRenewalData] = useState({
    id: null,
    startDate: "",
    endDate: "",
    basicSalary: "",
    renewalReason: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [bulkAction, setBulkAction] = useState("");
  const [showBulkUpdateModal, setShowBulkUpdateModal] = useState(false);
  const [bulkUpdateData, setBulkUpdateData] = useState({});

  // Add a new state for the preview modal and selected contract
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewContract, setPreviewContract] = useState(null);

  // Add a state for filter dialog
  const [showFilterDialog, setShowFilterDialog] = useState(false);

  // New state variables for employee selection feature
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");

  const handlePreview = (contract) => {
    setPreviewContract(contract);
    setShowPreviewModal(true);
  };
  const filterRef = useRef(null);
  const csvLink = useRef(null);

  // Fetch contracts on component mount
  useEffect(() => {
    fetchContracts();
    fetchEmployees(); // Fetch employees when component mounts
  }, []);

  // Handle click outside filter popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking on a select or menu item
      if (
        event.target.closest(".MuiSelect-select") ||
        event.target.closest(".MuiMenuItem-root") ||
        event.target.closest(".MuiList-root") ||
        event.target.closest(".MuiBackdrop-root")
      ) {
        return;
      }

      // Only close if clicking outside the filter popup
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterPopup(false);
      }
    };

    // Only add the listener when the popup is shown
    if (showFilterPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilterPopup]);

  // Update filtered contracts when contracts change
  useEffect(() => {
    setFilteredContracts(contracts);
    calculateTotalPages();
  }, [contracts, itemsPerPage]);

  // Calculate total pages for pagination
  const calculateTotalPages = () => {
    setTotalPages(Math.ceil(filteredContracts.length / itemsPerPage));
  };

  // Fetch contracts from API
  const fetchContracts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/payroll-contracts"
      );
      if (response.data.success) {
        setContracts(response.data.data);
        setFilteredContracts(response.data.data);
        calculateTotalPages();
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      toast.error("Failed to fetch contracts");
      setLoading(false);

      // Set default data if API fails
      const defaultData = [
        {
          _id: "1",
          contract: "Full-time",
          employee: "John Doe",
          startDate: "2023-01-01",
          endDate: "2024-01-01",
          wageType: "Monthly",
          basicSalary: 5000,
          filingStatus: "Filed",
          contractStatus: "Active",
        },
        {
          _id: "2",
          contract: "Part-time",
          employee: "Jane Smith",
          startDate: "2023-06-15",
          endDate: "2024-06-14",
          wageType: "Hourly",
          basicSalary: 25,
          filingStatus: "Filed",
          contractStatus: "Active",
        },
      ];
      setContracts(defaultData);
      setFilteredContracts(defaultData);
    }
  };

  // Fetch employees from API
  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const response = await axios.get("http://localhost:5000/api/employees/registered");
      if (response.data) {
        setEmployees(response.data);
      }
      setLoadingEmployees(false);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to fetch employees");
      setLoadingEmployees(false);
    }
  };

  // Handle employee selection
  const handleEmployeeSelect = async (employeeId) => {
    setSelectedEmployee(employeeId);
    
    if (!employeeId) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/employees/get-employee/${employeeId}`);
      
      if (response.data.success) {
        const employee = response.data.data;
        
        // Autofill form fields with employee data
        setFormData({
          ...formData,
          employee: `${employee.personalInfo?.firstName || ''} ${employee.personalInfo?.lastName || ''}`,
          department: employee.joiningDetails?.department || '',
          position: employee.joiningDetails?.initialDesignation || '',
          role: employee.joiningDetails?.role || '',
          // You can map more fields as needed
        });
        
        toast.success("Employee data loaded successfully");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching employee details:", error);
      toast.error("Failed to load employee data");
      setLoading(false);
    }
  };

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/payroll-contracts/dashboard"
      );
      if (response.data.success) {
        setDashboardStats(response.data.data);
      } else {
        // If API doesn't return success, create mock data
        setDashboardStats({
          totalContracts: contracts.length,
          byStatus: {
            active: contracts.filter((c) => c.contractStatus === "Active")
              .length,
            draft: contracts.filter((c) => c.contractStatus === "Draft").length,
            expired: contracts.filter((c) => c.contractStatus === "Expired")
              .length,
            terminated: contracts.filter(
              (c) => c.contractStatus === "Terminated"
            ).length,
          },
          byType: {
            fullTime: contracts.filter((c) => c.contract === "Full-time")
              .length,
            partTime: contracts.filter((c) => c.contract === "Part-time")
              .length,
          },
          expiringContracts: {
            count: 2,
            contracts: contracts.slice(0, 2),
          },
          departmentStats: [
            { _id: "HR Dept", count: 3 },
            { _id: "IT Dept", count: 5 },
            { _id: "Sales Dept", count: 2 },
            { _id: "Finance Dept", count: 1 },
          ],
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("Failed to fetch dashboard statistics");
      setLoading(false);

      // Create mock data if API fails
      setDashboardStats({
        totalContracts: contracts.length,
        byStatus: {
          active: contracts.filter((c) => c.contractStatus === "Active").length,
          draft: contracts.filter((c) => c.contractStatus === "Draft").length,
          expired: contracts.filter((c) => c.contractStatus === "Expired")
            .length,
          terminated: contracts.filter((c) => c.contractStatus === "Terminated")
            .length,
        },
        byType: {
          fullTime: contracts.filter((c) => c.contract === "Full-time").length,
          partTime: contracts.filter((c) => c.contract === "Part-time").length,
        },
        expiringContracts: {
          count: 2,
          contracts: contracts.slice(0, 2),
        },
        departmentStats: [
          { _id: "HR Dept", count: 3 },
          { _id: "IT Dept", count: 5 },
          { _id: "Sales Dept", count: 2 },
          { _id: "Finance Dept", count: 1 },
        ],
      });
    }
  };

  // Toggle dashboard view
  const toggleDashboard = () => {
    setShowDashboard(!showDashboard);
    if (!showDashboard) {
      setDashboardOrientation("landscape");
      fetchDashboardStats();
    }
  };

  // Handle create button click
  const handleCreateClick = () => {
    setFormData({
      contractStatus: "Active",
      contractTitle: "",
      employee: "",
      startDate: "",
      endDate: "",
      wageType: "",
      payFrequency: "",
      basicSalary: "",
      filingStatus: "",
      department: "",
      position: "",
      role: "",
      shift: "",
      workType: "",
      noticePeriod: "",
      contractDocument: null,
      deductFromBasicPay: false,
      calculateDailyLeave: false,
      note: "",
    });
    setSelectedEmployee(""); // Reset selected employee
    setShowCreatePage(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    });
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedContracts = [...filteredContracts].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredContracts(sortedContracts);
  };

  // 1. First, modify the handleEdit function to populate the formData and show the create page
  const handleEdit = (contract) => {
    // Populate the form data with the selected contract's values
    setFormData({
      contractStatus: contract.contractStatus || "Active",
      contractTitle: contract.contract || "",
      employee: contract.employee || "",
      startDate: contract.startDate || "",
      endDate: contract.endDate || "",
      wageType: contract.wageType || "",
      payFrequency: contract.payFrequency || "",
      basicSalary: contract.basicSalary || "",
      filingStatus: contract.filingStatus || "",
      department: contract.department || "",
      position: contract.position || "",
      role: contract.role || "",
      shift: contract.shift || "",
      workType: contract.workType || "",
      noticePeriod: contract.noticePeriod || "",
      contractDocument: null, // Can't pre-fill file inputs
      deductFromBasicPay: contract.deductFromBasicPay || false,
      calculateDailyLeave: contract.calculateDailyLeave || false,
      note: contract.note || "",
    });

    // Store the contract ID for updating
    setEditingId(contract._id);
    
    // Reset selected employee when editing
    setSelectedEmployee("");

    // Show the create page (which will now function as an edit page)
    setShowCreatePage(true);
  };

  // 2. Modify the handleSaveCreate function to handle both create and update
  const handleSaveCreate = async () => {
    try {
      setLoading(true);
      const contractData = {
        contract: formData.contractTitle,
        contractStatus: formData.contractStatus,
        employee: formData.employee,
        startDate: formData.startDate,
        endDate: formData.endDate,
        wageType: formData.wageType,
        payFrequency: formData.payFrequency,
        basicSalary: Number(formData.basicSalary),
        filingStatus: formData.filingStatus,
        department: formData.department,
        position: formData.position,
        role: formData.role,
        shift: formData.shift,
        workType: formData.workType,
        noticePeriod: Number(formData.noticePeriod),
        deductFromBasicPay: formData.deductFromBasicPay,
        calculateDailyLeave: formData.calculateDailyLeave,
        note: formData.note,
      };

      // Handle file upload if a document is selected
      if (formData.contractDocument) {
        const formDataWithFile = new FormData();
        formDataWithFile.append("document", formData.contractDocument);

        // Upload file first (this would be a separate endpoint in a real app)
        // const uploadResponse = await axios.post('http://localhost:5000/api/upload', formDataWithFile);
        // contractData.documentUrl = uploadResponse.data.url;
      }

      let response;

      if (editingId) {
        // Update existing contract
        response = await axios.put(
          `http://localhost:5000/api/payroll-contracts/${editingId}`,
          contractData
        );

        if (response.data.success) {
          toast.success("Contract updated successfully");

          // Update the contracts list
          setContracts(
            contracts.map((contract) =>
              contract._id === editingId ? response.data.data : contract
            )
          );

          setFilteredContracts(
            filteredContracts.map((contract) =>
              contract._id === editingId ? response.data.data : contract
            )
          );
        }
      } else {
        // Create new contract
        response = await axios.post(
          "http://localhost:5000/api/payroll-contracts",
          contractData
        );

        if (response.data.success) {
          toast.success("Contract created successfully");

          // Add the new contract to the list
          setContracts([...contracts, response.data.data]);
          setFilteredContracts([...filteredContracts, response.data.data]);
        }
      }

      // Reset form and close create/edit page
      setShowCreatePage(false);
      setEditingId(null);
      setSelectedEmployee("");
      setLoading(false);
    } catch (error) {
      console.error("Contract operation error:", error);
      toast.error(error.response?.data?.error || "Failed to process contract");
      setLoading(false);
    }
  };

  // Handle changes in edit mode
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle save in edit mode
  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:5000/api/payroll-contracts/${editedData._id}`,
        {
          contract: editedData.contract,
          employee: editedData.employee,
          startDate: editedData.startDate,
          endDate: editedData.endDate,
          wageType: editedData.wageType,
          basicSalary: Number(editedData.basicSalary),
          filingStatus: editedData.filingStatus,
          contractStatus: editedData.contractStatus,
        }
      );

      if (response.data.success) {
        toast.success("Contract updated successfully");
        const updatedContract = response.data.data;
        setContracts(
          contracts.map((contract) =>
            contract._id === editedData._id ? updatedContract : contract
          )
        );
        setFilteredContracts(
          filteredContracts.map((contract) =>
            contract._id === editedData._id ? updatedContract : contract
          )
        );
        setEditingId(null);
      }
      setLoading(false);
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Failed to update contract");
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `http://localhost:5000/api/payroll-contracts/${id}`
      );
      if (response.data.success) {
        toast.success("Contract deleted successfully");
        setContracts(contracts.filter((contract) => contract._id !== id));
        setFilteredContracts(
          filteredContracts.filter((contract) => contract._id !== id)
        );
        setSelectedContracts(
          selectedContracts.filter((contractId) => contractId !== id)
        );
      }
      setLoading(false);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete contract");
      setLoading(false);
    }
  };

  // Handle search
  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const searchResults = contracts.filter(
      (contract) =>
        (contract.employee &&
          contract.employee.toLowerCase().includes(searchValue)) ||
        (contract.contract &&
          contract.contract.toLowerCase().includes(searchValue)) ||
        (contract.wageType &&
          contract.wageType.toLowerCase().includes(searchValue)) ||
        (contract.filingStatus &&
          contract.filingStatus.toLowerCase().includes(searchValue))
    );

    setFilteredContracts(searchResults);
    setCurrentPage(1);
  };

  // Handle filter icon click
  const handleFilterIconClick = () => {
    // Use Dialog instead of popup
    setShowFilterDialog(true);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    e.stopPropagation(); // Stop event propagation
    const { name, value } = e.target;
    console.log(`Filter changed: ${name} = ${value}`);
    setFilterData({ ...filterData, [name]: value });
  };

  // Reset filters
  const handleResetFilter = () => {
    setFilterData({
      employeeName: "",
      contractStatus: "",
      startDate: "",
      endDate: "",
      contract: "",
      wageType: "",
      department: "",
      minSalary: "",
      maxSalary: "",
      filingStatus: "",
    });
    setFilteredContracts(contracts);
    setShowFilterDialog(false);
    setCurrentPage(1);
  };

  const handleApplyFilter = async () => {
    try {
      setLoading(true);

      // Create a clean filter object with only non-empty values
      const filterParams = {};

      if (filterData.employeeName && filterData.employeeName.trim() !== "") {
        filterParams.employeeName = filterData.employeeName.trim();
      }

      if (filterData.contractStatus && filterData.contractStatus !== "") {
        filterParams.contractStatus = filterData.contractStatus;
      }

      if (filterData.wageType && filterData.wageType !== "") {
        filterParams.wageType = filterData.wageType;
      }

      if (filterData.department && filterData.department !== "") {
        filterParams.department = filterData.department;
      }

      if (filterData.startDate && filterData.startDate !== "") {
        filterParams.startDate = filterData.startDate;
      }

      if (filterData.endDate && filterData.endDate !== "") {
        filterParams.endDate = filterData.endDate;
      }

      if (filterData.minSalary && filterData.minSalary !== "") {
        filterParams.minSalary = filterData.minSalary;
      }

      if (filterData.maxSalary && filterData.maxSalary !== "") {
        filterParams.maxSalary = filterData.maxSalary;
      }

      if (filterData.filingStatus && filterData.filingStatus !== "") {
        filterParams.filingStatus = filterData.filingStatus;
      }

      console.log("Sending filter parameters to API:", filterParams);

      // Make the API request with the filter parameters
      const response = await axios.get(
        "http://localhost:5000/api/payroll-contracts/filter",
        { params: filterParams }
      );

      console.log("API response:", response.data);

      if (response.data.success) {
        setFilteredContracts(response.data.data);
        toast.success(`Found ${response.data.data.length} matching contracts`);
      } else {
        toast.error("Failed to filter contracts");
        // Keep the current filtered contracts
      }

      // Close the filter dialog and reset pagination
      setShowFilterDialog(false);
      setCurrentPage(1);
      calculateTotalPages();
      setLoading(false);
    } catch (error) {
      console.error("Filter API error:", error);
      toast.error(
        "Error applying filters. Using client-side filtering instead."
      );

      // Fallback to client-side filtering
      const filtered = contracts.filter((contract) => {
        // Check each filter condition
        if (
          filterData.employeeName &&
          (!contract.employee ||
            !contract.employee
              .toLowerCase()
              .includes(filterData.employeeName.toLowerCase()))
        ) {
          return false;
        }

        if (
          filterData.contractStatus &&
          contract.contractStatus !== filterData.contractStatus
        ) {
          return false;
        }

        if (filterData.wageType && contract.wageType !== filterData.wageType) {
          return false;
        }

        if (
          filterData.department &&
          (!contract.department ||
            !contract.department
              .toLowerCase()
              .includes(filterData.department.toLowerCase()))
        ) {
          return false;
        }

        if (
          filterData.startDate &&
          (!contract.startDate ||
            new Date(contract.startDate) < new Date(filterData.startDate))
        ) {
          return false;
        }

        if (
          filterData.endDate &&
          (!contract.endDate ||
            new Date(contract.endDate) > new Date(filterData.endDate))
        ) {
          return false;
        }

        if (
          filterData.minSalary &&
          (!contract.basicSalary ||
            Number(contract.basicSalary) < Number(filterData.minSalary))
        ) {
          return false;
        }

        if (
          filterData.maxSalary &&
          (!contract.basicSalary ||
            Number(contract.basicSalary) > Number(filterData.maxSalary))
        ) {
          return false;
        }
        if (
          filterData.filingStatus &&
          contract.filingStatus !== filterData.filingStatus
        ) {
          return false;
        }

        // If all conditions pass, include this contract
        return true;
      });

      setFilteredContracts(filtered);
      toast.info(
        `Found ${filtered.length} matching contracts (client-side filtering)`
      );

      // Close the filter dialog and reset pagination
      setShowFilterDialog(false);
      setCurrentPage(1);
      calculateTotalPages();
      setLoading(false);
    }
  };

  // Handle contract selection
  const handleSelectContract = (id) => {
    if (selectedContracts.includes(id)) {
      setSelectedContracts(
        selectedContracts.filter((contractId) => contractId !== id)
      );
    } else {
      setSelectedContracts([...selectedContracts, id]);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedContracts([]);
    } else {
      const currentPageContracts = getCurrentPageItems();
      setSelectedContracts(
        currentPageContracts.map((contract) => contract._id)
      );
    }
    setSelectAll(!selectAll);
  };

  // Export to CSV
  const handleExportCSV = () => {
    // CSV Link component will handle the actual export
    csvLink.current.link.click();
  };

  // Export to PDF
  const exportToPDF = () => {
    try {
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(18);
      doc.text("Contracts Report", 14, 22);

      // Add date
      doc.setFontSize(11);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

      // Define table columns
      const tableColumn = [
        "Contract",
        "Employee",
        "Start Date",
        "End Date",
        "Wage Type",
        "Basic Salary",
        "Status",
      ];

      // Define table rows
      const tableRows = [];

      // Add data to rows
      const contractsToExport =
        selectedContracts.length > 0
          ? filteredContracts.filter((contract) =>
              selectedContracts.includes(contract._id)
            )
          : filteredContracts;

      contractsToExport.forEach((contract) => {
        const contractData = [
          contract.contract,
          contract.employee,
          contract.startDate,
          contract.endDate || "N/A",
          contract.wageType,
          contract.basicSalary,
          contract.contractStatus || "Active",
        ];
        tableRows.push(contractData);
      });

      // Generate the table
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        styles: {
          fontSize: 10,
          cellPadding: 3,
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
      });

            // Save the PDF
            doc.save("contracts_report.pdf");
            toast.success("PDF exported successfully");
          } catch (error) {
            console.error("PDF export error:", error);
            toast.error("Failed to export PDF");
          }
        };
      
        // Handle print
        const handlePrint = () => {
          window.print();
        };
      
        // Handle bulk action change
        const handleBulkActionChange = (e) => {
          setBulkAction(e.target.value);
        };
      
        // Apply bulk action
        const handleApplyBulkAction = () => {
          if (!bulkAction || selectedContracts.length === 0) {
            toast.warning("Please select an action and at least one contract");
            return;
          }
      
          switch (bulkAction) {
            case "delete":
              if (
                window.confirm(
                  `Are you sure you want to delete ${selectedContracts.length} contracts?`
                )
              ) {
                Promise.all(selectedContracts.map((id) => handleDelete(id)))
                  .then(() => {
                    toast.success(`${selectedContracts.length} contracts deleted`);
                    setSelectedContracts([]);
                    setSelectAll(false);
                  })
                  .catch((error) => {
                    console.error("Bulk delete error:", error);
                    toast.error("Failed to delete some contracts");
                  });
              }
              break;
            case "export":
              exportToPDF();
              break;
            case "status":
              setShowBulkUpdateModal(true);
              setBulkUpdateData({ field: "contractStatus", value: "Active" });
              break;
            default:
              toast.warning("Invalid action selected");
          }
        };
      
        // Handle bulk update
        const handleBulkUpdate = async () => {
          try {
            setLoading(true);
      
            // In a real app, you would make API calls to update each contract
            // For now, we'll update them locally
            const updatedContracts = contracts.map((contract) => {
              if (selectedContracts.includes(contract._id)) {
                return { ...contract, [bulkUpdateData.field]: bulkUpdateData.value };
              }
              return contract;
            });
      
            setContracts(updatedContracts);
            setFilteredContracts(updatedContracts);
            setShowBulkUpdateModal(false);
            setSelectedContracts([]);
            setSelectAll(false);
            toast.success(`Updated ${selectedContracts.length} contracts`);
            setLoading(false);
          } catch (error) {
            console.error("Bulk update error:", error);
            toast.error("Failed to update contracts");
            setLoading(false);
          }
        };
      
        // Handle page change
        const handlePageChange = (page) => {
          setCurrentPage(page);
        };
      
        // Handle items per page change
        const handleItemsPerPageChange = (e) => {
          setItemsPerPage(Number(e.target.value));
          setCurrentPage(1);
        };
      
        // Get current page items
        const getCurrentPageItems = () => {
          const startIndex = (currentPage - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          return filteredContracts.slice(startIndex, endIndex);
        };
      
        // Prepare CSV data
        const csvData =
          selectedContracts.length > 0
            ? filteredContracts.filter((contract) =>
                selectedContracts.includes(contract._id)
              )
            : filteredContracts;
      
        // Define CSV headers
        const csvHeaders = [
          { label: "Contract", key: "contract" },
          { label: "Employee", key: "employee" },
          { label: "Start Date", key: "startDate" },
          { label: "End Date", key: "endDate" },
          { label: "Wage Type", key: "wageType" },
          { label: "Basic Salary", key: "basicSalary" },
          { label: "Filing Status", key: "filingStatus" },
          { label: "Contract Status", key: "contractStatus" },
          { label: "Department", key: "department" },
        ];
      
        // Render create page
      
        if (showCreatePage) {
          return (
            <Dialog
              open={true}
              maxWidth="md"
              fullWidth
              PaperProps={{
                sx: {
                  width: "90%",
                  maxWidth: "900px",
                  borderRadius: "12px",
                  overflow: "hidden",
                },
              }}
            >
              {loading && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    zIndex: 9999,
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
      
              <DialogTitle
                sx={{
                  background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                  color: "white",
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  padding: "16px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <FaFileContract style={{ marginRight: "10px" }} />
                  {editingId ? "Edit Contract" : "New Contract"}
                </Typography>
                <IconButton
                  onClick={() => {
                    setShowCreatePage(false);
                    setEditingId(null);
                    setSelectedEmployee("");
                  }}
                  sx={{ color: "white" }}
                  size="small"
                >
                  <Close />
                </IconButton>
              </DialogTitle>
      
              <DialogContent sx={{ padding: "24px" }}>
                {/* Employee Selection Dropdown */}
                <Box sx={{ mb: 3 }}>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel>Select Onboarded Employee</InputLabel>
                    <Select
                      value={selectedEmployee}
                      onChange={(e) => handleEmployeeSelect(e.target.value)}
                      label="Select Onboarded Employee"
                      disabled={loadingEmployees || editingId}
                      startAdornment={
                        loadingEmployees ? (
                          <InputAdornment position="start">
                            <CircularProgress size={20} />
                          </InputAdornment>
                        ) : null
                      }
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 300,
                          },
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        <em>Select an employee</em>
                      </MenuItem>
                      <MenuItem>
                        <TextField
                          size="small"
                          autoFocus
                          placeholder="Search employees..."
                          fullWidth
                          value={employeeSearchTerm}
                          onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                        />
                      </MenuItem>
                      {employees
                        .filter(emp => 
                          `${emp.personalInfo?.firstName || ''} ${emp.personalInfo?.lastName || ''} ${emp.Emp_ID || ''}`
                            .toLowerCase()
                            .includes(employeeSearchTerm.toLowerCase())
                        )
                        .map((emp) => (
                          <MenuItem key={emp._id} value={emp.Emp_ID}>
                            {emp.personalInfo?.firstName} {emp.personalInfo?.lastName} ({emp.Emp_ID})
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Box>
      
                <Box component="form" sx={{ mt: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel>Contract Status</InputLabel>
                        <Select
                          name="contractStatus"
                          value={formData.contractStatus}
                          onChange={handleInputChange}
                          label="Contract Status"
                        >
                          <MenuItem value="Draft">Draft</MenuItem>
                          <MenuItem value="Active">Active</MenuItem>
                          <MenuItem value="Expired">Expired</MenuItem>
                          <MenuItem value="Terminated">Terminated</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
      
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        label="Contract"
                        name="contractTitle"
                        value={formData.contractTitle}
                        onChange={handleInputChange}
                        placeholder="e.g., Contractor Name"
                        variant="outlined"
                        size="small"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <FaInfoCircle
                                style={{ color: "#1976d2", fontSize: "14px" }}
                              />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
      
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        label="Employee"
                        name="employee"
                        value={formData.employee}
                        onChange={handleInputChange}
                        placeholder="Employee name"
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
      
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        label="Start Date"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
      
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="End Date"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
      
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel>Wage Type</InputLabel>
                        <Select
                          required
                          name="wageType"
                          value={formData.wageType}
                          onChange={handleInputChange}
                          label="Wage Type"
                        >
                          <MenuItem value="">Select Wage Type</MenuItem>
                          <MenuItem value="Daily">Daily</MenuItem>
                          <MenuItem value="Monthly">Monthly</MenuItem>
                          <MenuItem value="Hourly">Hourly</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
      
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel>Pay Frequency</InputLabel>
                        <Select
                          required
                          name="payFrequency"
                          value={formData.payFrequency}
                          onChange={handleInputChange}
                          label="Pay Frequency"
                        >
                          <MenuItem value="">Select Frequency</MenuItem>
                          <MenuItem value="Weekly">Weekly</MenuItem>
                          <MenuItem value="Monthly">Monthly</MenuItem>
                          <MenuItem value="Semi-Monthly">Semi-Monthly</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
      
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        label="Basic Salary"
                        name="basicSalary"
                        type="number"
                        value={formData.basicSalary}
                        onChange={handleInputChange}
                        placeholder="Enter amount"
                        variant="outlined"
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AttachMoneyIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
      
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel>Filing Status</InputLabel>
                        <Select
                          name="filingStatus"
                          value={formData.filingStatus}
                          onChange={handleInputChange}
                          label="Filing Status"
                        >
                          <MenuItem value="">Select Filing Status</MenuItem>
                          <MenuItem value="Individual">Individual</MenuItem>
                          <MenuItem value="Head of Household (HOH)">
                            Head of Household (HOH)
                          </MenuItem>
                          <MenuItem value="Married Filing Jointly (MFJ)">
                            Married Filing Jointly (MFJ)
                          </MenuItem>
                          <MenuItem value="Married Filing Separately (MFS)">
                            Married Filing Separately (MFS)
                          </MenuItem>
                          <MenuItem value="Single Filer">Single Filer</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
      
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel>Department</InputLabel>
                        <Select
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          label="Department"
                        >
                          <MenuItem value="">Select Department</MenuItem>
                          <MenuItem value="HR Dept">HR Dept</MenuItem>
                          <MenuItem value="Sales Dept">Sales Dept</MenuItem>
                          <MenuItem value="S/W Dept">S/W Dept</MenuItem>
                          <MenuItem value="Marketing Dept">Marketing Dept</MenuItem>
                          <MenuItem value="Finance Dept">Finance Dept</MenuItem>
                          <MenuItem value="IT Dept">IT Dept</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
      
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel>Job Position</InputLabel>
                        <Select
                          name="position"
                          value={formData.position}
                          onChange={handleInputChange}
                          label="Job Position"
                        >
                          <MenuItem value="">Select Position</MenuItem>
                          <MenuItem value="HR Manager">HR Manager</MenuItem>
                          <MenuItem value="Sales Representative">
                            Sales Representative
                          </MenuItem>
                          <MenuItem value="Software Developer">
                            Software Developer
                          </MenuItem>
                          <MenuItem value="Marketing Specialist">
                            Marketing Specialist
                          </MenuItem>
                          <MenuItem value="Accountant">Accountant</MenuItem>
                          <MenuItem value="IT Support">IT Support</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
      
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel>Job Role</InputLabel>
                        <Select
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          label="Job Role"
                        >
                                              <MenuItem value="">Select Role</MenuItem>
                    <MenuItem value="Intern">Intern</MenuItem>
                    <MenuItem value="Junior">Junior</MenuItem>
                    <MenuItem value="Senior">Senior</MenuItem>
                    <MenuItem value="Manager">Manager</MenuItem>
                    <MenuItem value="Director">Director</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>Shift</InputLabel>
                  <Select
                    name="shift"
                    value={formData.shift}
                    onChange={handleInputChange}
                    label="Shift"
                  >
                    <MenuItem value="">Select Shift</MenuItem>
                    <MenuItem value="Regular">Regular</MenuItem>
                    <MenuItem value="Night Shift">Night Shift</MenuItem>
                    <MenuItem value="Morning Shift">Morning Shift</MenuItem>
                    <MenuItem value="Second Shift">Second Shift</MenuItem>
                    <MenuItem value="Third Shift">Third Shift</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>Work Type</InputLabel>
                  <Select
                    name="workType"
                    value={formData.workType}
                    onChange={handleInputChange}
                    label="Work Type"
                  >
                    <MenuItem value="">Select Work Type</MenuItem>
                    <MenuItem value="Hybrid">Hybrid</MenuItem>
                    <MenuItem value="Remote">Remote</MenuItem>
                    <MenuItem value="On-site">On-site</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Notice Period"
                  name="noticePeriod"
                  type="number"
                  value={formData.noticePeriod}
                  onChange={handleInputChange}
                  placeholder="Days"
                  variant="outlined"
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <FaInfoCircle
                          style={{ color: "#1976d2", fontSize: "14px" }}
                          title="Notice period in total days"
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<FaFileContract />}
                  sx={{ mt: 1 }}
                >
                  Upload Contract Document
                  <input
                    type="file"
                    name="contractDocument"
                    onChange={handleInputChange}
                    hidden
                  />
                </Button>
                {formData.contractDocument && (
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Selected file: {formData.contractDocument.name}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Note"
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  placeholder="Additional notes about the contract"
                  variant="outlined"
                  size="small"
                />
              </Grid>
            </Grid>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 3,
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                onClick={() => {
                  setShowCreatePage(false);
                  setEditingId(null);
                  setSelectedEmployee("");
                }}
                startIcon={<CancelIcon />}
                sx={{
                  border: "2px solid #1976d2",
                  color: "#1976d2",
                  "&:hover": {
                    border: "2px solid #64b5f6",
                    backgroundColor: "#e3f2fd",
                  },
                  borderRadius: "8px",
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveCreate}
                startIcon={<SaveIcon />}
                sx={{
                  background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                  color: "white",
                  "&:hover": {
                    background: "linear-gradient(45deg, #1565c0, #42a5f5)",
                  },
                  borderRadius: "8px",
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                }}
              >
                {editingId ? "Update Contract" : "Save Contract"}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="contract-page">
      {/* Hidden CSV Link for export */}
      <CSVLink
        data={csvData}
        headers={csvHeaders}
        filename="contracts_export.csv"
        className="hidden"
        ref={csvLink}
      />

      {/* Toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Loading overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      {/* Header */}
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          padding: "16px 24px",
          marginBottom: "24px",
        }}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: "#1976d2",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FaFileContract style={{ marginRight: "10px" }} />
              CONTRACT
            </Typography>
          </Grid>

          <Grid item xs={12} md={8}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="flex-end"
            >
              <TextField
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaSearch />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  minWidth: { xs: "100%", sm: "250px" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "15px",
                    backgroundColor: "#f8fafc",
                  },
                }}
              />

              <Button
                variant="outlined"
                startIcon={<FaFilter />}
                onClick={handleFilterIconClick}
                sx={{
                  borderRadius: "8px",
                  borderColor: "#e0e0e0",
                  color: "#475569",
                  "&:hover": {
                    borderColor: "#1976d2",
                    backgroundColor: "#f0f7ff",
                  },
                }}
              >
                Filter
              </Button>

              <Button
                variant="contained"
                startIcon={<FaPlus />}
                onClick={handleCreateClick}
                sx={{
                  background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                  color: "white",
                  borderRadius: "8px",
                  "&:hover": {
                    background: "linear-gradient(45deg, #1565c0, #42a5f5)",
                  },
                  boxShadow: "0 2px 8px rgba(25, 118, 210, 0.25)",
                }}
              >
                Create
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Filter Dialog - Using Dialog instead of popup */}
      <Dialog
        open={showFilterDialog}
        onClose={() => setShowFilterDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            p: 2,
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Filter Contracts
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Employee Name Filter */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Employee Name"
                name="employeeName"
                value={filterData.employeeName}
                onChange={handleFilterChange}
                size="small"
                placeholder="Search by employee name"
              />
            </Grid>

            {/* Contract Status Filter */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Contract Status</InputLabel>
                <Select
                  name="contractStatus"
                  value={filterData.contractStatus}
                  onChange={handleFilterChange}
                  label="Contract Status"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Draft">Draft</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Expired">Expired</MenuItem>
                  <MenuItem value="Terminated">Terminated</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Wage Type Filter */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Wage Type</InputLabel>
                <Select
                  name="wageType"
                  value={filterData.wageType}
                  onChange={handleFilterChange}
                  label="Wage Type"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="Hourly">Hourly</MenuItem>
                  <MenuItem value="Daily">Daily</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {/* Add more filters as needed */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Filing Status</InputLabel>
              <Select
                name="filingStatus"
                value={filterData.filingStatus}
                onChange={handleFilterChange}
                label="Filing Status"
                onClick={(e) => e.stopPropagation()}
                MenuProps={{
                  onClick: (e) => e.stopPropagation(),
                  disableScrollLock: true,
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Individual">Individual</MenuItem>
                <MenuItem value="Head of Household (HOH)">
                  Head of Household (HOH)
                </MenuItem>
                <MenuItem value="Married Filing Jointly (MFJ)">
                  Married Filing Jointly (MFJ)
                </MenuItem>
                <MenuItem value="Married Filing Separately (MFS)">
                  Married Filing Separately (MFS)
                </MenuItem>
                <MenuItem value="Single Filer">Single Filer</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="outlined"
            onClick={handleResetFilter}
            sx={{ borderRadius: "8px" }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            onClick={handleApplyFilter}
            sx={{
              borderRadius: "8px",
              background: "linear-gradient(45deg, #1976d2, #64b5f6)",
              "&:hover": {
                background: "linear-gradient(45deg, #1565c0, #42a5f5)",
              },
            }}
          >
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>

      {/* Export toolbar - Styled version */}
      <Paper
        elevation={0}
        sx={{
          backgroundColor: "#f8fafc",
          borderRadius: "8px",
          padding: "12px 16px",
          marginBottom: "24px",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: "#475569",
            display: "flex",
            alignItems: "center",
          }}
        >
          <FaFileExport style={{ marginRight: "8px" }} />
          Export & Reports:
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          sx={{ "& button": { minWidth: "auto" } }}
        >
          {/* <Button
            size="small"
            startIcon={<FaFileCsv />}
            onClick={handleExportCSV}
            sx={{ color: "#16a34a" }}
          >
            CSV
          </Button> */}
          <Button
            size="small"
            startIcon={<FaFileExcel />}
            onClick={handleExportCSV}
            sx={{ color: "#16a34a" }}
          >
            Excel
          </Button>
          <Button
            size="small"
            startIcon={<FaFilePdf />}
            onClick={exportToPDF}
            sx={{ color: "#ef4444" }}
          >
            PDF
          </Button>
          <Button
            size="small"
            startIcon={<FaPrint />}
            onClick={handlePrint}
            sx={{ color: "#475569" }}
          >
            Print
          </Button>
          <Button
            size="small"
            startIcon={<FaChartBar />}
            onClick={toggleDashboard}
            sx={{ color: "#1976d2" }}
          >
            {showDashboard ? "Hide Dashboard" : "Show Dashboard"}
          </Button>
        </Stack>
      </Paper>

      {/* Dashboard */}
      {showDashboard && dashboardStats && (
        <div
          className={`dashboard-container dashboard-${dashboardOrientation}`}
        >
          <div className="stats-cards">
            <div className="stat-card primary">
              <div className="stat-card-title">Total Contracts</div>
              <div className="stat-card-value">
                {dashboardStats.totalContracts || contracts.length}
              </div>
              <div className="stat-card-footer">
                <FaFileContract /> All contracts
              </div>
            </div>
            <div className="stat-card success">
              <div className="stat-card-title">Active Contracts</div>
              <div className="stat-card-value">
                {dashboardStats.byStatus?.active || 0}
              </div>
              <div className="stat-card-footer">
                <FaCheckCircle /> Currently active
              </div>
            </div>
            <div className="stat-card warning">
              <div className="stat-card-title">Expiring Soon</div>
              <div className="stat-card-value">
                {dashboardStats.expiringContracts?.count || 0}
              </div>
              <div className="stat-card-footer">
                <FaCalendarAlt /> Next 30 days
              </div>
            </div>
            <div className="stat-card danger">
              <div className="stat-card-title">Expired Contracts</div>
              <div className="stat-card-value">
                {dashboardStats.byStatus?.expired || 0}
              </div>
              <div className="stat-card-footer">
                <FaTimesCircle /> Need renewal
              </div>
            </div>
          </div>

          {/* Expiring contracts alert */}
          {dashboardStats.expiringContracts?.count > 0 && (
            <div className="expiring-contracts-alert">
              <div className="expiring-contracts-header">
                <FaExclamationTriangle /> Contracts Expiring Soon
              </div>
              <ul className="expiring-contracts-list">
                {dashboardStats.expiringContracts.contracts.map(
                  (contract, index) => (
                    <li key={index} className="expiring-contract-item">
                      {contract.employee}'s {contract.contract} contract expires
                      on {new Date(contract.endDate).toLocaleDateString()}
                      <button
                        className="renew-button"
                        onClick={() => {
                          setRenewalData({
                            id: contract._id,
                            startDate: new Date(contract.endDate)
                              .toISOString()
                              .split("T")[0],
                            endDate: "",
                            basicSalary: contract.basicSalary,
                            renewalReason: "",
                          });
                          setShowRenewModal(true);
                        }}
                      >
                        Renew
                      </button>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Options bar for bulk actions */}
      {selectedContracts.length > 0 && (
        <div className="options-bar">
          <span>
            <strong>{selectedContracts.length}</strong> contracts selected
          </span>
          <select
            className="bulk-action-select"
            value={bulkAction}
            onChange={handleBulkActionChange}
          >
            <option value="">Bulk Actions</option>
            <option value="delete">Delete Selected</option>
            <option value="export">Export Selected</option>
            <option value="status">Update Status</option>
          </select>
          <button
            className="bulk-action-button"
            onClick={handleApplyBulkAction}
          >
            Apply
          </button>
          <button
            onClick={() => {
              setSelectedContracts([]);
              setSelectAll(false);
            }}
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Table */}
      <div className="contract-table-container">
        <table className="contract-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th onClick={() => handleSort("contract")}>
                Contractor Name{" "}
                {sortConfig.key === "contract" ? (
                  sortConfig.direction === "asc" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : null}
              </th>
              <th onClick={() => handleSort("employee")}>
                Employee{" "}
                {sortConfig.key === "employee" ? (
                  sortConfig.direction === "asc" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : null}
              </th>
              <th onClick={() => handleSort("startDate")}>
                Start Date{" "}
                {sortConfig.key === "startDate" ? (
                  sortConfig.direction === "asc" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : null}
              </th>
              <th onClick={() => handleSort("endDate")}>
                End Date{" "}
                {sortConfig.key === "endDate" ? (
                  sortConfig.direction === "asc" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : null}
              </th>
              <th onClick={() => handleSort("wageType")}>
                Wage Type{" "}
                {sortConfig.key === "wageType" ? (
                  sortConfig.direction === "asc" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : null}
              </th>
              <th onClick={() => handleSort("basicSalary")}>
                Basic Salary{" "}
                {sortConfig.key === "basicSalary" ? (
                  sortConfig.direction === "asc" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : null}
              </th>
              <th onClick={() => handleSort("filingStatus")}>
                Filing Status{" "}
                {sortConfig.key === "filingStatus" ? (
                  sortConfig.direction === "asc" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : null}
              </th>
              <th onClick={() => handleSort("contractStatus")}>
                Contract Status{" "}
                {sortConfig.key === "contractStatus" ? (
                  sortConfig.direction === "asc" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : null}
              </th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {getCurrentPageItems().length > 0 ? (
              getCurrentPageItems().map((contract, index) => {
                // Determine if this is one of the last rows
                const isLastRows = index >= getCurrentPageItems().length - 2;

                return (
                  <tr key={contract._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedContracts.includes(contract._id)}
                        onChange={() => handleSelectContract(contract._id)}
                      />
                    </td>
                    <td>{contract.contract}</td>
                    <td>{contract.employee}</td>
                    <td>{contract.startDate}</td>
                    <td>{contract.endDate || "N/A"}</td>
                    <td>{contract.wageType}</td>
                    <td>{contract.basicSalary}</td>
                    <td>{contract.filingStatus || "N/A"}</td>
                    <td>
                      <span
                        className={`status-badge status-badge-${(
                          contract.contractStatus || "active"
                        ).toLowerCase()}`}
                      >
                        {contract.contractStatus || "Active"}
                      </span>
                    </td>
                    <td className="action-buttons-cell">
                      {editingId === contract._id ? (
                        <button
                          className="action-button save-button"
                          onClick={handleSave}
                          title="Save changes"
                        >
                          <FaSave />
                        </button>
                      ) : (
                        <>
                          <button
                            className="action-button view-button"
                            onClick={() => handlePreview(contract)}
                            title="Preview"
                          >
                            <FaEye />
                          </button>
                          <button
                            className="action-button edit-button"
                            onClick={() => handleEdit(contract)}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="action-button delete-button"
                            onClick={() => handleDelete(contract._id)}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                          <button
                            className="action-button renew-button"
                            onClick={() => {
                              setRenewalData({
                                id: contract._id,
                                startDate:
                                  contract.endDate ||
                                  new Date().toISOString().split("T")[0],
                                endDate: "",
                                basicSalary: contract.basicSalary,
                                renewalReason: "",
                              });
                              setShowRenewModal(true);
                            }}
                            title="Renew"
                          >
                            <FaRedo />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="10" className="no-data">
                  No contracts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Preview Contract Modal */}
      {showPreviewModal && previewContract && (
        <Dialog
          open={true}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              width: "90%",
              maxWidth: "900px",
              borderRadius: "12px",
              overflow: "hidden",
            },
          }}
        >
          <DialogTitle
            sx={{
              background: "linear-gradient(45deg, #1976d2, #64b5f6)",
              color: "white",
              fontSize: "1.5rem",
              fontWeight: 600,
              padding: "16px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <FaFileContract style={{ marginRight: "10px" }} />
              Contract Details
            </Typography>
            <IconButton
              onClick={() => setShowPreviewModal(false)}
              sx={{ color: "white" }}
              size="small"
            >
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ padding: "24px" }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper
                  sx={{ p: 2, borderRadius: "8px", backgroundColor: "#f8fafc" }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="primary"
                  >
                    Contract Status
                  </Typography>
                  <Typography variant="body1">
                    {previewContract.contractStatus || "Active"}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, borderRadius: "8px" }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color="textSecondary"
                  >
                    Contract Type
                  </Typography>
                  <Typography variant="body1">
                    {previewContract.contract}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, borderRadius: "8px" }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color="textSecondary"
                  >
                    Employee
                  </Typography>
                  <Typography variant="body1">
                    {previewContract.employee}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, borderRadius: "8px" }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color="textSecondary"
                  >
                    Start Date
                  </Typography>
                  <Typography variant="body1">
                    {previewContract.startDate}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, borderRadius: "8px" }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color="textSecondary"
                  >
                    End Date
                  </Typography>
                  <Typography variant="body1">
                    {previewContract.endDate || "N/A"}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, borderRadius: "8px" }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color="textSecondary"
                  >
                    Wage Type
                  </Typography>
                  <Typography variant="body1">
                    {previewContract.wageType}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, borderRadius: "8px" }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color="textSecondary"
                  >
                    Basic Salary
                  </Typography>
                  <Typography variant="body1">
                    ${previewContract.basicSalary}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, borderRadius: "8px" }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color="textSecondary"
                  >
                    Filing Status
                  </Typography>
                  <Typography variant="body1">
                    {previewContract.filingStatus || "N/A"}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, borderRadius: "8px" }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color="textSecondary"
                  >
                    Department
                  </Typography>
                  <Typography variant="body1">
                    {previewContract.department || "N/A"}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, borderRadius: "8px" }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color="textSecondary"
                  >
                    Position
                    </Typography>
                  <Typography variant="body1">
                    {previewContract.position || "N/A"}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, borderRadius: "8px" }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color="textSecondary"
                  >
                    Role
                  </Typography>
                  <Typography variant="body1">
                    {previewContract.role || "N/A"}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, borderRadius: "8px" }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color="textSecondary"
                  >
                    Shift
                  </Typography>
                  <Typography variant="body1">
                    {previewContract.shift || "N/A"}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, borderRadius: "8px" }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color="textSecondary"
                  >
                    Work Type
                  </Typography>
                  <Typography variant="body1">
                    {previewContract.workType || "N/A"}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, borderRadius: "8px" }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color="textSecondary"
                  >
                    Notice Period
                  </Typography>
                  <Typography variant="body1">
                    {previewContract.noticePeriod || "N/A"} days
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, borderRadius: "8px" }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color="textSecondary"
                  >
                    Pay Frequency
                  </Typography>
                  <Typography variant="body1">
                    {previewContract.payFrequency || "N/A"}
                  </Typography>
                </Paper>
              </Grid>

              {previewContract.note && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, borderRadius: "8px" }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      color="textSecondary"
                    >
                      Notes
                    </Typography>
                    <Typography variant="body1">
                      {previewContract.note}
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <Button
                variant="contained"
                onClick={() => setShowPreviewModal(false)}
                sx={{
                  background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                  color: "white",
                  "&:hover": {
                    background: "linear-gradient(45deg, #1565c0, #42a5f5)",
                  },
                  borderRadius: "8px",
                  px: 3,
                  py: 1,
                }}
              >
                Close
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      )}

      {/* Pagination */}
      {filteredContracts.length > 0 && (
        <div className="pagination-container">
          <div className="pagination">
            <button
              className={`pagination-button ${
                currentPage === 1 ? "disabled" : ""
              }`}
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              className={`pagination-button ${
                currentPage === 1 ? "disabled" : ""
              }`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={i}
                  className={`pagination-button ${
                    currentPage === pageNum ? "active" : ""
                  }`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              className={`pagination-button ${
                currentPage === totalPages ? "disabled" : ""
              }`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button
              className={`pagination-button ${
                currentPage === totalPages ? "disabled" : ""
              }`}
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </button>
          </div>

          <div className="items-per-page-container">
            <span>Items per page:</span>
            <select
              className="items-per-page"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      )}

      {/* Renew Contract Modal */}
      {showRenewModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-header">Renew Contract</h3>
            <div className="form-row">
              <div className="form-group">
                <label>New Start Date</label>
                <input
                  type="date"
                  value={renewalData.startDate}
                  onChange={(e) =>
                    setRenewalData({
                      ...renewalData,
                      startDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>New End Date</label>
                <input
                  type="date"
                  value={renewalData.endDate}
                  onChange={(e) =>
                    setRenewalData({ ...renewalData, endDate: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-group">
              <label>New Basic Salary</label>
              <input
                type="number"
                value={renewalData.basicSalary}
                onChange={(e) =>
                  setRenewalData({
                    ...renewalData,
                    basicSalary: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Renewal Reason</label>
              <textarea
                value={renewalData.renewalReason}
                onChange={(e) =>
                  setRenewalData({
                    ...renewalData,
                    renewalReason: e.target.value,
                  })
                }
              />
            </div>
            <div className="modal-footer">
              <button
                className="modal-save-button"
                onClick={() => {
                  // In a real app, you would make an API call to renew the contract
                  // For now, we'll just update it locally
                  const updatedContracts = contracts.map((contract) => {
                    if (contract._id === renewalData.id) {
                      return {
                        ...contract,
                        startDate: renewalData.startDate,
                        endDate: renewalData.endDate,
                        basicSalary: Number(renewalData.basicSalary),
                        contractStatus: "Active",
                        note: contract.note
                          ? `${contract.note}\nRenewal: ${renewalData.renewalReason}`
                          : `Renewal: ${renewalData.renewalReason}`,
                      };
                    }
                    return contract;
                  });

                  setContracts(updatedContracts);
                  setFilteredContracts(updatedContracts);
                  setShowRenewModal(false);
                  toast.success("Contract renewed successfully");
                }}
              >
                Renew Contract
              </button>
              <button
                className="modal-close-button"
                onClick={() => setShowRenewModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Update Modal */}
      {showBulkUpdateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-header">Update Multiple Contracts</h3>
            <div className="form-group">
              <label>Set Contract Status</label>
              <select
                value={bulkUpdateData.value}
                onChange={(e) =>
                  setBulkUpdateData({
                    ...bulkUpdateData,
                    value: e.target.value,
                  })
                }
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Expired">Expired</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>
            <div className="form-group">
              <label>Reason for Update</label>
              <textarea
                value={bulkUpdateData.reason || ""}
                onChange={(e) =>
                  setBulkUpdateData({
                    ...bulkUpdateData,
                    reason: e.target.value,
                  })
                }
                placeholder="Optional reason for this update"
              />
            </div>
            <div className="modal-footer">
              <button className="modal-save-button" onClick={handleBulkUpdate}>
                Update {selectedContracts.length} Contracts
              </button>
              <button
                className="modal-close-button"
                onClick={() => setShowBulkUpdateModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contract;




      

