import Contract from '../models/payrollContractModel.js';;

export const getContracts = async (req, res) => {
  try {
    const contracts = await Contract.find();
    res.status(200).json({ success: true, data: contracts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createContract = async (req, res) => {
  try {
    const newContract = new Contract(req.body);
    const savedContract = await newContract.save();
    res.status(201).json({ success: true, data: savedContract });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const updateContract = async (req, res) => {
  try {
    const updatedContract = await Contract.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedContract });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const deleteContract = async (req, res) => {
  try {
    await Contract.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Contract deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const filterContracts = async (req, res) => {
  try {
    const { contractStatus, employeeName, startDate, endDate, wageType } = req.query;
    const filter = {};

    if (contractStatus) filter.contractStatus = contractStatus;
    if (employeeName) filter.employee = { $regex: employeeName, $options: 'i' };
    if (startDate) filter.startDate = { $gte: startDate };
    if (endDate) filter.endDate = { $lte: endDate };
    if (wageType) filter.wageType = wageType;

    const contracts = await Contract.find(filter);
    res.status(200).json({ success: true, data: contracts });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
