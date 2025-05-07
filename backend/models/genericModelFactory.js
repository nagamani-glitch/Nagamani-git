import createCompanyModel from './modelFactory.js';

// Function to create a company-specific model
const createCompanySpecificModel = async (companyCode, modelName, schema) => {
  return await createCompanyModel(companyCode, modelName, schema);
};

// Function to get or create a model for a specific company
const getModelForCompany = async (companyCode, modelName, schema) => {
  return await createCompanySpecificModel(companyCode, modelName, schema);
};

export default getModelForCompany;
