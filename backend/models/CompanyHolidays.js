import mongoose from 'mongoose';

const companyHolidaySchema = new mongoose.Schema({
    week: {
        type: String,
        required: true,
        enum: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'All Weeks']
    },
    day: {
        type: String,
        required: true,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }
});

export default mongoose.model('CompanyHoliday', companyHolidaySchema);
