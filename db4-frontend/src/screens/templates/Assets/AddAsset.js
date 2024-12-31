import React, { useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import axios from 'axios';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Asset name is required'),
  category: Yup.string().required('Category is required'),
  status: Yup.string().required('Status is required'),
  currentEmployee: Yup.string().required('Current user is required'),
  previousEmployees: Yup.string()
});

const AddAsset = ({ onClose, refreshAssets, editAsset }) => {
  useEffect(() => {
    // GSAP animation for modal entry
    gsap.from('.modal-container', {
      duration: 0.5,
      y: -50,
      opacity: 0,
      ease: 'power3.out'
    });
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    const assetData = {
      ...values,
      previousEmployees: values.previousEmployees.split(',').map(emp => emp.trim())
    };

    const API_URL= process.env.REACT_APP_API_URL;

    try {
      if (editAsset) {
        await axios.put(`${API_URL}/api/assets/${editAsset._id}`, assetData);
      } else {
        await axios.post(`${API_URL}/api/assets`, assetData);
      }
      refreshAssets();
      onClose();
    } catch (error) {
      console.error("Error:", error);
    }
    setSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={styles.overlay}
    >
      <div style={styles.modalContainer}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={styles.closeButton}
          onClick={onClose}
        >
          ×
        </motion.button>

        <h2 style={styles.title}>{editAsset ? 'Edit Asset' : 'Add Asset'}</h2>

        <Formik
          initialValues={{
            name: editAsset?.name || '',
            category: editAsset?.category || '',
            status: editAsset?.status || '',
            currentEmployee: editAsset?.currentEmployee || '',
            previousEmployees: editAsset?.previousEmployees?.join(', ') || ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form style={styles.form}>
              {['name', 'category', 'status', 'currentEmployee', 'previousEmployees'].map((fieldName) => (
                <div key={fieldName} style={styles.formGroup}>
                  <label style={styles.label}>
                    {fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1')}
                  </label>
                  <Field
                    name={fieldName}
                    style={styles.input}
                    placeholder={`Enter ${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                  />
                  {errors[fieldName] && touched[fieldName] && (
                    <div style={styles.error}>{errors[fieldName]}</div>
                  )}
                </div>
              ))}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                style={styles.submitButton}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? 'Saving...' : 'Save Asset'}
              </motion.button>
            </Form>
          )}
        </Formik>
      </div>
    </motion.div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '2rem',
    width: '90%',
    maxWidth: '500px',
    position: 'relative',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  closeButton: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#666',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '2rem',
    fontSize: '1.8rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontSize: '0.9rem',
    color: '#555',
    fontWeight: '500'
  },
  input: {
    padding: '0.8rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease',
    ':focus': {
      borderColor: '#007bff',
      outline: 'none'
    }
  },
  submitButton: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '1rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem',
    transition: 'background-color 0.3s ease'
  },
  error: {
    color: '#dc3545',
    fontSize: '0.8rem',
    marginTop: '0.2rem'
  }
};

export default AddAsset;
