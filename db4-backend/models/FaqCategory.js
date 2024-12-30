import mongoose from 'mongoose';

const FaqCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
}, { timestamps: true });

export default mongoose.model('FaqCategory', FaqCategorySchema);
