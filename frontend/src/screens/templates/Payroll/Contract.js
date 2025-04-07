// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import {
//   FaFilter,
//   FaSortUp,
//   FaSortDown,
//   FaInfoCircle,
//   FaEdit,
//   FaTrash,
//   FaSave,
//   FaClipboardCheck,
//   FaExclamationTriangle,
//   FaFileExport,
//   FaFileCsv,
//   FaFileExcel,
//   FaFilePdf,
//   FaPrint,
//   FaChartBar,
//   FaCalendarAlt,
//   FaUserTie,
//   FaMoneyBillWave,
//   FaBuilding,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaEllipsisV,
//   FaRedo,
//   FaPlus,
//   FaSearch,
//   FaFileContract,
// } from "react-icons/fa";
// import { CSVLink } from "react-csv";
// import { jsPDF } from "jspdf";
// import "jspdf-autotable";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "./Contract.css";

// const Contract = () => {
//   // State variables
//   const [searchTerm, setSearchTerm] = useState("");
//   const [contracts, setContracts] = useState([]);
//   const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
//   const [editingId, setEditingId] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [showCreatePage, setShowCreatePage] = useState(false);
//   const [formData, setFormData] = useState({
//     contractStatus: "Active",
//     contractTitle: "",
//     employee: "",
//     startDate: "",
//     endDate: "",
//     wageType: "",
//     payFrequency: "",
//     basicSalary: "",
//     filingStatus: "",
//     department: "",
//     position: "",
//     role: "",
//     shift: "",
//     workType: "",
//     noticePeriod: "",
//     contractDocument: null,
//     deductFromBasicPay: false,
//     calculateDailyLeave: false,
//     note: "",
//   });
//   const [showFilterPopup, setShowFilterPopup] = useState(false);
//   const [filterData, setFilterData] = useState({
//     employeeName: "",
//     contractStatus: "",
//     startDate: "",
//     endDate: "",
//     contract: "",
//     wageType: "",
//     department: "",
//     minSalary: "",
//     maxSalary: "",
//   });
//   const [filteredContracts, setFilteredContracts] = useState([]);
//   const [selectedContracts, setSelectedContracts] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [showDashboard, setShowDashboard] = useState(false);
//   const [dashboardOrientation, setDashboardOrientation] = useState("landscape");
//   const [dashboardStats, setDashboardStats] = useState(null);
//   const [showRenewModal, setShowRenewModal] = useState(false);
//   const [renewalData, setRenewalData] = useState({
//     id: null,
//     startDate: "",
//     endDate: "",
//     basicSalary: "",
//     renewalReason: "",
//   });
//   const [showTerminateModal, setShowTerminateModal] = useState(false);
//   const [terminationData, setTerminationData] = useState({
//     id: null,
//     terminationReason: "",
//     terminationDate: "",
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [bulkAction, setBulkAction] = useState("");
//   const [showBulkUpdateModal, setShowBulkUpdateModal] = useState(false);
//   const [bulkUpdateData, setBulkUpdateData] = useState({});

//   const filterRef = useRef(null);
//   const csvLink = useRef(null);

//   // Fetch contracts on component mount
//   useEffect(() => {
//     fetchContracts();
//   }, []);

//   // Handle click outside filter popup
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (filterRef.current && !filterRef.current.contains(event.target)) {
//         setShowFilterPopup(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Update filtered contracts when contracts change
//   useEffect(() => {
//     setFilteredContracts(contracts);
//     calculateTotalPages();
//   }, [contracts, itemsPerPage]);

//   // Calculate total pages for pagination
//   const calculateTotalPages = () => {
//     setTotalPages(Math.ceil(filteredContracts.length / itemsPerPage));
//   };

//   // Fetch contracts from API
//   const fetchContracts = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         "http://localhost:5000/api/payroll-contracts"
//       );
//       if (response.data.success) {
//         setContracts(response.data.data);
//         setFilteredContracts(response.data.data);
//         calculateTotalPages();
//       }
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching contracts:", error);
//       toast.error("Failed to fetch contracts");
//       setLoading(false);

//       // Set default data if API fails
//       const defaultData = [
//         {
//           _id: "1",
//           contract: "Full-time",
//           employee: "John Doe",
//           startDate: "2023-01-01",
//           endDate: "2024-01-01",
//           wageType: "Monthly",
//           basicSalary: 5000,
//           filingStatus: "Filed",
//           contractStatus: "Active",
//         },
//         {
//           _id: "2",
//           contract: "Part-time",
//           employee: "Jane Smith",
//           startDate: "2023-06-15",
//           endDate: "2024-06-14",
//           wageType: "Hourly",
//           basicSalary: 25,
//           filingStatus: "Filed",
//           contractStatus: "Active",
//         },
//       ];
//       setContracts(defaultData);
//       setFilteredContracts(defaultData);
//     }
//   };

//   // Fetch dashboard statistics
//   const fetchDashboardStats = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         "http://localhost:5000/api/payroll-contracts/dashboard"
//       );
//       if (response.data.success) {
//         setDashboardStats(response.data.data);
//       }
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching dashboard stats:", error);
//       toast.error("Failed to fetch dashboard statistics");
//       setLoading(false);
//     }
//   };

//   // Toggle dashboard view
//   const toggleDashboard = () => {
//     setShowDashboard(!showDashboard);
//     if (!showDashboard) {
//       setDashboardOrientation("landscape");
//       fetchDashboardStats();
//     }
//   };

//   // Handle create button click
//   const handleCreateClick = () => {
//     setFormData({
//       contractStatus: "Active",
//       contractTitle: "",
//       employee: "",
//       startDate: "",
//       endDate: "",
//       wageType: "",
//       payFrequency: "",
//       basicSalary: "",
//       filingStatus: "",
//       department: "",
//       position: "",
//       role: "",
//       shift: "",
//       workType: "",
//       noticePeriod: "",
//       contractDocument: null,
//       deductFromBasicPay: false,
//       calculateDailyLeave: false,
//       note: "",
//     });
//     setShowCreatePage(true);
//   };

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value, type, checked, files } = e.target;
//     setFormData({
//       ...formData,
//       [name]:
//         type === "checkbox" ? checked : type === "file" ? files[0] : value,
//     });
//   };

//   // Handle form submission for creating a new contract
//   const handleSaveCreate = async () => {
//     try {
//       setLoading(true);
//       const newContract = {
//         contract: formData.contractTitle,
//         contractStatus: formData.contractStatus,
//         employee: formData.employee,
//         startDate: formData.startDate,
//         endDate: formData.endDate,
//         wageType: formData.wageType,
//         payFrequency: formData.payFrequency,
//         basicSalary: Number(formData.basicSalary),
//         filingStatus: formData.filingStatus,
//         department: formData.department,
//         position: formData.position,
//         role: formData.role,
//         shift: formData.shift,
//         workType: formData.workType,
//         noticePeriod: Number(formData.noticePeriod),
//         deductFromBasicPay: formData.deductFromBasicPay,
//         calculateDailyLeave: formData.calculateDailyLeave,
//         note: formData.note,
//       };

//       // Handle file upload if a document is selected
//       if (formData.contractDocument) {
//         const formDataWithFile = new FormData();
//         formDataWithFile.append("document", formData.contractDocument);

//         // Upload file first (this would be a separate endpoint in a real app)
//         // const uploadResponse = await axios.post('http://localhost:5000/api/upload', formDataWithFile);
//         // newContract.documentUrl = uploadResponse.data.url;
//       }

//       const response = await axios.post(
//         "http://localhost:5000/api/payroll-contracts",
//         newContract
//       );

//       if (response.data.success) {
//         toast.success("Contract created successfully");
//         setContracts([...contracts, response.data.data]);
//         setFilteredContracts([...filteredContracts, response.data.data]);
//         setShowCreatePage(false);
//       }
//       setLoading(false);
//     } catch (error) {
//       console.error("Contract creation error:", error);
//       toast.error(error.response?.data?.error || "Failed to create contract");
//       setLoading(false);
//     }
//   };

//   // Handle sorting
//   const handleSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });

//     const sortedContracts = [...filteredContracts].sort((a, b) => {
//       if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
//       if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
//       return 0;
//     });
//     setFilteredContracts(sortedContracts);
//   };

//   // Handle edit button click
//   const handleEdit = (contract) => {
//     setEditingId(contract._id);
//     setEditedData({
//       _id: contract._id,
//       contract: contract.contract,
//       employee: contract.employee,
//       startDate: contract.startDate,
//       endDate: contract.endDate,
//       wageType: contract.wageType,
//       basicSalary: contract.basicSalary,
//       filingStatus: contract.filingStatus,
//       contractStatus: contract.contractStatus,
//     });
//   };

//   // Handle changes in edit mode
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditedData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   // Handle save in edit mode
//   const handleSave = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.put(
//         `http://localhost:5000/api/payroll-contracts/${editedData._id}`,
//         {
//           contract: editedData.contract,
//           employee: editedData.employee,
//           startDate: editedData.startDate,
//           endDate: editedData.endDate,
//           wageType: editedData.wageType,
//           basicSalary: Number(editedData.basicSalary),
//           filingStatus: editedData.filingStatus,
//           contractStatus: editedData.contractStatus,
//         }
//       );

//       if (response.data.success) {
//         toast.success("Contract updated successfully");
//         const updatedContract = response.data.data;
//         setContracts(
//           contracts.map((contract) =>
//             contract._id === editedData._id ? updatedContract : contract
//           )
//         );
//         setFilteredContracts(
//           filteredContracts.map((contract) =>
//             contract._id === editedData._id ? updatedContract : contract
//           )
//         );
//         setEditingId(null);
//       }
//       setLoading(false);
//     } catch (error) {
//       console.error("Save failed:", error);
//       toast.error(error.response?.data?.error || "Failed to update contract");
//       setLoading(false);
//     }
//   };

