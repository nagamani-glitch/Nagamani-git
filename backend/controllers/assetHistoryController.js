import AssetHistory, { AssetHistorySchema } from '../models/AssetHistory.js';
import getModelForCompany from '../models/genericModelFactory.js';

// Get all assets
export const getAllAssets = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Fetching assets for company: ${companyCode}`);
    
    // Get company-specific AssetHistory model
    const CompanyAssetHistory = await getModelForCompany(companyCode, 'AssetHistory', AssetHistorySchema);
    
    const assets = await CompanyAssetHistory.find();
    res.json(assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({ 
      message: error.message,
      error: 'Error fetching assets'
    });
  }
};

// Create a new asset
export const createAsset = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Creating asset for company: ${companyCode}`);
    
    // Get company-specific AssetHistory model
    const CompanyAssetHistory = await getModelForCompany(companyCode, 'AssetHistory', AssetHistorySchema);
    
    // Extract asset data from request body
    const { 
      name, 
      category, 
      allottedDate, 
      returnDate, 
      status, 
      batch, 
      currentEmployee,
      previousEmployees 
    } = req.body;
    
    // Create new asset
    const asset = new CompanyAssetHistory({ 
      name, 
      category, 
      allottedDate, 
      returnDate, 
      status, 
      batch, 
      currentEmployee,
      previousEmployees 
    });
    
    // Save the asset
    const newAsset = await asset.save();
    res.status(201).json(newAsset);
  } catch (error) {
    console.error('Error creating asset:', error);
    res.status(400).json({ 
      message: error.message,
      error: 'Error creating asset'
    });
  }
};

// Update an asset
export const updateAsset = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Updating asset ${req.params.id} for company: ${companyCode}`);
    
    // Get company-specific AssetHistory model
    const CompanyAssetHistory = await getModelForCompany(companyCode, 'AssetHistory', AssetHistorySchema);
    
    // Extract asset data from request body
    const { 
      name,
      category,
      status, 
      returnDate, 
      allottedDate, 
      currentEmployee, 
      previousEmployees,
      batch 
    } = req.body;
    
    // Update the asset
    const asset = await CompanyAssetHistory.findByIdAndUpdate(
      req.params.id,
      { 
        name,
        category,
        status, 
        returnDate, 
        allottedDate, 
        currentEmployee, 
        previousEmployees,
        batch 
      },
      { new: true, runValidators: true }
    );

    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    
    res.json(asset);
  } catch (error) {
    console.error('Error updating asset:', error);
    res.status(400).json({ 
      message: error.message,
      error: 'Error updating asset'
    });
  }
};

// Delete an asset
export const deleteAsset = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Deleting asset ${req.params.id} for company: ${companyCode}`);
    
    // Get company-specific AssetHistory model
    const CompanyAssetHistory = await getModelForCompany(companyCode, 'AssetHistory', AssetHistorySchema);
    
    // Delete the asset
    const asset = await CompanyAssetHistory.findByIdAndDelete(req.params.id);
    
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    
    res.json({ message: 'Asset deleted' });
  } catch (error) {
    console.error('Error deleting asset:', error);
    res.status(500).json({ 
      message: error.message,
      error: 'Error deleting asset'
    });
  }
};

// Get summary data for the dashboard
export const getSummaryData = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Fetching asset summary data for company: ${companyCode}`);
    
    // Get company-specific AssetHistory model
    const CompanyAssetHistory = await getModelForCompany(companyCode, 'AssetHistory', AssetHistorySchema);
    
    // Get total count of assets
    const totalAssets = await CompanyAssetHistory.countDocuments();

    // Get count of assets currently in use
    const assetsInUse = await CompanyAssetHistory.countDocuments({ status: 'In Use' });

    // Group by category and get the count of assets in each category
    const categoryData = await CompanyAssetHistory.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    // Group by status and get the count of assets in each status
    const statusData = await CompanyAssetHistory.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Send the data as a response
    res.json({
      totalAssets,
      assetsInUse,
      categoryData,
      statusData,
    });
  } catch (error) {
    console.error('Error fetching summary data:', error);
    res.status(500).json({ 
      message: error.message,
      error: 'Error fetching summary data'
    });
  }
};
