// import Template from '../models/surveyModel.js';

// // Fetch all survey templates
// export const getAllTemplates = async (req, res) => {
//   try {
//     const templates = await Template.find();
//     res.status(200).json(templates);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching templates', error });
//   }
// };

// // Add a new template
//  export const addTemplate = async (req, res) => {
//   const { name, questions } = req.body;
//   try {
//     const newTemplate = new Template({ name, questions });
//     await newTemplate.save();
//     res.status(201).json(newTemplate);
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding template', error });
//   }
// };

// // Edit a template by ID
// export const updateTemplate = async (req, res) => {
//   const { id } = req.params;
//   const { name, questions } = req.body;
//   try {
//     const updatedTemplate = await Template.findByIdAndUpdate(
//       id,
//       { name, questions },
//       { new: true }
//     );
//     if (!updatedTemplate) {
//       return res.status(404).json({ message: 'Template not found' });
//     }
//     res.status(200).json(updatedTemplate);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating template', error });
//   }
// };

// // Delete a question from a template by template ID and question ID
// export const deleteQuestion = async (req, res) => {
//   const { templateId, questionId } = req.params;
//   try {
//     const template = await Template.findById(templateId);
//     if (!template) {
//       return res.status(404).json({ message: 'Template not found' });
//     }

//     template.questions = template.questions.filter(
//       (question) => question._id.toString() !== questionId
//     );
//     await template.save();
//     res.status(200).json({ message: 'Question deleted successfully', template });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting question', error });
//   }
// };

// // Delete an entire template by ID
// export const deleteTemplate = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const deletedTemplate = await Template.findByIdAndDelete(id);
//     if (!deletedTemplate) {
//       return res.status(404).json({ message: 'Template not found' });
//     }
//     res.status(200).json({ message: 'Template deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting template', error });
//   }
// };

import Template from '../models/surveyModel.js';

// Fetch all survey templates
export const getAllTemplates = async (req, res) => {
  try {
    const templates = await Template.find();
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching templates', error });
  }
};

// Add a new template
// export const addTemplate = async (req, res) => {
//   const { name, questions } = req.body;
//   try {
//     const newTemplate = new Template({ name, questions });
//     await newTemplate.save();
//     res.status(201).json(newTemplate);
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding template', error });
//   }
// };
// Add a new template
export const addTemplate = async (req, res) => {
  const { name, questions } = req.body;
  try {
    // Make sure each question has all necessary fields
    const processedQuestions = questions.map(q => ({
      avatar: q.avatar,
      question: q.question,
      type: q.type,
      employeeId: q.employeeId,
      employeeName: q.employeeName,
      employeeDepartment: q.employeeDepartment,
      employeeDesignation: q.employeeDesignation
    }));

    const newTemplate = new Template({ 
      name, 
      questions: processedQuestions 
    });
    
    await newTemplate.save();
    res.status(201).json(newTemplate);
  } catch (error) {
    res.status(500).json({ message: 'Error adding template', error });
  }
};


// Add a new question to an existing template
// export const addQuestionToTemplate = async (req, res) => {
//   const { templateId } = req.params;
//   const { question, type } = req.body;
  
//   try {
//     const template = await Template.findById(templateId);
//     if (!template) {
//       return res.status(404).json({ message: 'Template not found' });
//     }
    
//     const newQuestion = {
//       avatar: question.charAt(0).toUpperCase(),
//       question,
//       type
//     };
    
//     template.questions.push(newQuestion);
//     await template.save();
    
//     res.status(200).json(template);
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding question to template', error });
//   }
// };
// Add a new question to an existing template
export const addQuestionToTemplate = async (req, res) => {
  const { templateId } = req.params;
  const { question, type, employeeId, employeeName, employeeDepartment, employeeDesignation } = req.body;
  
  try {
    const template = await Template.findById(templateId);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    const newQuestion = {
      avatar: question.charAt(0).toUpperCase(),
      question,
      type,
      employeeId,
      employeeName,
      employeeDepartment,
      employeeDesignation
    };
    
    template.questions.push(newQuestion);
    await template.save();
    
    res.status(200).json(template);
  } catch (error) {
    res.status(500).json({ message: 'Error adding question to template', error });
  }
};

// Edit a template by ID
export const updateTemplate = async (req, res) => {
  const { id } = req.params;
  const { name, questions } = req.body;
  try {
    const updatedTemplate = await Template.findByIdAndUpdate(
      id,
      { name, questions },
      { new: true }
    );
    if (!updatedTemplate) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.status(200).json(updatedTemplate);
  } catch (error) {
    res.status(500).json({ message: 'Error updating template', error });
  }
};

// Edit a question in a template
// export const updateQuestion = async (req, res) => {
//   const { templateId, questionId } = req.params;
//   const { question, type } = req.body;
  
//   try {
//     const template = await Template.findById(templateId);
//     if (!template) {
//       return res.status(404).json({ message: 'Template not found' });
//     }
    
//     const questionIndex = template.questions.findIndex(
//       q => q._id.toString() === questionId
//     );
    
//     if (questionIndex === -1) {
//       return res.status(404).json({ message: 'Question not found' });
//     }
    
//     template.questions[questionIndex].question = question;
//     template.questions[questionIndex].type = type;
    
//     await template.save();
//     res.status(200).json(template);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating question', error });
//   }
// };
export const updateQuestion = async (req, res) => {
  const { templateId, questionId } = req.params;
  const { question, type, employeeId, employeeName, employeeDepartment, employeeDesignation } = req.body;
  
  try {
    const template = await Template.findById(templateId);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    const questionIndex = template.questions.findIndex(
      q => q._id.toString() === questionId
    );
    
    if (questionIndex === -1) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    template.questions[questionIndex].question = question;
    template.questions[questionIndex].type = type;
    template.questions[questionIndex].employeeId = employeeId;
    template.questions[questionIndex].employeeName = employeeName;
    template.questions[questionIndex].employeeDepartment = employeeDepartment;
    template.questions[questionIndex].employeeDesignation = employeeDesignation;
    
    await template.save();
    res.status(200).json(template);
  } catch (error) {
    res.status(500).json({ message: 'Error updating question', error });
  }
};

// Delete a question from a template by template ID and question ID
export const deleteQuestion = async (req, res) => {
  const { templateId, questionId } = req.params;
  try {
    const template = await Template.findById(templateId);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    template.questions = template.questions.filter(
      (question) => question._id.toString() !== questionId
    );
    await template.save();
    res.status(200).json({ message: 'Question deleted successfully', template });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting question', error });
  }
};

// Delete an entire template by ID
export const deleteTemplate = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTemplate = await Template.findByIdAndDelete(id);
    if (!deletedTemplate) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.status(200).json({ message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting template', error });
  }
};