//   // Handle delete
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this contract?")) {
//       try {
//         setLoading(true);
//         const response = await axios.delete(
//           `http://localhost:5000/api/payroll-contracts/${id}`
//         );
//         if (response.data.success) {
//           toast.success("Contract deleted successfully");
//           setContracts(contracts.filter((contract) => contract._id !== id));
//           setFilteredContracts(
//             filteredContracts.filter((contract) => contract._id !== id)
//           );
//         }
//         setLoading(false);
//       } catch (error) {
//         console.error("Delete failed:", error);
//         toast.error(error.response?.data?.error || "Failed to delete contract");
//         setLoading(false);
//       }
//     }
//   };

//   // Handle search
//   const handleSearchChange = (e) => {
//     const searchValue = e.target.value.toLowerCase();
//     setSearchTerm(searchValue);

//     const searchResults = contracts.filter(
//       (contract) =>
//         contract.employee?.toLowerCase().includes(searchValue) ||
//         contract.contract?.toLowerCase().includes(searchValue) ||
//         contract.wageType?.toLowerCase().includes(searchValue) ||
//         contract.filingStatus?.toLowerCase().includes(searchValue) ||
//         contract.department?.toLowerCase().includes(searchValue)
//     );

//     setFilteredContracts(searchResults);
//     setCurrentPage(1);
//   };

//   // Handle filter icon click
//   const handleFilterIconClick = () => {
//     setShowFilterPopup(true);
//   };

//   // Handle filter changes
//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilterData({ ...filterData, [name]: value });
//   };

//   // Reset filters
//   const handleResetFilter = () => {
//     setFilterData({
//       employeeName: "",
//       contractStatus: "",
//       startDate: "",
//       endDate: "",
//       contract: "",
//       wageType: "",
//       department: "",
//       minSalary: "",
//       maxSalary: "",
//     });
//     setFilteredContracts(contracts);
//     setShowFilterPopup(false);
//     setCurrentPage(1);
//   };

//   // Apply filters
//   const handleApplyFilter = async () => {
//     try {
//       setLoading(true);

//       // Build query string from filter data
//       const queryParams = new URLSearchParams();
//       if (filterData.employeeName)
//         queryParams.append("employeeName", filterData.employeeName);
//       if (filterData.contractStatus)
//         queryParams.append("contractStatus", filterData.contractStatus);
//       if (filterData.startDate)
//         queryParams.append("startDate", filterData.startDate);
//       if (filterData.endDate) queryParams.append("endDate", filterData.endDate);
//       if (filterData.contract)
//         queryParams.append("contract", filterData.contract);
//       if (filterData.wageType)
//         queryParams.append("wageType", filterData.wageType);
//       if (filterData.department)
//         queryParams.append("department", filterData.department);
//       if (filterData.minSalary)
//         queryParams.append("minSalary", filterData.minSalary);
//       if (filterData.maxSalary)
//         queryParams.append("maxSalary", filterData.maxSalary);

//       const response = await axios.get(
//         `http://localhost:5000/api/payroll-contracts/filter?${queryParams.toString()}`
//       );

//       if (response.data.success) {
//         setFilteredContracts(response.data.data);
//         setCurrentPage(1);
//         calculateTotalPages();
//       }

//       setShowFilterPopup(false);
//       setLoading(false);
//     } catch (error) {
//       console.error("Filter application failed:", error);
//       toast.error("Failed to apply filters");
//       setLoading(false);
//     }
//   };

//   // Handle contract selection for bulk actions
//   const handleSelectContract = (id) => {
//     if (selectedContracts.includes(id)) {
//       setSelectedContracts(
//         selectedContracts.filter((contractId) => contractId !== id)
//       );
//     } else {
//       setSelectedContracts([...selectedContracts, id]);
//     }
//   };

//   // Handle select all contracts
//   const handleSelectAll = () => {
//     if (selectAll) {
//       setSelectedContracts([]);
//     } else {
//       setSelectedContracts(
//         getCurrentPageItems().map((contract) => contract._id)
//       );
//     }
//     setSelectAll(!selectAll);
//   };

//   // Handle bulk action selection
//   const handleBulkActionChange = (e) => {
//     setBulkAction(e.target.value);
//   };

//   // Apply bulk action
//   const handleApplyBulkAction = () => {
//     if (!bulkAction || selectedContracts.length === 0) {
//       toast.warning("Please select an action and at least one contract");
//       return;
//     }

//     switch (bulkAction) {
//       case "delete":
//         if (
//           window.confirm(
//             `Are you sure you want to delete ${selectedContracts.length} contracts?`
//           )
//         ) {
//           handleBulkDelete();
//         }
//         break;
//       case "export":
//         handleExportSelected();
//         break;
//       case "update":
//         setShowBulkUpdateModal(true);
//         break;
//       default:
//         toast.warning("Invalid action selected");
//     }
//   };

//   // Handle bulk delete
//   const handleBulkDelete = async () => {
//     try {
//       setLoading(true);

//       // In a real app, you would have a bulk delete endpoint
//       // For now, we'll delete them one by one
//       for (const id of selectedContracts) {
//         await axios.delete(`http://localhost:5000/api/payroll-contracts/${id}`);
//       }

//       toast.success(
//         `${selectedContracts.length} contracts deleted successfully`
//       );

//       // Refresh contracts
//       fetchContracts();
//       setSelectedContracts([]);
//       setSelectAll(false);
//       setLoading(false);
//     } catch (error) {
//       console.error("Bulk delete failed:", error);
//       toast.error("Failed to delete contracts");
//       setLoading(false);
//     }
//   };

//   // Handle bulk update
//   const handleBulkUpdate = async () => {
//     try {
//       setLoading(true);

//       const response = await axios.post(
//         "http://localhost:5000/api/payroll-contracts/bulk-update",
//         {
//           ids: selectedContracts,
//           updateData: bulkUpdateData,
//         }
//       );

//       if (response.data.success) {
//         toast.success(response.data.message);
//         fetchContracts();
//         setSelectedContracts([]);
//         setSelectAll(false);
//         setShowBulkUpdateModal(false);
//         setBulkUpdateData({});
//       }

//       setLoading(false);
//     } catch (error) {
//       console.error("Bulk update failed:", error);
//       toast.error(error.response?.data?.error || "Failed to update contracts");
//       setLoading(false);
//     }
//   };

//   // Handle bulk update data changes
//   const handleBulkUpdateChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setBulkUpdateData({
//       ...bulkUpdateData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   // Handle export selected contracts
//   const handleExportSelected = () => {
//     const selectedData = contracts.filter((contract) =>
//       selectedContracts.includes(contract._id)
//     );

//     if (selectedData.length === 0) {
//       toast.warning("No contracts selected for export");
//       return;
//     }

//     // Trigger CSV download
//     if (csvLink.current) {
//       csvLink.current.link.click();
//     }
//   };

//   // Export to PDF
//   const exportToPDF = () => {
//     const doc = new jsPDF();

//     // Add title
//     doc.setFontSize(18);
//     doc.text("Contracts Report", 14, 22);
//     doc.setFontSize(11);
//     doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

//     // Define the columns for the table
//     const tableColumn = [
//       "Contract",
//       "Employee",
//       "Start Date",
//       "End Date",
//       "Wage Type",
//       "Basic Salary",
//       "Status",
//     ];

//     // Define the rows for the table
//     const tableRows = [];

//     // Get data for the table
//     const data =
//       selectedContracts.length > 0
//         ? contracts.filter((contract) =>
//             selectedContracts.includes(contract._id)
//           )
//         : getCurrentPageItems();

//     data.forEach((contract) => {
//       const contractData = [
//         contract.contract,
//         contract.employee,
//         contract.startDate,
//         contract.endDate || "N/A",
//         contract.wageType,
//         contract.basicSalary,
//         contract.contractStatus,
//       ];
//       tableRows.push(contractData);
//     });

//     // Generate the PDF
//     doc.autoTable({
//       head: [tableColumn],
//       body: tableRows,
//       startY: 40,
//       styles: {
//         fontSize: 10,
//         cellPadding: 3,
//         lineWidth: 0.5,
//         lineColor: [0, 0, 0],
//       },
//       headStyles: {
//         fillColor: [41, 128, 185],
//         textColor: 255,
//         fontStyle: "bold",
//       },
//       alternateRowStyles: {
//         fillColor: [245, 245, 245],
//       },
//     });

//     // Save the PDF
//     doc.save("contracts_report.pdf");
//     toast.success("PDF exported successfully");
//   };

//   // Handle print
//   const handlePrint = () => {
//     window.print();
//   };

//   // Handle pagination
//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   // Get current page items
//   const getCurrentPageItems = () => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     return filteredContracts.slice(startIndex, endIndex);
//   };

//   // Handle renew contract
//   const handleRenewContract = (id) => {
//     const contract = contracts.find((c) => c._id === id);
//     if (!contract) return;

//     // Set default renewal data
//     setRenewalData({
//       id,
//       startDate: new Date().toISOString().split("T")[0], // Today
//       endDate: "", // Empty by default
//       basicSalary: contract.basicSalary,
//       renewalReason: "Contract renewal",
//     });

//     setShowRenewModal(true);
//   };

//   // Submit contract renewal
//   const submitRenewal = async () => {
//     try {
//       setLoading(true);

//       const response = await axios.post(
//         `http://localhost:5000/api/payroll-contracts/${renewalData.id}/renew`,
//         renewalData
//       );

//       if (response.data.success) {
//         toast.success("Contract renewed successfully");
//         fetchContracts();
//         setShowRenewModal(false);
//       }

//       setLoading(false);
//     } catch (error) {
//       console.error("Contract renewal failed:", error);
//       toast.error(error.response?.data?.error || "Failed to renew contract");
//       setLoading(false);
//     }
//   };

//   // Handle terminate contract
//   const handleTerminateContract = (id) => {
//     setTerminationData({
//       id,
//       terminationReason: "",
//       terminationDate: new Date().toISOString().split("T")[0], // Today
//     });

//     setShowTerminateModal(true);
//   };

//   // Submit contract termination
//   const submitTermination = async () => {
//     try {
//       setLoading(true);

