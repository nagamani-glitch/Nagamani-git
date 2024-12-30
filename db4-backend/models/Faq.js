import mongoose from 'mongoose';

const FaqSchema = new mongoose.Schema({
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'FaqCategory', required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Faq', FaqSchema);
