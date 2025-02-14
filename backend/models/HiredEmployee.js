import mongoose from 'mongoose';

const hiredEmployeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    joiningDate: {
        type: Date,
        required: true
    },
    probationEnds: {
        type: Date,
        required: true
    },
    jobPosition: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true,
        enum: ['Engineering', 'Product', 'Marketing', 'Sales', 'HR']
    },
    recruitment: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Pending', 'Inactive'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export default mongoose.model('HiredEmployee', hiredEmployeeSchema);