//       const response = await axios.post(
//         `http://localhost:5000/api/payroll-contracts/${terminationData.id}/terminate`,
//         terminationData
//       );

//       if (response.data.success) {
//         toast.success("Contract terminated successfully");
//         fetchContracts();
//         setShowTerminateModal(false);
//       }

//       setLoading(false);
//     } catch (error) {
//       console.error("Contract termination failed:", error);
//       toast.error(
//         error.response?.data?.error || "Failed to terminate contract"
//       );
//       setLoading(false);
//     }
//   };

//   // Render contract status badge
//   const renderStatusBadge = (status) => {
//     let badgeClass = "";

//     switch (status) {
//       case "Active":
//         badgeClass = "status-badge status-badge-active";
//         break;
//       case "Draft":
//         badgeClass = "status-badge status-badge-draft";
//         break;
//       case "Expired":
//         badgeClass = "status-badge status-badge-expired";
//         break;
//       case "Terminated":
//         badgeClass = "status-badge status-badge-terminated";
//         break;
//       default:
//         badgeClass = "status-badge";
//     }

//     return <span className={badgeClass}>{status}</span>;
//   };

//   // Render Create Contract Form
//   if (showCreatePage) {
//     return (
//       <div className="create-page">
//         <div className="create-page-sub-container">
//           <div className="contract-row">
//             <h2 className="contract-heading">Contract</h2>
//             <select
//               className="contract-status"
//               name="contractStatus"
//               value={formData.contractStatus}
//               onChange={handleInputChange}
//               required
//             >
//               <option value="Draft">Draft</option>
//               <option value="Active">Active</option>
//             </select>
//           </div>

//           <hr className="line" />
//           <form className="create-form">
//             <div className="form-row">
//               <div className="form-group">
//                 <label>
//                   Contract <span className="required">*</span>
//                   <FaInfoCircle
//                     title="Contract type information"
//                     className="info-icon"
//                   />
//                 </label>
//                 <input
//                   type="text"
//                   name="contractTitle"
//                   value={formData.contractTitle}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>
//                   Employee <span className="required">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="employee"
//                   value={formData.employee}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label>
//                   Contract Start Date <span className="required">*</span>
//                 </label>
//                 <input
//                   type="date"
//                   name="startDate"
//                   value={formData.startDate}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Contract End Date</label>
//                 <input
//                   type="date"
//                   name="endDate"
//                   value={formData.endDate}
//                   onChange={handleInputChange}
//                 />
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label>
//                   Wage Type <span className="required">*</span>
//                 </label>
//                 <select
//                   name="wageType"
//                   value={formData.wageType}
//                   onChange={handleInputChange}
//                   required
//                 >
//                   <option value="">Select Wage Type</option>
//                   <option value="Daily">Daily</option>
//                   <option value="Monthly">Monthly</option>
//                   <option value="Hourly">Hourly</option>
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label>
//                   Pay Frequency <span className="required">*</span>
//                 </label>
//                 <select
//                   name="payFrequency"
//                   value={formData.payFrequency}
//                   onChange={handleInputChange}
//                   required
//                 >
//                   <option value="">Select Frequency</option>
//                   <option value="Weekly">Weekly</option>
//                   <option value="Monthly">Monthly</option>
//                   <option value="Semi-Monthly">Semi-Monthly</option>
//                 </select>
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label>
//                   Basic Salary <span className="required">*</span>
//                 </label>
//                 <input
//                   type="number"
//                   name="basicSalary"
//                   value={formData.basicSalary}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Filing Status</label>
//                 <input
//                   type="text"
//                   name="filingStatus"
//                   value={formData.filingStatus}
//                   onChange={handleInputChange}
//                 />
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label>Department</label>
//                 <select
//                   name="department"
//                   value={formData.department}
//                   onChange={handleInputChange}
//                 >
//                   <option value="">Select Department</option>
//                   <option value="HR Dept">HR Dept</option>
//                   <option value="Sales Dept">Sales Dept</option>
//                   <option value="S/W Dept">S/W Dept</option>
//                   <option value="Marketing Dept">Marketing Dept</option>
//                   <option value="Finance Dept">Finance Dept</option>
//                   <option value="IT Dept">IT Dept</option>
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label>Job Position</label>
//                 <select
//                   name="position"
//                   value={formData.position}
//                   onChange={handleInputChange}
//                 >
//                   <option value="">Select Position</option>
//                   <option value="HR Manager">HR Manager</option>
//                   <option value="Sales Representative">
//                     Sales Representative
//                   </option>
//                   <option value="Software Developer">Software Developer</option>
//                   <option value="Marketing Specialist">
//                     Marketing Specialist
//                   </option>
//                   <option value="Accountant">Accountant</option>
//                   <option value="IT Engineer">IT Engineer</option>
//                 </select>
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label>Job Role</label>
//                 <select
//                   name="role"
//                   value={formData.role}
//                   onChange={handleInputChange}
//                 >
//                   <option value="">Select Role</option>
//                   <option value="Intern">Intern</option>
//                   <option value="Junior">Junior</option>
//                   <option value="Senior">Senior</option>
//                   <option value="Manager">Manager</option>
//                   <option value="Director">Director</option>
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label>Shift</label>
//                 <select
//                   name="shift"
//                   value={formData.shift}
//                   onChange={handleInputChange}
//                 >
//                   <option value="">Select Shift</option>
//                   <option value="Regular">Regular</option>
//                   <option value="Night Shift">Night Shift</option>
//                   <option value="Morning Shift">Morning Shift</option>
//                   <option value="Second Shift">Second Shift</option>
//                   <option value="Third Shift">Third Shift</option>
//                 </select>
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label>Work Type</label>
//                 <select
//                   name="workType"
//                   value={formData.workType}
//                   onChange={handleInputChange}
//                 >
//                   <option value="">Select Work Type</option>
//                   <option value="Hybrid">Hybrid</option>
//                   <option value="Remote">Remote</option>
//                   <option value="On-site">On-site</option>
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label>
//                   Notice Period <span className="required">*</span>
//                   <FaInfoCircle
//                     className="info-icon"
//                     title="Notice period in total days"
//                   />
//                 </label>
//                 <input
//                   type="number"
//                   name="noticePeriod"
//                   value={formData.noticePeriod}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//             </div>

//             <div className="form-row half-width">
//               <div className="form-group">
//                 <label>
//                   Deduct from Basic Pay
//                   <FaInfoCircle
//                     className="info-icon"
//                     title="Deduct the leave amount from basic pay"
//                   />
//                 </label>

//                 <label className="toggle-switch">
//                   <input
//                     type="checkbox"
//                     name="deductFromBasicPay"
//                     checked={formData.deductFromBasicPay}
//                     onChange={handleInputChange}
//                   />
//                   <span className="slider"></span>
//                 </label>
//               </div>

//               <div className="form-group">
//                 <label>
//                   Calculate Daily Leave Amount
//                   <FaInfoCircle
//                     title="Leave amount will be calculated by dividing basic pay by working days"
//                     className="info-icon"
//                   />
//                 </label>

//                 <label className="toggle-switch">
//                   <input
//                     type="checkbox"
//                     name="calculateDailyLeave"
//                     checked={formData.calculateDailyLeave}
//                     onChange={handleInputChange}
//                   />
//                   <span className="slider"></span>
//                 </label>
//               </div>
//             </div>

//             <div className="form-group">
//               <label>Contract Document</label>
//               <div className="file-upload">
//                 <input
//                   type="file"
//                   name="contractDocument"
//                   onChange={handleInputChange}
//                 />
//                 <div className="file-upload-label">
//                   <FaFileContract />{" "}
//                   {formData.contractDocument
//                     ? formData.contractDocument.name
//                     : "Choose a file"}
//                 </div>
//                 <div className="file-upload-info">
//                   Supported formats: PDF, DOC, DOCX (Max: 5MB)
//                 </div>
//               </div>
//             </div>
//             <hr />

//             <div className="form-group full-width">
//               <label>Note</label>
//               <textarea
//                 name="note"
//                 value={formData.note}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div className="form-row">
//               <button
//                 type="button"
//                 className="contract-save-button"
//                 onClick={handleSaveCreate}
//                 disabled={loading}
//               >
//                 {loading ? "Saving..." : "Save"}
//               </button>
//               <button
//                 type="button"
//                 className="cancel-button"
//                 onClick={() => setShowCreatePage(false)}
//                 disabled={loading}
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     );
//   }

//   // Prepare CSV data for export
//   const csvData =
//     selectedContracts.length > 0
//       ? contracts.filter((contract) => selectedContracts.includes(contract._id))
//       : filteredContracts;

//   // CSV headers
//   const csvHeaders = [
//     { label: "Contract", key: "contract" },
//     { label: "Employee", key: "employee" },
//     { label: "Start Date", key: "startDate" },
//     { label: "End Date", key: "endDate" },
//     { label: "Wage Type", key: "wageType" },
//     { label: "Basic Salary", key: "basicSalary" },
//     { label: "Filing Status", key: "filingStatus" },
//     { label: "Contract Status", key: "contractStatus" },
//     { label: "Department", key: "department" },
//     { label: "Position", key: "position" },
//   ];

//   return (
//     <div className="contract-page">
//       {/* Hidden CSV Link for export */}
//       <CSVLink
//         data={csvData}
//         headers={csvHeaders}
//         filename="contracts_export.csv"
//         className="hidden"
//         ref={csvLink}
//         target="_blank"
//       />

//       {/* Toast notifications */}
//       <ToastContainer position="top-right" autoClose={3000} />

//       {/* Loading overlay */}
//       {loading && (
//         <div className="loading-overlay">
//           <div className="loading-spinner"></div>
//         </div>
//       )}

//       {/* Header */}
//       <div className="header-container">
//         <h2 className="contract-header-title">CONTRACT</h2>
//         <div className="header-right">
//           <div className="search-container">
//             <input
//               type="text"
//               placeholder="Search..."
//               value={searchTerm}
//               onChange={handleSearchChange}
//               className="search-input"
//             />
//             <FaSearch className="search-icon" />
//           </div>

