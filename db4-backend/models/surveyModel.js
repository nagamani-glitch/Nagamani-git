import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  avatar: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  questions: [questionSchema],
});

const Template = mongoose.model('Template', templateSchema);

export default Template;
