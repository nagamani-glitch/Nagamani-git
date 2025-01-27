import React from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  serviceHistory: Yup.array().of(
    Yup.object().shape({
      transactionType: Yup.string().required('Required'),
      office: Yup.string().required('Required'),
      post: Yup.string().required('Required'),
      orderNumber: Yup.string().required('Required'),
      orderDate: Yup.date().required('Required'),
      incrementDate: Yup.date().required('Required'),
      payScale: Yup.string().required('Required'),
      otherDept: Yup.string(),
      areaType: Yup.string()
    })
  )
});

const ServiceHistoryForm = ({ nextStep, prevStep, handleFormDataChange, savedServiceHistory }) => {
  const initialValues = {
    serviceHistory: Array.isArray(savedServiceHistory) ? savedServiceHistory : [{
      transactionType: '',
      office: '',
      post: '',
      orderNumber: '',
      orderDate: '',
      incrementDate: '',
      payScale: '',
      otherDept: '',
      areaType: ''
    }]
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: '20px' }}
    >
      <h2 style={{ marginBottom: '20px', textAlign: 'center', color: '#1976D2' }}>
        FORM-6: EMPLOYEE SERVICE HISTORY
      </h2>
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          handleFormDataChange("serviceHistory", values.serviceHistory);
          nextStep();
        }}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form>
            <FieldArray name="serviceHistory">
              {({ push, remove }) => (
                <TableContainer component={Paper} elevation={3}>
                  <Table>
                    <TableHead style={{ backgroundColor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell>Transaction Type</TableCell>
                        <TableCell>To Office</TableCell>
                        <TableCell>To Which Post</TableCell>
                        <TableCell>Order Number</TableCell>
                        <TableCell>Order Date</TableCell>
                        <TableCell>Date of Increment</TableCell>
                        <TableCell>Pay Scale</TableCell>
                        <TableCell>Other Department</TableCell>
                        <TableCell>Area Type</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                    {Array.isArray(values.serviceHistory) && values.serviceHistory.map((_, index) => (
                        <TableRow key={index}>
                          {/* Fields */}
                          <TableCell>
                            <TextField
                              variant="outlined"
                              size="small"
                              name={`serviceHistory.${index}.transactionType`}
                              value={values.serviceHistory[index].transactionType}
                              onChange={(e) => setFieldValue(`serviceHistory.${index}.transactionType`, e.target.value)}
                              error={touched?.serviceHistory?.[index]?.transactionType && errors?.serviceHistory?.[index]?.transactionType}
                              helperText={touched?.serviceHistory?.[index]?.transactionType && errors?.serviceHistory?.[index]?.transactionType}
                            />
                          </TableCell>
                          <TableCell>
  <TextField
    variant="outlined"
    size="small"
    name={`serviceHistory.${index}.office`}
    value={values.serviceHistory[index].office}
    onChange={(e) => setFieldValue(`serviceHistory.${index}.office`, e.target.value)}
    error={touched?.serviceHistory?.[index]?.office && errors?.serviceHistory?.[index]?.office}
    helperText={touched?.serviceHistory?.[index]?.office && errors?.serviceHistory?.[index]?.office}
  />
</TableCell>
<TableCell>
  <TextField
    variant="outlined"
    size="small"
    name={`serviceHistory.${index}.post`}
    value={values.serviceHistory[index].post}
    onChange={(e) => setFieldValue(`serviceHistory.${index}.post`, e.target.value)}
    error={touched?.serviceHistory?.[index]?.post && errors?.serviceHistory?.[index]?.post}
    helperText={touched?.serviceHistory?.[index]?.post && errors?.serviceHistory?.[index]?.post}
  />
</TableCell>
<TableCell>
  <TextField
    variant="outlined"
    size="small"
    name={`serviceHistory.${index}.orderNumber`}
    value={values.serviceHistory[index].orderNumber}
    onChange={(e) => setFieldValue(`serviceHistory.${index}.orderNumber`, e.target.value)}
    error={touched?.serviceHistory?.[index]?.orderNumber && errors?.serviceHistory?.[index]?.orderNumber}
    helperText={touched?.serviceHistory?.[index]?.orderNumber && errors?.serviceHistory?.[index]?.orderNumber}
  />
</TableCell>
<TableCell>
  <TextField
    variant="outlined"
    size="small"
    type="date"
    name={`serviceHistory.${index}.orderDate`}
    value={values.serviceHistory[index].orderDate}
    onChange={(e) => setFieldValue(`serviceHistory.${index}.orderDate`, e.target.value)}
    error={touched?.serviceHistory?.[index]?.orderDate && errors?.serviceHistory?.[index]?.orderDate}
    helperText={touched?.serviceHistory?.[index]?.orderDate && errors?.serviceHistory?.[index]?.orderDate}
  />
</TableCell>
<TableCell>
  <TextField
    variant="outlined"
    size="small"
    type="date"
    name={`serviceHistory.${index}.incrementDate`}
    value={values.serviceHistory[index].incrementDate}
    onChange={(e) => setFieldValue(`serviceHistory.${index}.incrementDate`, e.target.value)}
    error={touched?.serviceHistory?.[index]?.incrementDate && errors?.serviceHistory?.[index]?.incrementDate}
    helperText={touched?.serviceHistory?.[index]?.incrementDate && errors?.serviceHistory?.[index]?.incrementDate}
  />
</TableCell>
<TableCell>
  <TextField
    variant="outlined"
    size="small"
    name={`serviceHistory.${index}.payScale`}
    value={values.serviceHistory[index].payScale}
    onChange={(e) => setFieldValue(`serviceHistory.${index}.payScale`, e.target.value)}
    error={touched?.serviceHistory?.[index]?.payScale && errors?.serviceHistory?.[index]?.payScale}
    helperText={touched?.serviceHistory?.[index]?.payScale && errors?.serviceHistory?.[index]?.payScale}
  />
</TableCell>
<TableCell>
  <TextField
    variant="outlined"
    size="small"
    name={`serviceHistory.${index}.otherDept`}
    value={values.serviceHistory[index].otherDept}
    onChange={(e) => setFieldValue(`serviceHistory.${index}.otherDept`, e.target.value)}
    error={touched?.serviceHistory?.[index]?.otherDept && errors?.serviceHistory?.[index]?.otherDept}
    helperText={touched?.serviceHistory?.[index]?.otherDept && errors?.serviceHistory?.[index]?.otherDept}
  />
</TableCell>
<TableCell>
  <TextField
    variant="outlined"
    size="small"
    name={`serviceHistory.${index}.areaType`}
    value={values.serviceHistory[index].areaType}
    onChange={(e) => setFieldValue(`serviceHistory.${index}.areaType`, e.target.value)}
    error={touched?.serviceHistory?.[index]?.areaType && errors?.serviceHistory?.[index]?.areaType}
    helperText={touched?.serviceHistory?.[index]?.areaType && errors?.serviceHistory?.[index]?.areaType}
  />
</TableCell>

                          <TableCell>
                            <Button 
                              variant="contained" 
                              color="error" 
                              size="small" 
                              onClick={() => remove(index)}
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => push({
                      transactionType: '',
                      office: '',
                      post: '',
                      orderNumber: '',
                      orderDate: '',
                      incrementDate: '',
                      payScale: '',
                      otherDept: '',
                      areaType: ''
                    })}
                    style={{ margin: '20px' }}
                  >
                    Add Service Entry
                  </Button>
                </TableContainer>
              )}
            </FieldArray>
            
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="outlined" onClick={prevStep}>Previous</Button>
              <Button variant="contained" color="primary" type="submit">Next</Button>
            </div>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
};

export default ServiceHistoryForm;