//           <div className="export-buttons">
//             <button
//               className="export-button csv"
//               onClick={() => csvLink.current.link.click()}
//             >
//               <FaFileCsv /> CSV
//             </button>
//             <button
//               className="export-button excel"
//               onClick={() => csvLink.current.link.click()}
//             >
//               <FaFileExcel /> Excel
//             </button>
//             <button className="export-button pdf" onClick={exportToPDF}>
//               <FaFilePdf /> PDF
//             </button>
//             <button className="export-button print" onClick={handlePrint}>
//               <FaPrint /> Print
//             </button>
//             <button className="export-button" onClick={toggleDashboard}>
//               <FaChartBar />{" "}
//               {showDashboard ? "Hide Dashboard" : "Show Dashboard"}
//             </button>
//           </div>

//           <div
//             style={{ position: "relative", display: "inline-block" }}
//             ref={filterRef}
//           >
//             <button
//               className="contract-filter-button"
//               onClick={handleFilterIconClick}
//             >
//               <FaFilter /> Filter
//             </button>

//             {showFilterPopup && (
//               <div className="filter-popup-overlay">
//                 <div className="filter-popup">
//                   <h2>Filter Contracts</h2>
//                   <div className="filter-row">
//                     <label>Contract Status</label>
//                     <select
//                       name="contractStatus"
//                       value={filterData.contractStatus}
//                       onChange={handleFilterChange}
//                     >
//                       <option value="">All</option>
//                       <option value="Draft">Draft</option>
//                       <option value="Active">Active</option>
//                       <option value="Expired">Expired</option>
//                       <option value="Terminated">Terminated</option>
//                     </select>
//                   </div>

//                   <div className="filter-row">
//                     <label>Employee Name</label>
//                     <input
//                       type="text"
//                       name="employeeName"
//                       value={filterData.employeeName}
//                       onChange={handleFilterChange}
//                     />
//                   </div>

//                   <div className="filter-row">
//                     <label>Contract Type</label>
//                     <select
//                       name="contract"
//                       value={filterData.contract}
//                       onChange={handleFilterChange}
//                     >
//                       <option value="">All</option>
//                       <option value="Full-time">Full-time</option>
//                       <option value="Part-time">Part-time</option>
//                       <option value="Internship">Internship</option>
//                       <option value="Temporary">Temporary</option>
//                     </select>
//                   </div>

//                   <div className="filter-row">
//                     <label>Department</label>
//                     <select
//                       name="department"
//                       value={filterData.department}
//                       onChange={handleFilterChange}
//                     >
//                       <option value="">All</option>
//                       <option value="HR Dept">HR Dept</option>
//                       <option value="Sales Dept">Sales Dept</option>
//                       <option value="S/W Dept">S/W Dept</option>
//                       <option value="Marketing Dept">Marketing Dept</option>
//                       <option value="Finance Dept">Finance Dept</option>
//                       <option value="IT Dept">IT Dept</option>
//                     </select>
//                   </div>

//                   <div className="filter-row">
//                     <label>Start Date (From)</label>
//                     <input
//                       type="date"
//                       name="startDate"
//                       value={filterData.startDate}
//                       onChange={handleFilterChange}
//                     />
//                   </div>

//                   <div className="filter-row">
//                     <label>End Date (To)</label>
//                     <input
//                       type="date"
//                       name="endDate"
//                       value={filterData.endDate}
//                       onChange={handleFilterChange}
//                     />
//                   </div>

//                   <div className="filter-row">
//                     <label>Wage Type</label>
//                     <select
//                       name="wageType"
//                       value={filterData.wageType}
//                       onChange={handleFilterChange}
//                     >
//                       <option value="">All</option>
//                       <option value="Monthly">Monthly</option>
//                       <option value="Hourly">Hourly</option>
//                       <option value="Daily">Daily</option>
//                     </select>
//                   </div>

//                   <div className="filter-row">
//                     <label>Salary Range</label>
//                     <div style={{ display: "flex", gap: "10px" }}>
//                       <input
//                         type="number"
//                         name="minSalary"
//                         placeholder="Min"
//                         value={filterData.minSalary}
//                         onChange={handleFilterChange}
//                       />
//                       <input
//                         type="number"
//                         name="maxSalary"
//                         placeholder="Max"
//                         value={filterData.maxSalary}
//                         onChange={handleFilterChange}
//                       />
//                     </div>
//                   </div>

//                   <button onClick={handleApplyFilter}>Apply Filters</button>
//                   <button onClick={handleResetFilter} className="close-button">
//                     Reset Filters
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           <button
//             className="contract-create-button"
//             onClick={handleCreateClick}
//           >
//             <FaPlus style={{ marginRight: "5px" }} /> Create
//           </button>
//         </div>
//       </div>

//       {/* Dashboard */}
//       {showDashboard && (
//         <div
//           className={`dashboard-container dashboard-${dashboardOrientation}`}
//         >
//           {dashboardStats ? (
//             <>
//               {/* Stats cards */}
//               <div className="stats-cards">
//                 <div className="stat-card primary">
//                   <div className="stat-card-title">Total Contracts</div>
//                   <div className="stat-card-value">
//                     {dashboardStats.totalContracts}
//                   </div>
//                   <div className="stat-card-footer">
//                     <FaFileContract /> All contracts
//                   </div>
//                 </div>
//                 <div className="stat-card success">
//                   <div className="stat-card-title">Active Contracts</div>
//                   <div className="stat-card-value">
//                     {dashboardStats.byStatus.active}
//                   </div>
//                   <div className="stat-card-footer">
//                     <FaCheckCircle /> Currently active
//                   </div>
//                 </div>
//                 <div className="stat-card warning">
//                   <div className="stat-card-title">Expiring Soon</div>
//                   <div className="stat-card-value">
//                     {dashboardStats.expiringContracts.count}
//                   </div>
//                   <div className="stat-card-footer">
//                     <FaExclamationTriangle /> Within 30 days
//                   </div>
//                 </div>
//                 <div className="stat-card danger">
//                   <div className="stat-card-title">Expired Contracts</div>
//                   <div className="stat-card-value">
//                     {dashboardStats.byStatus.expired}
//                   </div>
//                   <div className="stat-card-footer">
//                     <FaTimesCircle /> Need renewal
//                   </div>
//                 </div>
//               </div>

//               {/* Expiring contracts alert */}
//               {dashboardStats.expiringContracts.count > 0 && (
//                 <div className="expiring-contracts-alert">
//                   <h3 className="expiring-contracts-header">
//                     <FaExclamationTriangle /> Contracts Expiring Soon
//                   </h3>
//                   <ul className="expiring-contracts-list">
//                     {dashboardStats.expiringContracts.contracts.map(
//                       (contract) => (
//                         <li
//                           key={contract._id}
//                           className="expiring-contract-item"
//                         >
//                           {contract.employee} - {contract.contract} contract
//                           expires on {contract.endDate}
//                           <button
//                             className="renew-button"
//                             onClick={() => handleRenewContract(contract._id)}
//                           >
//                             Renew
//                           </button>
//                         </li>
//                       )
//                     )}
//                   </ul>
//                 </div>
//               )}

//               {/* Department distribution */}
//               <div className="chart-container">
//                 <div className="chart-card">
//                   <h3 className="chart-title">Contracts by Department</h3>
//                   <div className="bar-chart">
//                     {dashboardStats.departmentStats.map((dept, index) => (
//                       <div key={index} className="bar-item">
//                         <div
//                           className="bar"
//                           style={{
//                             height: `${
//                               (dept.count /
//                                 Math.max(
//                                   ...dashboardStats.departmentStats.map(
//                                     (d) => d.count
//                                   )
//                                 )) *
//                               150
//                             }px`,
//                             backgroundColor: `hsl(${index * 40}, 70%, 60%)`,
//                           }}
//                         >
//                           <span className="bar-label">{dept.count}</span>
//                         </div>
//                         <div className="bar-name">{dept._id}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="chart-card">
//                   <h3 className="chart-title">Contract Types</h3>
//                   <div className="progress-chart">
//                     <div className="progress-item">
//                       <div className="progress-header">
//                         <span>Full-time</span>
//                         <span>{dashboardStats.byType.fullTime}</span>
//                       </div>
//                       <div className="progress-bar-container">
//                         <div
//                           className="progress-bar"
//                           style={{
//                             width: `${
//                               (dashboardStats.byType.fullTime /
//                                 dashboardStats.totalContracts) *
//                               100
//                             }%`,
//                             backgroundColor: "#3498db",
//                           }}
//                         ></div>
//                       </div>
//                     </div>
//                     <div className="progress-item">
//                       <div className="progress-header">
//                         <span>Part-time</span>
//                         <span>{dashboardStats.byType.partTime}</span>
//                       </div>
//                       <div className="progress-bar-container">
//                         <div
//                           className="progress-bar"
//                           style={{
//                             width: `${
//                               (dashboardStats.byType.partTime /
//                                 dashboardStats.totalContracts) *
//                               100
//                             }%`,
//                             backgroundColor: "#2ecc71",
//                           }}
//                         ></div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <div className="loading-message">Loading dashboard data...</div>
//           )}
//         </div>
//       )}

//       {/* Bulk actions */}
//       {selectedContracts.length > 0 && (
//         <div className="options-bar">
//           <span>{selectedContracts.length} contracts selected</span>
//           <select
//             className="bulk-action-select"
//             value={bulkAction}
//             onChange={handleBulkActionChange}
//           >
//             <option value="">Bulk Actions</option>
//             <option value="update">Update Selected</option>
//             <option value="export">Export Selected</option>
//             <option value="delete">Delete Selected</option>
//           </select>
//           <button
//             className="bulk-action-button"
//             onClick={handleApplyBulkAction}
//           >
//             Apply
//           </button>
//           <button
//             className="bulk-action-button"
//             onClick={() => {
//               setSelectedContracts([]);
//               setSelectAll(false);
//             }}
//           >
//             Clear Selection
//           </button>
//         </div>
//       )}

