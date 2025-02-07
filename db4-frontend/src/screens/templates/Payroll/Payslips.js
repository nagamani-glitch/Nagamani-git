import React, { useState, useEffect, useMemo } from 'react';
import { FaTrash, FaEnvelope, FaFilter, FaPlus, FaDownload, FaTimes, FaEdit } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import './Payslips.css';
import "react-datepicker/dist/react-datepicker.css";

const validationSchema = Yup.object().shape({
    employee: Yup.string().required('Employee name is required'),
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date()
        .required('End date is required')
        .min(Yup.ref('startDate'), 'End date must be after start date'),
    grossPay: Yup.number()
        .positive('Must be positive')
        .required('Gross pay is required'),
    deduction: Yup.number()
        .min(0, 'Must be non-negative')
        .required('Deduction is required')
});
const CreatePayslipModal = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  return (
      <div className="modal">
          <div className="payslip-modal-content">
              <h2 className='payslip-create'>Create New Payslip</h2>
              <Formik
                  initialValues={{
                      employee: '',
                      startDate: new Date(),
                      endDate: new Date(),
                      grossPay: '',
                      deduction: '0'
                  }}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
              >
                  {({ values, setFieldValue, errors, touched }) => (
                      <Form>
                          <div className="form-group">
                              <label>Employee Name</label>
                              <Field name="employee" type="text" />
                              {errors.employee && touched.employee && 
                                  <div className="error">{errors.employee}</div>}
                          </div>

                          <div className="form-group">
                              <label>Start Date</label>
                              <DatePicker
                                  selected={values.startDate}
                                  onChange={date => setFieldValue('startDate', date)}
                                  dateFormat="dd/MM/yyyy"
                              />
                          </div>

                          <div className="form-group">
                              <label>End Date</label>
                              <DatePicker
                                  selected={values.endDate}
                                  onChange={date => setFieldValue('endDate', date)}
                                  minDate={values.startDate}
                                  dateFormat="dd/MM/yyyy"
                              />
                          </div>

                          <div className="form-group">
                              <label>Gross Pay</label>
                              <Field name="grossPay" type="number" />
                              {errors.grossPay && touched.grossPay && 
                                  <div className="error">{errors.grossPay}</div>}
                          </div>

                          <div className="form-group">
                              <label>Deduction</label>
                              <Field name="deduction" type="number" />
                              {errors.deduction && touched.deduction && 
                                  <div className="error">{errors.deduction}</div>}
                          </div>

                          <div className="modal-actions">
                              <button type="submit" className="btn-primary">Create</button>
                              <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                          </div>
                      </Form>
                  )}
              </Formik>
          </div>
      </div>
  );
};

