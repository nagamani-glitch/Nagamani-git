import DisciplinaryAction from '../models/DisciplinaryAction.js';
import fs from 'fs/promises';
import path from 'path';

export const getAllActions = async (req, res) => {
  try {
    const { searchQuery, status } = req.query;
    const filter = {};

    if (searchQuery) {
      filter.$or = [
        { employee: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } }
      ];
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

    const actions = await DisciplinaryAction.find(filter)
      .sort({ createdAt: -1 });
    res.status(200).json(actions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAction = async (req, res) => {
  try {
    const actionData = req.body;
    
    if (req.file) {
      actionData.attachments = {
        filename: req.file.filename,
        path: req.file.path,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype
      };
    }

    const newAction = new DisciplinaryAction(actionData);
    const savedAction = await newAction.save();
    res.status(201).json(savedAction);
  } catch (error) {
    if (req.file) {
      await fs.unlink(req.file.path);
    }
    res.status(400).json({ message: error.message });
  }
};

export const updateAction = async (req, res) => {
  try {
    const { id } = req.params;
    const actionData = req.body;
    
    const existingAction = await DisciplinaryAction.findById(id);
    if (!existingAction) {
      return res.status(404).json({ message: 'Action not found' });
    }

    if (req.file) {
      // Delete old file if exists
      if (existingAction.attachments?.path) {
        await fs.unlink(existingAction.attachments.path);
      }

      actionData.attachments = {
        filename: req.file.filename,
        path: req.file.path,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype
      };
    }

    const updatedAction = await DisciplinaryAction.findByIdAndUpdate(
      id,
      actionData,
      { new: true }
    );
    res.status(200).json(updatedAction);
  } catch (error) {
    if (req.file) {
      await fs.unlink(req.file.path);
    }
    res.status(400).json({ message: error.message });
  }
};

export const deleteAction = async (req, res) => {
  try {
    const { id } = req.params;
    const action = await DisciplinaryAction.findById(id);
    
    if (!action) {
      return res.status(404).json({ message: 'Action not found' });
    }

    // Delete associated file if exists
    if (action.attachments?.path) {
      await fs.unlink(action.attachments.path);
    }

    await DisciplinaryAction.findByIdAndDelete(id);
    res.status(200).json({ message: 'Action deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const downloadFile = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join('uploads/disciplinary-actions', filename);
    
    // Check if file exists
    await fs.access(filePath);
    
    // Get file details from database
    const action = await DisciplinaryAction.findOne({ 'attachments.filename': filename });
    if (!action) {
      return res.status(404).json({ message: 'File not found in database' });
    }

    res.download(filePath, action.attachments.originalName);
  } catch (error) {
    res.status(404).json({ message: 'File not found' });
  }
};