//       {/* Table */}
//       <table className="contract-table">
//         <thead>
//           <tr>
//             <th>
//               <input
//                 type="checkbox"
//                 checked={selectAll}
//                 onChange={handleSelectAll}
//               />
//             </th>
//             <th onClick={() => handleSort("contract")}>
//               Contract{" "}
//               {sortConfig.key === "contract" ? (
//                 sortConfig.direction === "asc" ? (
//                   <FaSortUp />
//                 ) : (
//                   <FaSortDown />
//                 )
//               ) : null}
//             </th>
//             <th onClick={() => handleSort("employee")}>
//               Employee{" "}
//               {sortConfig.key === "employee" ? (
//                 sortConfig.direction === "asc" ? (
//                   <FaSortUp />
//                 ) : (
//                   <FaSortDown />
//                 )
//               ) : null}
//             </th>
//             <th onClick={() => handleSort("startDate")}>
//               Start Date{" "}
//               {sortConfig.key === "startDate" ? (
//                 sortConfig.direction === "asc" ? (
//                   <FaSortUp />
//                 ) : (
//                   <FaSortDown />
//                 )
//               ) : null}
//             </th>
//             <th onClick={() => handleSort("endDate")}>
//               End Date{" "}
//               {sortConfig.key === "endDate" ? (
//                 sortConfig.direction === "asc" ? (
//                   <FaSortUp />
//                 ) : (
//                   <FaSortDown />
//                 )
//               ) : null}
//             </th>
//             <th onClick={() => handleSort("wageType")}>
//               Wage Type{" "}
//               {sortConfig.key === "wageType" ? (
//                 sortConfig.direction === "asc" ? (
//                   <FaSortUp />
//                 ) : (
//                   <FaSortDown />
//                 )
//               ) : null}
//             </th>
//             <th onClick={() => handleSort("basicSalary")}>
//               Basic Salary{" "}
//               {sortConfig.key === "basicSalary" ? (
//                 sortConfig.direction === "asc" ? (
//                   <FaSortUp />
//                 ) : (
//                   <FaSortDown />
//                 )
//               ) : null}
//             </th>
//             <th onClick={() => handleSort("contractStatus")}>
//               Status{" "}
//               {sortConfig.key === "contractStatus" ? (
//                 sortConfig.direction === "asc" ? (
//                   <FaSortUp />
//                 ) : (
//                   <FaSortDown />
//                 )
//               ) : null}
//             </th>
//             <th>Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {getCurrentPageItems().length > 0 ? (
//             getCurrentPageItems().map((contract) => (
//               <tr key={contract._id}>
//                 <td>
//                   <input
//                     type="checkbox"
//                     checked={selectedContracts.includes(contract._id)}
//                     onChange={() => handleSelectContract(contract._id)}
//                   />
//                 </td>
//                 <td>
//                   {editingId === contract._id ? (
//                     <input
//                       type="text"
//                       name="contract"
//                       value={editedData.contract || ""}
//                       onChange={handleChange}
//                     />
//                   ) : (
//                     contract.contract
//                   )}
//                 </td>
//                 <td>
//                   {editingId === contract._id ? (
//                     <input
//                       type="text"
//                       name="employee"
//                       value={editedData.employee || ""}
//                       onChange={handleChange}
//                     />
//                   ) : (
//                     contract.employee
//                   )}
//                 </td>
//                 <td>
//                   {editingId === contract._id ? (
//                     <input
//                       type="date"
//                       name="startDate"
//                       value={editedData.startDate || ""}
//                       onChange={handleChange}
//                     />
//                   ) : (
//                     contract.startDate
//                   )}
//                 </td>
//                 <td>
//                   {editingId === contract._id ? (
//                     <input
//                       type="date"
//                       name="endDate"
//                       value={editedData.endDate || ""}
//                       onChange={handleChange}
//                     />
//                   ) : (
//                     contract.endDate || "N/A"
//                   )}
//                 </td>
//                 <td>
//                   {editingId === contract._id ? (
//                     <select
//                       name="wageType"
//                       value={editedData.wageType || ""}
//                       onChange={handleChange}
//                     >
//                       <option value="Daily">Daily</option>
//                       <option value="Monthly">Monthly</option>
//                       <option value="Hourly">Hourly</option>
//                     </select>
//                   ) : (
//                     contract.wageType
//                   )}
//                 </td>
//                 <td>
//                   {editingId === contract._id ? (
//                     <input
//                       type="number"
//                       name="basicSalary"
//                       value={editedData.basicSalary || ""}
//                       onChange={handleChange}
//                     />
//                   ) : (
//                     contract.basicSalary
//                   )}
//                 </td>
//                 <td>
//                   {editingId === contract._id ? (
//                     <select
//                       name="contractStatus"
//                       value={editedData.contractStatus || ""}
//                       onChange={handleChange}
//                     >
//                       <option value="Draft">Draft</option>
//                       <option value="Active">Active</option>
//                       <option value="Expired">Expired</option>
//                       <option value="Terminated">Terminated</option>
//                     </select>
//                   ) : (
//                     renderStatusBadge(contract.contractStatus)
//                   )}
//                 </td>
//                 <td>
//                   {editingId === contract._id ? (
//                     <button
//                       className="contract-table-action-save-button"
//                       onClick={handleSave}
//                       disabled={loading}
//                     >
//                       <FaSave size={18} />
//                     </button>
//                   ) : (
//                     <div className="dropdown">
//                       <button className="dropdown-button">
//                         <FaEllipsisV />
//                       </button>
//                       <div className="dropdown-content">
//                         <button onClick={() => handleEdit(contract)}>
//                           <FaEdit /> Edit
//                         </button>
//                         <button onClick={() => handleDelete(contract._id)}>
//                           <FaTrash /> Delete
//                         </button>
//                         {contract.contractStatus === "Active" && (
//                           <>
//                             <button
//                               onClick={() => handleRenewContract(contract._id)}
//                             >
//                               <FaRedo /> Renew
//                             </button>
//                             <button
//                               onClick={() =>
//                                 handleTerminateContract(contract._id)
//                               }
//                             >
//                               <FaTimesCircle /> Terminate
//                             </button>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="9" className="no-data">
//                 No contracts found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* Pagination */}
//       {filteredContracts.length > 0 && (
//         <div className="pagination">
//           <button
//             className={`pagination-button ${
//               currentPage === 1 ? "disabled" : ""
//             }`}
//             onClick={() => handlePageChange(1)}
//             disabled={currentPage === 1}
//           >
//             First
//           </button>
//           <button
//             className={`pagination-button ${
//               currentPage === 1 ? "disabled" : ""
//             }`}
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//           >
//             Prev
//           </button>

//           {/* Page numbers */}
//           {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//             let pageNum;
//             if (totalPages <= 5) {
//               pageNum = i + 1;
//             } else if (currentPage <= 3) {
//               pageNum = i + 1;
//             } else if (currentPage >= totalPages - 2) {
//               pageNum = totalPages - 4 + i;
//             } else {
//               pageNum = currentPage - 2 + i;
//             }

//             return (
//               <button
//                 key={i}
//                 className={`pagination-button ${
//                   currentPage === pageNum ? "active" : ""
//                 }`}
//                 onClick={() => handlePageChange(pageNum)}
//               >
//                 {pageNum}
//               </button>
//             );
//           })}

//           <button
//             className={`pagination-button ${
//               currentPage === totalPages ? "disabled" : ""
//             }`}
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </button>
//           <button
//             className={`pagination-button ${
//               currentPage === totalPages ? "disabled" : ""
//             }`}
//             onClick={() => handlePageChange(totalPages)}
//             disabled={currentPage === totalPages}
//           >
//             Last
//           </button>

//           <select
//             value={itemsPerPage}
//             onChange={(e) => {
//               setItemsPerPage(Number(e.target.value));
//               setCurrentPage(1);
//             }}
//             className="items-per-page"
//           >
//             <option value={5}>5 per page</option>
//             <option value={10}>10 per page</option>
//             <option value={20}>20 per page</option>
//             <option value={50}>50 per page</option>
//           </select>
//         </div>
//       )}

//       {/* Renew Contract Modal */}
//       {showRenewModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <h3 className="modal-header">Renew Contract</h3>
//             <div className="form-group">
//               <label>New Start Date</label>
//               <input
//                 type="date"
//                 value={renewalData.startDate}
//                 onChange={(e) =>
//                   setRenewalData({ ...renewalData, startDate: e.target.value })
//                 }
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label>New End Date</label>
//               <input
//                 type="date"
//                 value={renewalData.endDate}
//                 onChange={(e) =>
//                   setRenewalData({ ...renewalData, endDate: e.target.value })
//                 }
//               />
//             </div>
//             <div className="form-group">
//               <label>Basic Salary</label>
//               <input
//                 type="number"
//                 value={renewalData.basicSalary}
//                 onChange={(e) =>
//                   setRenewalData({
//                     ...renewalData,
//                     basicSalary: e.target.value,
//                   })
//                 }
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label>Renewal Reason</label>
//               <textarea
//                 value={renewalData.renewalReason}
//                 onChange={(e) =>
//                   setRenewalData({
//                     ...renewalData,
//                     renewalReason: e.target.value,
//                   })
//                 }
//               />
//             </div>
//             <div className="modal-footer">
//               <button
//                 className="modal-close-button"
//                 onClick={() => setShowRenewModal(false)}
//                 disabled={loading}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="modal-save-button"
//                 onClick={submitRenewal}
//                 disabled={loading}
//               >
//                 {loading ? "Processing..." : "Renew Contract"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Terminate Contract Modal */}
//       {showTerminateModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <h3 className="modal-header">Terminate Contract</h3>
//             <div className="form-group">
//               <label>Termination Date</label>
//               <input
//                 type="date"
//                 value={terminationData.terminationDate}
//                 onChange={(e) =>
//                   setTerminationData({
//                     ...terminationData,
//                     terminationDate: e.target.value,
//                   })
//                 }
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label>Termination Reason</label>
//               <textarea
//                 value={terminationData.terminationReason}
//                 onChange={(e) =>
//                   setTerminationData({
//                     ...terminationData,
//                     terminationReason: e.target.value,
//                   })
//                 }
//                 required
//               />
//             </div>
//             <div className="modal-footer">
//               <button
//                 className="modal-close-button"
//                 onClick={() => setShowTerminateModal(false)}
//                 disabled={loading}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="modal-save-button"
//                 onClick={submitTermination}
//                 disabled={loading}
//               >
//                 {loading ? "Processing..." : "Terminate Contract"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Bulk Update Modal */}
//       {showBulkUpdateModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <h3 className="modal-header">Bulk Update Contracts</h3>
//             <p>Update {selectedContracts.length} selected contracts</p>

