// import Resignation from '../models/resignation.js';
// import { sendResignationEmail } from '../services/emailservice.js';

// // export const createResignation = async (req, res) => {
// //   try {
// //     const resignation = new Resignation(req.body);
// //     const savedResignation = await resignation.save();
// //     await sendResignationEmail(req.body.email, req.body);
// //     res.status(201).json(savedResignation);
// //   } catch (error) {
// //     res.status(400).json({ message: error.message });
// //   }
// // };

// export const createResignation = async (req, res) => {
//     try {
//       const resignation = new Resignation(req.body);
//       const savedResignation = await resignation.save();
//       await sendResignationEmail(req.body);
//       res.status(201).json(savedResignation);
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   };
  

// export const getAllResignations = async (req, res) => {
//   try {
//     const resignations = await Resignation.find();
//     res.status(200).json(resignations);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const updateResignation = async (req, res) => {
//   try {
//     const updatedResignation = await Resignation.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     if (req.body.status !== 'Pending') {
//       await sendResignationEmail(updatedResignation.email, updatedResignation);
//     }
//     res.status(200).json(updatedResignation);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const deleteResignation = async (req, res) => {
//   try {
//     await Resignation.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: 'Resignation deleted successfully' });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };
// // Add this new controller function
// export const sendEmail = async (req, res) => {
//   try {
//     await sendResignationEmail(req.body);
//     res.status(200).json({ message: 'Email sent successfully' });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

import Resignation from '../models/resignation.js';
import { sendResignationEmail } from '../services/emailservice.js';

export const createResignation = async (req, res) => {
    try {
      const resignation = new Resignation({
        ...req.body,
        status: 'Requested' // Ensure initial status is always 'Requested'
      });
      const savedResignation = await resignation.save();
      await sendResignationEmail(req.body);
      res.status(201).json(savedResignation);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
};

export const getAllResignations = async (req, res) => {
  try {
    const resignations = await Resignation.find().sort({ createdAt: -1 });
    res.status(200).json(resignations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getResignationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const resignations = await Resignation.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(resignations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateResignation = async (req, res) => {
  try {
    const updatedResignation = await Resignation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    // Send email notification if status has changed
    if (req.body.status && req.body.status !== 'Requested') {
      await sendResignationEmail({
        name: updatedResignation.name,
        email: updatedResignation.email,
        position: updatedResignation.position,
        status: updatedResignation.status,
        description: updatedResignation.description,
        reviewNotes: updatedResignation.reviewNotes
      });
    }
    
    res.status(200).json(updatedResignation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteResignation = async (req, res) => {
  try {
    await Resignation.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Resignation deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const sendEmail = async (req, res) => {
  try {
    await sendResignationEmail(req.body);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
