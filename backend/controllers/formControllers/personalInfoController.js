import PersonalInfo from '../../models/form/personalInfoModel.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    cb(null, extname);
  }
});

export const savePersonalInfo = async (req, res) => {
  try {
    const formData = JSON.parse(req.body.data);
    const newEmployeeId = formData.employeeId || `EMP${Date.now()}`;

    const personalInfo = await PersonalInfo.findOneAndUpdate(
      { employeeId: newEmployeeId },
      { 
        ...formData,
        employeeId: newEmployeeId,
        profileImage: req.file ? `profile/${req.file.filename}` : undefined
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      employeeId: newEmployeeId,
      data: personalInfo
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const getPersonalInfo = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const personalInfo = await PersonalInfo.findOne({ employeeId });

    if (!personalInfo) {
      return res.status(404).json({
        success: false,
        message: 'Personal information not found'
      });
    }

    res.status(200).json({
      success: true,
      data: personalInfo
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
