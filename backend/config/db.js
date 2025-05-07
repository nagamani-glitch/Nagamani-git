// import mongoose from "mongoose";
// import colors from 'colors';

// // const userName = encodeURIComponent('rickyharish30');
// // const password = encodeURIComponent('LBGUaMDLUuNs7NTb');
// const URL = `mongodb+srv://adineshsundar02:HRMS123@cluster0.egcee0k.mongodb.net/?retryWrites=true&w=majority&appName=HRMS_2204`;

// const connectDB = async () => {
//     try {
//         const conn = await mongoose.connect(URL);
//         console.log(`🚀 MongoDB Connected: ${conn.connection.host}`.cyan.underline);
//     } catch (error) {
//         console.log(`Error connecting to MongoDB: ${error.message}`.red.underline.bold);
//         process.exit(1);
//     }
// };

// export default connectDB;


import mongoose from "mongoose";
import colors from 'colors';

// Main connection URL
const URL = `mongodb+srv://adineshsundar02:HRMS123@cluster0.egcee0k.mongodb.net/?retryWrites=true&w=majority&appName=HRMS_2204`;

// Store connections for each company
const connections = {};

// Connect to main database
const connectMainDB = async () => {
    try {
        const conn = await mongoose.connect(URL);
        console.log(`🚀 Main MongoDB Connected: ${conn.connection.host}`.cyan.underline);
        return conn;
    } catch (error) {
        console.log(`Error connecting to MongoDB: ${error.message}`.red.underline.bold);
        process.exit(1);
    }
};

// Get or create a connection for a specific company
const getCompanyConnection = async (companyCode) => {
    if (!companyCode) {
        throw new Error('Company code is required');
    }
    
    // Normalize company code
    companyCode = companyCode.toUpperCase();
    
    // Return existing connection if available
    if (connections[companyCode]) {
        return connections[companyCode];
    }
    
    // Create a new connection for this company
    try {
        // Create a new connection with a specific database name for this company
        const dbName = `hrms_${companyCode.toLowerCase()}`;
        
        // Fix: Properly construct the connection URL without creating an invalid namespace
        // Original problematic line:
        // const connection = await mongoose.createConnection(`${URL.split('?')[0]}/${dbName}?${URL.split('?')[1]}`);
        
        // Fixed version - ensure we don't add an extra slash that creates an invalid namespace
        const baseUrl = URL.split('?')[0];
        const queryParams = URL.split('?')[1] || '';
        
        // Make sure we don't have double slashes by removing any trailing slash from baseUrl
        const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        const connectionString = `${cleanBaseUrl}/${dbName}?${queryParams}`;
        
        const connection = await mongoose.createConnection(connectionString);
        
        console.log(`🚀 Company DB Connected: ${connection.name} for ${companyCode}`.green.underline);
        
        // Store the connection
        connections[companyCode] = connection;
        return connection;
    } catch (error) {
        console.log(`Error connecting to company database: ${error.message}`.red.underline.bold);
        throw error;
    }
};

// // Get or create a connection for a specific company
// const getCompanyConnection = async (companyCode) => {
//     if (!companyCode) {
//         throw new Error('Company code is required');
//     }
    
//     // Normalize company code
//     companyCode = companyCode.toUpperCase();
    
//     // Return existing connection if available
//     if (connections[companyCode]) {
//         return connections[companyCode];
//     }
    
//     // Create a new connection for this company
//     try {
//         // Create a new connection with a specific database name for this company
//         const dbName = `hrms_${companyCode.toLowerCase()}`;
//         const connection = await mongoose.createConnection(`${URL.split('?')[0]}/${dbName}?${URL.split('?')[1]}`);
        
//         console.log(`🚀 Company DB Connected: ${connection.name} for ${companyCode}`.green.underline);
        
//         // Store the connection
//         connections[companyCode] = connection;
//         return connection;
//     } catch (error) {
//         console.log(`Error connecting to company database: ${error.message}`.red.underline.bold);
//         throw error;
//     }
// };

// Close all connections
const closeAllConnections = async () => {
    await mongoose.disconnect();
    for (const companyCode in connections) {
        await connections[companyCode].close();
    }
    console.log('All database connections closed'.yellow);
};

export { connectMainDB, getCompanyConnection, closeAllConnections };
export default connectMainDB;