//             <div className="form-group">
//               <label>Contract Status</label>
//               <select
//                 name="contractStatus"
//                 value={bulkUpdateData.contractStatus || ""}
//                 onChange={handleBulkUpdateChange}
//               >
//                 <option value="">No Change</option>
//                 <option value="Draft">Draft</option>
//                 <option value="Active">Active</option>
//                 <option value="Expired">Expired</option>
//                 <option value="Terminated">Terminated</option>
//               </select>
//             </div>

//             <div className="form-group">
//               <label>Department</label>
//               <select
//                 name="department"
//                 value={bulkUpdateData.department || ""}
//                 onChange={handleBulkUpdateChange}
//               >
//                 <option value="">No Change</option>
//                 <option value="HR Dept">HR Dept</option>
//                 <option value="Sales Dept">Sales Dept</option>
//                 <option value="S/W Dept">S/W Dept</option>
//                 <option value="Marketing Dept">Marketing Dept</option>
//                 <option value="Finance Dept">Finance Dept</option>
//                 <option value="IT Dept">IT Dept</option>
//               </select>
//             </div>

//             <div className="form-group">
//               <label>Wage Type</label>
//               <select
//                 name="wageType"
//                 value={bulkUpdateData.wageType || ""}
//                 onChange={handleBulkUpdateChange}
//               >
//                 <option value="">No Change</option>
//                 <option value="Daily">Daily</option>
//                 <option value="Monthly">Monthly</option>
//                 <option value="Hourly">Hourly</option>
//               </select>
//             </div>

//             <div className="form-group">
//               <label>Note (Append to existing notes)</label>
//               <textarea
//                 name="noteAppend"
//                 value={bulkUpdateData.noteAppend || ""}
//                 onChange={handleBulkUpdateChange}
//                 placeholder="This note will be appended to existing notes"
//               />
//             </div>

