import mongoose from "mongoose";
import colors from 'colors';

const userName = encodeURIComponent('rickyharish30');
const password = encodeURIComponent('LBGUaMDLUuNs7NTb');
const URL = `mongodb+srv://adineshsundar02:HRMS123@cluster0.egcee0k.mongodb.net/?retryWrites=true&w=majority&appName=HRMS_2204`;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(URL);
        console.log(`🚀 MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    } catch (error) {
        console.log(`Error connecting to MongoDB: ${error.message}`.red.underline.bold);
        process.exit(1);
    }
};

export default connectDB;

