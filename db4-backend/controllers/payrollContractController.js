import PayrollContract from '../models/payrollContract.js';


/// Create a contract
export const createContract = async (req, res) => {
  try {
    const contract = new PayrollContract(req.body);
    await contract.save();
    res.status(201).json({ success: true, data: contract });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch the routes
export const getContracts = async (req, res) => {
  try {
    const contracts = await PayrollContract.find();
    res.status(200).json({ success: true, data: contracts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// update the routes
export const updateContract = async (req, res) => {
    try {
      const contract = await PayrollContract.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!contract) {
        return res.status(404).json({ success: false, message: 'Contract not found' });
      }
      res.json({ success: true, data: contract });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  

// delete the routes
export const deleteContract = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedContract = await PayrollContract.findByIdAndDelete(id);
      
      if (!deletedContract) {
        return res.status(404).json({ message: 'Contract not found' });
      }
      
      res.status(200).json({ 
        success: true, 
        message: 'Contract deleted successfully' 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  };
  