//             <div className="modal-footer">
//               <button
//                 className="modal-close-button"
//                 onClick={() => setShowBulkUpdateModal(false)}
//                 disabled={loading}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="modal-save-button"
//                 onClick={handleBulkUpdate}
//                 disabled={loading}
//               >
//                 {loading ? "Processing..." : "Update Contracts"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Contract;

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
  FaUserTie,
  FaMoneyBillWave,
  FaBuilding,
  FaCheckCircle,
  FaTimesCircle,
  FaEllipsisV,
  FaRedo,
  FaPlus,
  FaSearch,
  FaFileContract
} from "react-icons/fa";
import { CSVLink } from "react-csv";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Contract.css";

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
  });
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [selectedContracts, setSelectedContracts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [dashboardOrientation, setDashboardOrientation] = useState('landscape');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [renewalData, setRenewalData] = useState({
    id: null,
    startDate: "",
    endDate: "",
    basicSalary: "",
    renewalReason: ""
  });
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [terminationData, setTerminationData] = useState({
    id: null,
    terminationReason: "",
    terminationDate: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [bulkAction, setBulkAction] = useState("");
  const [showBulkUpdateModal, setShowBulkUpdateModal] = useState(false);
  const [bulkUpdateData, setBulkUpdateData] = useState({});

  const filterRef = useRef(null);
  const csvLink = useRef(null);

  // Fetch contracts on component mount
  useEffect(() => {
    fetchContracts();
  }, []);

  // Handle click outside filter popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          contractStatus: "Active"
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
          contractStatus: "Active"
        }
      ];
      setContracts(defaultData);
      setFilteredContracts(defaultData);
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
            active: contracts.filter(c => c.contractStatus === "Active").length,
            draft: contracts.filter(c => c.contractStatus === "Draft").length,
            expired: contracts.filter(c => c.contractStatus === "Expired").length,
            terminated: contracts.filter(c => c.contractStatus === "Terminated").length
          },
          byType: {
            fullTime: contracts.filter(c => c.contract === "Full-time").length,
            partTime: contracts.filter(c => c.contract === "Part-time").length
          },
          expiringContracts: {
            count: 2,
            contracts: contracts.slice(0, 2)
          },
          departmentStats: [
            { _id: "HR Dept", count: 3 },
            { _id: "IT Dept", count: 5 },
            { _id: "Sales Dept", count: 2 },
            { _id: "Finance Dept", count: 1 }
          ]
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
          active: contracts.filter(c => c.contractStatus === "Active").length,
          draft: contracts.filter(c => c.contractStatus === "Draft").length,
          expired: contracts.filter(c => c.contractStatus === "Expired").length,
          terminated: contracts.filter(c => c.contractStatus === "Terminated").length
        },
        byType: {
          fullTime: contracts.filter(c => c.contract === "Full-time").length,
          partTime: contracts.filter(c => c.contract === "Part-time").length
        },
        expiringContracts: {
          count: 2,
          contracts: contracts.slice(0, 2)
        },
        departmentStats: [
          { _id: "HR Dept", count: 3 },
          { _id: "IT Dept", count: 5 },
          { _id: "Sales Dept", count: 2 },
          { _id: "Finance Dept", count: 1 }
        ]
      });
    }
  };

  // Toggle dashboard view
  const toggleDashboard = () => {
    setShowDashboard(!showDashboard);
    if (!showDashboard) {
      setDashboardOrientation('landscape');
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

  // Handle form submission for creating a new contract
  const handleSaveCreate = async () => {
    try {
      setLoading(true);
      const newContract = {
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
        formDataWithFile.append('document', formData.contractDocument);
        
        // Upload file first (this would be a separate endpoint in a real app)
        // const uploadResponse = await axios.post('http://localhost:5000/api/upload', formDataWithFile);
        // newContract.documentUrl = uploadResponse.data.url;
      }

      const response = await axios.post(
        "http://localhost:5000/api/payroll-contracts",
        newContract
      );
      
      if (response.data.success) {
        toast.success("Contract created successfully");
        setContracts([...contracts, response.data.data]);
        setFilteredContracts([...filteredContracts, response.data.data]);
        setShowCreatePage(false);
      }
      setLoading(false);
    } catch (error) {
      console.error("Contract creation error:", error);
      toast.error(error.response?.data?.error || "Failed to create contract");
      setLoading(false);
    }
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

  // Handle edit button click
  const handleEdit = (contract) => {
    setEditingId(contract._id);
    setEditedData({
      _id: contract._id,
      contract: contract.contract,
      employee: contract.employee,
      startDate: contract.startDate,
      endDate: contract.endDate,
      wageType: contract.wageType,
      basicSalary: contract.basicSalary,
      filingStatus: contract.filingStatus,
      contractStatus: contract.contractStatus
    });
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
          contractStatus: editedData.contractStatus
        }
      );

      if (response.data.success) {
        toast.success("Contract updated successfully");
        const updatedContract = response.data.data;
        setContracts(contracts.map((contract) =>
          contract._id === editedData._id ? updatedContract : contract
        ));
        setFilteredContracts(filteredContracts.map((contract) =>
            contract._id === editedData._id ? updatedContract : contract
          ));
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
        const response = await axios.delete(`http://localhost:5000/api/payroll-contracts/${id}`);
        if (response.data.success) {
          toast.success("Contract deleted successfully");
          setContracts(contracts.filter((contract) => contract._id !== id));
          setFilteredContracts(filteredContracts.filter((contract) => contract._id !== id));
          setSelectedContracts(selectedContracts.filter(contractId => contractId !== id));
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
          (contract.employee && contract.employee.toLowerCase().includes(searchValue)) ||
          (contract.contract && contract.contract.toLowerCase().includes(searchValue)) ||
          (contract.wageType && contract.wageType.toLowerCase().includes(searchValue)) ||
          (contract.filingStatus && contract.filingStatus.toLowerCase().includes(searchValue))
      );
  
      setFilteredContracts(searchResults);
      setCurrentPage(1);
    };
  
    // Handle filter icon click
    const handleFilterIconClick = () => {
      setShowFilterPopup(true);
    };
  
    // Handle filter changes
    const handleFilterChange = (e) => {
      const { name, value } = e.target;
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
      });
      setFilteredContracts(contracts);
      setShowFilterPopup(false);
      setCurrentPage(1);
    };
  
    // Apply filters
    const handleApplyFilter = async () => {
      try {
        setLoading(true);
        
        // Prepare filter query
        const filterQuery = {};
        if (filterData.employeeName) filterQuery.employeeName = filterData.employeeName;
        if (filterData.contractStatus) filterQuery.contractStatus = filterData.contractStatus;
        if (filterData.startDate) filterQuery.startDate = filterData.startDate;
        if (filterData.endDate) filterQuery.endDate = filterData.endDate;
        if (filterData.contract) filterQuery.contract = filterData.contract;
        if (filterData.wageType) filterQuery.wageType = filterData.wageType;
        if (filterData.department) filterQuery.department = filterData.department;
        
        // Try to filter using API
        try {
          const response = await axios.get(
            "http://localhost:5000/api/payroll-contracts/filter",
            { params: filterQuery }
          );
          if (response.data.success) {
            setFilteredContracts(response.data.data);
          }
        } catch (apiError) {
          console.error("API filter failed, using client-side filtering:", apiError);
          
          // Fallback to client-side filtering
          const newFilteredContracts = contracts.filter((contract) => {
            const matchesEmployeeName =
              !filterData.employeeName ||
              (contract.employee && contract.employee.toLowerCase().includes(filterData.employeeName.toLowerCase()));
  
            const matchesContract =
              !filterData.contract ||
              (contract.contract && contract.contract.toLowerCase() === filterData.contract.toLowerCase());
  
            const matchesWageType =
              !filterData.wageType ||
              (contract.wageType && contract.wageType.toLowerCase() === filterData.wageType.toLowerCase());
  
            const matchesContractStatus =
              !filterData.contractStatus ||
              (contract.contractStatus && contract.contractStatus.toLowerCase() === filterData.contractStatus.toLowerCase());
  
            const matchesStartDate =
              !filterData.startDate || 
              (contract.startDate && new Date(contract.startDate) >= new Date(filterData.startDate));
  
            const matchesEndDate =
              !filterData.endDate || 
              (contract.endDate && new Date(contract.endDate) <= new Date(filterData.endDate));
              
            const matchesDepartment =
              !filterData.department ||
              (contract.department && contract.department.toLowerCase() === filterData.department.toLowerCase());
              
            const matchesMinSalary =
              !filterData.minSalary ||
              (contract.basicSalary && contract.basicSalary >= Number(filterData.minSalary));
              
            const matchesMaxSalary =
              !filterData.maxSalary ||
              (contract.basicSalary && contract.basicSalary <= Number(filterData.maxSalary));
  
            return (
              matchesEmployeeName &&
              matchesContract &&
              matchesWageType &&
              matchesContractStatus &&
              matchesStartDate &&
              matchesEndDate &&
              matchesDepartment &&
              matchesMinSalary &&
              matchesMaxSalary
            );
          });
  
          setFilteredContracts(newFilteredContracts);
        }
        
        setShowFilterPopup(false);
        setCurrentPage(1);
        setLoading(false);
      } catch (error) {
        console.error("Filtering error:", error);
        toast.error("Error applying filters");
        setLoading(false);
      }
    };
  
    // Handle contract selection
    const handleSelectContract = (id) => {
      if (selectedContracts.includes(id)) {
        setSelectedContracts(selectedContracts.filter((contractId) => contractId !== id));
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
        setSelectedContracts(currentPageContracts.map(contract => contract._id));
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
        const tableColumn = ["Contract", "Employee", "Start Date", "End Date", "Wage Type", "Basic Salary", "Status"];
        
        // Define table rows
        const tableRows = [];
        
        // Add data to rows
        const contractsToExport = selectedContracts.length > 0 
          ? filteredContracts.filter(contract => selectedContracts.includes(contract._id))
          : filteredContracts;
          
        contractsToExport.forEach(contract => {
          const contractData = [
            contract.contract,
            contract.employee,
            contract.startDate,
            contract.endDate || "N/A",
            contract.wageType,
            contract.basicSalary,
            contract.contractStatus || "Active"
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
            overflow: 'linebreak'
          },
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245]
          }
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
          if (window.confirm(`Are you sure you want to delete ${selectedContracts.length} contracts?`)) {
            Promise.all(selectedContracts.map(id => handleDelete(id)))
              .then(() => {
                toast.success(`${selectedContracts.length} contracts deleted`);
                setSelectedContracts([]);
                setSelectAll(false);
              })
              .catch(error => {
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
        const updatedContracts = contracts.map(contract => {
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
    const csvData = selectedContracts.length > 0
      ? filteredContracts.filter(contract => selectedContracts.includes(contract._id))
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
      { label: "Department", key: "department" }
    ];
  
    // Render create page
    if (showCreatePage) {
      return (
        <div className="create-page">
          <div className="create-page-sub-container">
            <div className="contract-row">
              <h2 className="contract-heading">Contract</h2>
              <select
                className="contract-status"
                name="contractStatus"
                value={formData.contractStatus}
                onChange={handleInputChange}
                required
              >
                <option value="Draft">Draft</option>
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>
  
            <hr className="line" />
            <form className="create-form">
              <div className="form-row">
                <div className="form-group">
                  <label>
                    Contract <span className="required">*</span>
                    <FaInfoCircle
                      title="Contract information"
                      className="info-icon"
                    />
                  </label>
                  <input
                    type="text"
                    name="contractTitle"
                    value={formData.contractTitle}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    Employee <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="employee"
                    value={formData.employee}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
  
              <div className="form-row">
                <div className="form-group">
                  <label>
                    Contract Start Date <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Contract End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
  
              <div className="form-row">
                <div className="form-group">
                  <label>
                    Wage Type <span className="required">*</span>
                  </label>
                  <select
                    name="wageType"
                    value={formData.wageType}
                    onChange={handleInputChange}
                    required
                  >
                                      <option value="">Select Wage Type</option>
                  <option value="Daily">Daily</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Hourly">Hourly</option>
                </select>
              </div>
              <div className="form-group">
                <label>
                  Pay Frequency <span className="required">*</span>
                </label>
                <select
                  name="payFrequency"
                  value={formData.payFrequency}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Frequency</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Semi-Monthly">Semi-Monthly</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  Basic Salary <span className="required">*</span>
                </label>
                <input
                  type="number"
                  name="basicSalary"
                  value={formData.basicSalary}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Filing Status</label>
                <input
                  type="text"
                  name="filingStatus"
                  value={formData.filingStatus}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                >
                  <option value="">Select Department</option>
                  <option value="HR Dept">HR Dept</option>
                  <option value="Sales Dept">Sales Dept</option>
                  <option value="S/W Dept">S/W Dept</option>
                  <option value="Marketing Dept">Marketing Dept</option>
                  <option value="Finance Dept">Finance Dept</option>
                  <option value="IT Dept">IT Dept</option>
                </select>
              </div>
              <div className="form-group">
                <label>Job Position</label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                >
                  <option value="">Select Position</option>
                  <option value="HR Manager">HR Manager</option>
                  <option value="Sales Representative">Sales Representative</option>
                  <option value="Software Developer">Software Developer</option>
                  <option value="Marketing Specialist">Marketing Specialist</option>
                  <option value="Accountant">Accountant</option>
                  <option value="IT Support">IT Support</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Job Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="">Select Role</option>
                  <option value="Intern">Intern</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                  <option value="Manager">Manager</option>
                  <option value="Director">Director</option>
                </select>
              </div>
              <div className="form-group">
                <label>Shift</label>
                <select
                  name="shift"
                  value={formData.shift}
                  onChange={handleInputChange}
                >
                  <option value="">Select Shift</option>
                  <option value="Regular">Regular</option>
                  <option value="Night Shift">Night Shift</option>
                  <option value="Morning Shift">Morning Shift</option>
                  <option value="Second Shift">Second Shift</option>
                  <option value="Third Shift">Third Shift</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Work Type</label>
                <select
                  name="workType"
                  value={formData.workType}
                  onChange={handleInputChange}
                >
                  <option value="">Select Work Type</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>
              <div className="form-group">
                <label>
                  Notice Period <span className="required">*</span>
                  <FaInfoCircle
                    className="info-icon"
                    title="Notice period in total days"
                  />
                </label>
                <input
                  type="number"
                  name="noticePeriod"
                  value={formData.noticePeriod}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row half-width">
              <div className="form-group">
                <label>
                  Deduct from Basic Pay
                  <FaInfoCircle
                    className="info-icon"
                    title="Deduct the leave amount from basic pay"
                  />
                </label>

                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="deductFromBasicPay"
                    checked={formData.deductFromBasicPay}
                    onChange={handleInputChange}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="form-group">
                <label>
                  Calculate Daily Leave Amount
                  <FaInfoCircle
                    title="Leave amount will be calculated by dividing basic pay by working days"
                    className="info-icon"
                  />
                </label>

                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="calculateDailyLeave"
                    checked={formData.calculateDailyLeave}
                    onChange={handleInputChange}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Contract Document</label>
              <input
                type="file"
                name="contractDocument"
                onChange={handleInputChange}
              />
            </div>
            <hr />

            <div className="form-group full-width">
              <label>Note</label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-row">
              <button
                type="button"
                className="contract-save-button"
                onClick={handleSaveCreate}
              >
                Save
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowCreatePage(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
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
      <div className="header-container">
        <h2 className="contract-header-title">CONTRACT</h2>
        <div className="header-right">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <FaSearch className="search-icon" />
          </div>

          <div
            style={{ position: "relative", display: "inline-block" }}
            ref={filterRef}
          >
            <button
              className="contract-filter-button"
              onClick={handleFilterIconClick}
            >
              <FaFilter /> Filter
            </button>

            {showFilterPopup && (
              <div className="filter-popup-overlay">
                <div className="filter-popup">
                  <h2>Filter Contracts</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div className="filter-row">
                      <label>Contract Status</label>
                      <select
                        name="contractStatus"
                        value={filterData.contractStatus}
                        onChange={handleFilterChange}
                      >
                        <option value="">All</option>
                        <option value="Draft">Draft</option>
                        <option value="Active">Active</option>
                        <option value="Expired">Expired</option>
                        <option value="Terminated">Terminated</option>
                      </select>
                    </div>

                    <div className="filter-row">
                      <label>Employee Name</label>
                      <input
                        type="text"
                        name="employeeName"
                        value={filterData.employeeName}
                        onChange={handleFilterChange}
                      />
                    </div>

                    <div className="filter-row">
                      <label>Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        value={filterData.startDate}
                        onChange={handleFilterChange}
                      />
                    </div>

                    <div className="filter-row">
                      <label>End Date</label>
                      <input
                        type="date"
                        name="endDate"
                        value={filterData.endDate}
                        onChange={handleFilterChange}
                      />
                    </div>

                    <div className="filter-row">
                      <label>Contract Type</label>
                      <select
                        name="contract"
                        value={filterData.contract}
                        onChange={handleFilterChange}
                      >
                        <option value="">All</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Temporary">Temporary</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>

                    <div className="filter-row">
                      <label>Wage Type</label>
                      <select
                        name="wageType"
                        value={filterData.wageType}
                        onChange={handleFilterChange}
                      >
                        <option value="">All</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Hourly">Hourly</option>
                        <option value="Daily">Daily</option>
                      </select>
                    </div>

                    <div className="filter-row">
                      <label>Department</label>
                      <select
                        name="department"
                        value={filterData.department}
                        onChange={handleFilterChange}
                      >
                        <option value="">All</option>
                        <option value="HR Dept">HR Dept</option>
                        <option value="Sales Dept">Sales Dept</option>
                        <option value="S/W Dept">S/W Dept</option>
                        <option value="Marketing Dept">Marketing Dept</option>
                        <option value="Finance Dept">Finance Dept</option>
                        <option value="IT Dept">IT Dept</option>
                      </select>
                    </div>

                    <div className="filter-row">
                      <label>Salary Range</label>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <input
                          type="number"
                          name="minSalary"
                          placeholder="Min"
                          value={filterData.minSalary}
                          onChange={handleFilterChange}
                          style={{ width: "50%" }}
                        />
                        <input
                          type="number"
                          name="maxSalary"
                          placeholder="Max"
                          value={filterData.maxSalary}
                          onChange={handleFilterChange}
                          style={{ width: "50%" }}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                    <button onClick={handleApplyFilter}>Apply Filters</button>
                    <button onClick={handleResetFilter} className="close-button">
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            className="contract-create-button"
            onClick={handleCreateClick}
          >
            <FaPlus style={{ marginRight: "5px" }} /> Create
          </button>
        </div>
      </div>

      {/* Export toolbar - NEW SECTION */}
      <div className="export-toolbar">
        <span className="export-toolbar-title">Export & Reports:</span>
        <div className="export-buttons">
          <button className="export-button csv" onClick={handleExportCSV}>
            <FaFileCsv /> CSV
          </button>
          <button className="export-button excel" onClick={handleExportCSV}>
            <FaFileExcel /> Excel
          </button>
          <button className="export-button pdf" onClick={exportToPDF}>
            <FaFilePdf /> PDF
          </button>
          <button className="export-button print" onClick={handlePrint}>
            <FaPrint /> Print
          </button>
          <button className="export-button dashboard" onClick={toggleDashboard}>
            <FaChartBar /> {showDashboard ? "Hide Dashboard" : "Show Dashboard"}
          </button>
        </div>
      </div>

      {/* Dashboard */}
      {showDashboard && dashboardStats && (
        <div className={`dashboard-container dashboard-${dashboardOrientation}`}>
          <div className="stats-cards">
            <div className="stat-card primary">
              <div className="stat-card-title">Total Contracts</div>
              <div className="stat-card-value">{dashboardStats.totalContracts || contracts.length}</div>
              <div className="stat-card-footer">
                <FaFileContract /> All contracts
              </div>
            </div>
            <div className="stat-card success">
              <div className="stat-card-title">Active Contracts</div>
              <div className="stat-card-value">{dashboardStats.byStatus?.active || 0}</div>
              <div className="stat-card-footer">
                <FaCheckCircle /> Currently active
              </div>
            </div>
            <div className="stat-card warning">
              <div className="stat-card-title">Expiring Soon</div>
              <div className="stat-card-value">{dashboardStats.expiringContracts?.count || 0}</div>
              <div className="stat-card-footer">
                <FaCalendarAlt /> Next 30 days
              </div>
            </div>
            <div className="stat-card danger">
              <div className="stat-card-title">Expired Contracts</div>
              <div className="stat-card-value">{dashboardStats.byStatus?.expired || 0}</div>
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
                {dashboardStats.expiringContracts.contracts.map((contract, index) => (
                  <li key={index} className="expiring-contract-item">
                    {contract.employee}'s {contract.contract} contract expires on {new Date(contract.endDate).toLocaleDateString()}
                    <button className="renew-button" onClick={() => {
                      setRenewalData({
                        id: contract._id,
                        startDate: new Date(contract.endDate).toISOString().split('T')[0],
                        endDate: "",
                        basicSalary: contract.basicSalary,
                        renewalReason: ""
                      });
                      setShowRenewModal(true);
                    }}>
                      Renew
                    </button>
                  </li>
                ))}
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
          <button className="bulk-action-button" onClick={handleApplyBulkAction}>
            Apply
          </button>
          <button onClick={() => {
            setSelectedContracts([]);
            setSelectAll(false);
          }}>
            Clear Selection
          </button>
        </div>
      )}

      {/* Table */}
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
              Contract{" "}
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
              Status{" "}
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
            getCurrentPageItems().map((contract) => (
              <tr key={contract._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedContracts.includes(contract._id)}
                    onChange={() => handleSelectContract(contract._id)}
                  />
                </td>
                <td>
                  {editingId === contract._id ? (
                    <input
                      type="text"
                      name="contract"
                      value={editedData.contract || ""}
                      onChange={handleChange}
                    />
                  ) : (
                    contract.contract
                  )}
                </td>
                <td>
                  {editingId === contract._id ? (
                    <input
                      type="text"
                      name="employee"
                      value={editedData.employee || ""}
                      onChange={handleChange}
                    />
                  ) : (
                    contract.employee
                  )}
                </td>
                <td>
                  {editingId === contract._id ? (
                    <input
                      type="date"
                      name="startDate"
                      value={editedData.startDate || ""}
                      onChange={handleChange}
                    />
                  ) : (
                    contract.startDate
                  )}
                </td>
                <td>
                  {editingId === contract._id ? (
                    <input
                      type="date"
                      name="endDate"
                      value={editedData.endDate || ""}
                      onChange={handleChange}
                    />
                  ) : (
                    contract.endDate || "N/A"
                  )}
                </td>
                <td>
                  {editingId === contract._id ? (
                    <select
                      name="wageType"
                      value={editedData.wageType || ""}
                      onChange={handleChange}
                    >
                      <option value="Daily">Daily</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Hourly">Hourly</option>
                    </select>
                  ) : (
                    contract.wageType
                  )}
                </td>
                <td>
                  {editingId === contract._id ? (
                    <input
                      type="number"
                      name="basicSalary"
                      value={editedData.basicSalary || ""}
                      onChange={handleChange}
                    />
                  ) : (
                    contract.basicSalary
                  )}
                </td>
                <td>
                  {editingId === contract._id ? (
                    <input
                      type="text"
                      name="filingStatus"
                      value={editedData.filingStatus || ""}
                      onChange={handleChange}
                    />
                  ) : (
                    contract.filingStatus || "N/A"
                  )}
                </td>
                <td>
                  {editingId === contract._id ? (
                    <select
                      name="contractStatus"
                      value={editedData.contractStatus || "Active"}
                      onChange={handleChange}
                    >
                      <option value="Draft">Draft</option>
                      <option value="Active">Active</option>
                      <option value="Expired">Expired</option>
                      <option value="Terminated">Terminated</option>
                    </select>
                  ) : (
                    <span className={`status-badge status-badge-${(contract.contractStatus || "active").toLowerCase()}`}>
                      {contract.contractStatus || "Active"}
                    </span>
                  )}
                </td>
                <td>
                  {editingId === contract._id ? (
                    <button
                      className="contract-table-action-save-button"
                      onClick={handleSave}
                      title="Save changes"
                    >
                      <FaSave />
                    </button>
                  ) : (
                    <div className="dropdown">
                      <button className="dropdown-button">
                        <FaEllipsisV />
                      </button>
                      <div className="dropdown-content">
                        <button onClick={() => handleEdit(contract)}>
                          <FaEdit /> Edit
                        </button>
                        <button onClick={() => handleDelete(contract._id)}>
                          <FaTrash /> Delete
                        </button>
                        <button onClick={() => {
                          setRenewalData({
                            id: contract._id,
                            startDate: contract.endDate || new Date().toISOString().split('T')[0],
                            endDate: "",
                            basicSalary: contract.basicSalary,
                            renewalReason: ""
                          });
                          setShowRenewModal(true);
                        }}>
                          <FaRedo /> Renew
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="no-data">
                No contracts found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {filteredContracts.length > 0 && (
        <div className="pagination-container">
          <div className="pagination">
            <button
              className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
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
                  className={`pagination-button ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button
              className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
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
                  onChange={(e) => setRenewalData({...renewalData, startDate: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>New End Date</label>
                <input
                  type="date"
                  value={renewalData.endDate}
                  onChange={(e) => setRenewalData({...renewalData, endDate: e.target.value})}
                />
              </div>
            </div>
            <div className="form-group">
              <label>New Basic Salary</label>
              <input
                type="number"
                value={renewalData.basicSalary}
                onChange={(e) => setRenewalData({...renewalData, basicSalary: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Renewal Reason</label>
              <textarea
                value={renewalData.renewalReason}
                onChange={(e) => setRenewalData({...renewalData, renewalReason: e.target.value})}
              />
            </div>
            <div className="modal-footer">
              <button
                className="modal-save-button"
                onClick={() => {
                  // In a real app, you would make an API call to renew the contract
                  // For now, we'll just update it locally
                  const updatedContracts = contracts.map(contract => {
                    if (contract._id === renewalData.id) {
                      return {
                        ...contract,
                        startDate: renewalData.startDate,
                        endDate: renewalData.endDate,
                        basicSalary: Number(renewalData.basicSalary),
                        contractStatus: "Active",
                        note: contract.note ? `${contract.note}\nRenewal: ${renewalData.renewalReason}` : `Renewal: ${renewalData.renewalReason}`
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
                onChange={(e) => setBulkUpdateData({...bulkUpdateData, value: e.target.value})}
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
                onChange={(e) => setBulkUpdateData({...bulkUpdateData, reason: e.target.value})}
                placeholder="Optional reason for this update"
              />
            </div>
            <div className="modal-footer">
              <button
                className="modal-save-button"
                onClick={handleBulkUpdate}
              >
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



                    
  
