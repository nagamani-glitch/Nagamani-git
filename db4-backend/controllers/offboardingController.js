import Offboarding from '../models/Offboarding.js';

export const getAllOffboardings = async (req, res) => {
  try {
    const offboardings = await Offboarding.find();
    res.status(200).json(offboardings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOffboarding = async (req, res) => {
  try {
    const newOffboarding = new Offboarding(req.body);
    const savedOffboarding = await newOffboarding.save();
    res.status(201).json(savedOffboarding);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateOffboarding = async (req, res) => {
  try {
    const updatedOffboarding = await Offboarding.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedOffboarding);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteOffboarding = async (req, res) => {
  try {
    await Offboarding.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Offboarding deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getOffboardingsByStage = async (req, res) => {
  try {
    const offboardings = await Offboarding.find({ stage: req.params.stage });
    res.status(200).json(offboardings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