const EditPayslipModal = ({ isOpen, onClose, onSubmit, payslip }) => {
  if (!isOpen) return null;

  return (
      <div className="modal">
          <div className="edit-payslip-modal-content">
              <h2 className='edit-payslip-heading'>Edit Payslip</h2>
              <Formik
                  initialValues={{
                      employee: payslip.employee,
                      startDate: new Date(payslip.startDate),
                      endDate: new Date(payslip.endDate),
                      grossPay: payslip.grossPay,
                      deduction: payslip.deduction
                  }}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
              >
                  {({ values, setFieldValue, errors, touched }) => (
                      <Form>
                          <div className="form-group">
                              <label>Employee Name</label>
                              <Field name="employee" type="text" />
                              {errors.employee && touched.employee && 
                                  <div className="error">{errors.employee}</div>}
                          </div>

                          <div className="form-group">
                              <label>Start Date</label>
                              <DatePicker
                                  selected={values.startDate}
                                  onChange={date => setFieldValue('startDate', date)}
                                  dateFormat="dd/MM/yyyy"
                              />
                          </div>

                          <div className="form-group">
                              <label>End Date</label>
                              <DatePicker
                                  selected={values.endDate}
                                  onChange={date => setFieldValue('endDate', date)}
                                  minDate={values.startDate}
                                  dateFormat="dd/MM/yyyy"
                              />
                          </div>

                          <div className="form-group">
                              <label>Gross Pay</label>
                              <Field name="grossPay" type="number" />
                              {errors.grossPay && touched.grossPay && 
                                  <div className="error">{errors.grossPay}</div>}
                          </div>

                          <div className="form-group">
                              <label>Deduction</label>
                              <Field name="deduction" type="number" />
                              {errors.deduction && touched.deduction && 
                                  <div className="error">{errors.deduction}</div>}
                          </div>

                          <div className="modal-actions">
                              <button type="submit" className="btn-primary">Update</button>
                              <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                          </div>
                      </Form>
                  )}
              </Formik>
          </div>
      </div>
  );
};
const Payslips = () => {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPayslip, setEditingPayslip] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPayslips = async () => {
      setLoading(true);
      try {
          const response = await axios.get('/api/payslips');
          setPayslips(response.data);
      } catch (error) {
          toast.error('Failed to fetch payslips');
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchPayslips();
  }, []);

  const handleCreatePayslip = async (values, { resetForm }) => {
      try {
          const payslipData = {
              ...values,
              netPay: parseFloat(values.grossPay) - parseFloat(values.deduction)
          };
          const response = await axios.post('/api/payslips', payslipData);
          setPayslips(prev => [...prev, response.data]);
          toast.success('Payslip created successfully');
          setIsCreateModalOpen(false);
          resetForm();
      } catch (error) {
          toast.error('Failed to create payslip');
      }
  };

  const handleEditPayslip = async (values) => {
      try {
          const response = await axios.put(`/api/payslips/${editingPayslip._id}`, {
              ...values,
              netPay: parseFloat(values.grossPay) - parseFloat(values.deduction)
          });
          
          setPayslips(prev => prev.map(p => 
              p._id === editingPayslip._id ? response.data : p
          ));
          
          toast.success('Payslip updated successfully');
          setIsEditModalOpen(false);
          setEditingPayslip(null);
      } catch (error) {
          toast.error('Failed to update payslip');
      }
  };

  const handleDeletePayslip = async (id) => {
      if (window.confirm('Are you sure you want to delete this payslip?')) {
          try {
              await axios.delete(`/api/payslips/${id}`);
              setPayslips(prev => prev.filter(p => p._id !== id));
              toast.success('Payslip deleted successfully');
          } catch (error) {
              toast.error('Failed to delete payslip');
          }
      }
  };

  const handleBulkDelete = async () => {
      if (selectedRows.length === 0) return;
      
      if (window.confirm('Are you sure you want to delete selected payslips?')) {
          try {
              await axios.post('/api/payslips/bulk-delete', { ids: selectedRows });
              setPayslips(prev => prev.filter(p => !selectedRows.includes(p._id)));
              setSelectedRows([]);
              toast.success('Selected payslips deleted successfully');
          } catch (error) {
              toast.error('Failed to delete payslips');
          }
      }
  };

  const handleExport = async () => {
      try {
          const response = await axios.post('/api/payslips/export', 
              { ids: selectedRows },
              { responseType: 'blob' }
          );
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'payslips.pdf');
          document.body.appendChild(link);
          link.click();
          link.remove();
      } catch (error) {
          toast.error('Failed to export payslips');
      }
  };

  const filteredPayslips = useMemo(() => {
      return payslips.filter(payslip => 
          payslip.employee.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [payslips, searchQuery]);
  return (

    <div className="payslips-container">
        <div className="header">

            <h1>Payslips Management</h1>
            <div className="actions">
                <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="search-input"
                />

                
                <button onClick={() => setIsCreateModalOpen(true)} className="btn-primary create-payslip">
                    New Payslip
                </button>
                {selectedRows.length > 0 && (
                    <>
                        <button onClick={handleExport} className="btn-secondary">
                            <FaDownload /> Export Selected
                        </button>
                        <button onClick={handleBulkDelete} className="btn-danger">
                            <FaTrash /> Delete Selected
                        </button>
                    </>
                )}
            </div>
        </div>

        
        {loading ? (
            <div className="loading">Loading...</div>
        ) : (
            <table className="payslips-table">
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                checked={selectedRows.length === filteredPayslips.length}
                                onChange={() => {
                                    if (selectedRows.length === filteredPayslips.length) {
                                        setSelectedRows([]);
                                    } else {
                                        setSelectedRows(filteredPayslips.map(p => p._id));
                                    }
                                }}
                            />
                        </th>
                        <th>Employee</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Gross Pay</th>
                        <th>Deduction</th>
                        <th>Net Pay</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPayslips.map(payslip => (
                        <tr key={payslip._id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedRows.includes(payslip._id)}
                                    onChange={() => {
                                        setSelectedRows(prev =>
                                            prev.includes(payslip._id)
                                                ? prev.filter(id => id !== payslip._id)
                                                : [...prev, payslip._id]
                                        );
                                    }}
                                />
                            </td>
                            <td>{payslip.employee}</td>
                            <td>{format(new Date(payslip.startDate), 'dd/MM/yyyy')}</td>
                            <td>{format(new Date(payslip.endDate), 'dd/MM/yyyy')}</td>
                            <td>{payslip.grossPay}</td>
                            <td>{payslip.deduction}</td>
                            <td>{payslip.netPay}</td>
                            <td>
                                <button 
                                    onClick={() => {
                                        setEditingPayslip(payslip);
                                        setIsEditModalOpen(true);
                                    }}
                                    className="btn-icon"
                                >
                                    <FaEdit />
                                </button>
                                <button 
                                    onClick={() => handleDeletePayslip(payslip._id)}
                                    className="btn-icon"
                                >
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}

        <CreatePayslipModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreatePayslip}
        />

        {editingPayslip && (
            <EditPayslipModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingPayslip(null);
                }}
                onSubmit={handleEditPayslip}
                payslip={editingPayslip}
            />
        )}
    </div>
);
};

export default Payslips;
