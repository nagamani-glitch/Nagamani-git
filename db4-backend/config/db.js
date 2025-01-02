// import mongoose from "mongoose"
// import colors from 'colors'

// const userName = encodeURIComponent('rickyharish30')
// const password = encodeURIComponent('LBGUaMDLUuNs7NTb')
// const URL = `mongodb+srv://${userName}:${password}@hrms.e4ytt.mongodb.net/?retryWrites=true&w=majority&appName=HRMS` || process.env.MONGO_URI

// const connectDB =async()=>{

//     try{
//     const conn = await mongoose.connect(URL)
//     console.log(`MongoDB Connected: ${ conn.connection.host}`.cyan.underline)
//     }catch(error)
//     {
//         console.log(`Error:${error.message}`.red.underline.bold)
//         process.exit(1)
//     }
// }

// export default connectDB




import mongoose from "mongoose";
import colors from 'colors';

const userName = encodeURIComponent('rickyharish30');
const password = encodeURIComponent('LBGUaMDLUuNs7NTb');
const URL = `mongodb+srv://${userName}:${password}@hrms.e4ytt.mongodb.net/?retryWrites=true&w=majority&appName=HRMS` || process.env.MONGO_URI;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true, // Ensures compatibility with the MongoDB driver
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    } catch (error) {
        console.log(`Error connecting to MongoDB: ${error.message}`.red.underline.bold);
        process.exit(1);
    }
};

export default connectDB;

