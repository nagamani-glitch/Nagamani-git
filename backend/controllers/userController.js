import User from '../models/User.js';
import Company from '../models/Company.js';
import { generatePassword } from '../utils/passwordUtils.js';
import { sendInvitationEmail } from '../utils/emailService.js';

// Invite a new user
export const inviteUser = async (req, res) => {
  try {
    const { firstName, middleName, lastName, email, role } = req.body;
    const companyCode = req.companyCode;
    
    console.log(`Inviting user to company ${companyCode}:`, {
      firstName,
      lastName,
      email,
      role
    });
    
    if (!companyCode) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required. Company code not found.' 
      });
    }
    
    // Check if user already exists with this email in this company
    const existingUser = await User.findOne({ 
      email: email.toLowerCase(),
      companyCode 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'A user with this email already exists in your company.' 
      });
    }
    
    // Get company details
    const company = await Company.findOne({ companyCode });
    
    if (!company) {
      return res.status(404).json({ 
        success: false, 
        message: 'Company not found.' 
      });
    }
    
    // Generate a temporary password
    const temporaryPassword = generatePassword();
    
    // Create the full name
    const name = middleName 
      ? `${firstName} ${middleName} ${lastName}`
      : `${firstName} ${lastName}`;
    
    // Create the new user
    const newUser = new User({
      firstName,
      middleName,
      lastName,
      name,
      email: email.toLowerCase(),
      password: temporaryPassword, // This will be hashed by the pre-save hook
      role,
      companyCode,
      isVerified: true, // Skip verification for invited users
      isActive: true
    });
    
    // Assign permissions based on role
    newUser.assignPermissions();
    
    // Save the user
    await newUser.save();
    
    console.log(`User created with ID: ${newUser._id}`);
    
    // Send invitation email with temporary password
    try {
      await sendInvitationEmail({
        email,
        name,
        companyName: company.name,
        temporaryPassword,
        companyCode
      });
      
      console.log(`Invitation email sent to ${email}`);
    } catch (emailError) {
      console.error('Failed to send invitation email:', emailError);
      // Continue with the process even if email fails
    }
    
    res.status(201).json({
      success: true,
      message: `User ${name} has been invited successfully.`,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Error inviting user:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'An error occurred while inviting the user.' 
    });
  }
};
