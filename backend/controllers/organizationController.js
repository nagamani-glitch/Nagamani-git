import OrganizationNode from '../models/OrganizationNode.js';

// Helper function to build the organization tree
const buildOrganizationTree = async (rootNode) => {
  if (!rootNode) return null;
  
  const children = await OrganizationNode.find({ parentId: rootNode._id });
  
  const node = rootNode.toObject();
  
  if (children.length > 0) {
    node.children = [];
    for (const child of children) {
      const childNode = await buildOrganizationTree(child);
      node.children.push(childNode);
    }
  }
  
  return node;
};

// Get the entire organization chart
export const getOrganizationChart = async (req, res) => {
  try {
    // Find the root node (node with no parent)
    const rootNode = await OrganizationNode.findOne({ parentId: null });
    
    if (!rootNode) {
      return res.status(200).json(null);
    }
    
    // Build the tree structure
    const organizationTree = await buildOrganizationTree(rootNode);
    
    res.status(200).json(organizationTree);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching organization chart', error: error.message });
  }
};

// Add a new position
export const addPosition = async (req, res) => {
  try {
    const { name, title, parentId, employeeId, email, department, status } = req.body;
    
    // Create the new position
    const newPosition = new OrganizationNode({
      name,
      title,
      parentId: parentId || null,
      employeeId,
      email,
      department,
      status
    });
    
    await newPosition.save();
    
    res.status(201).json(newPosition);
  } catch (error) {
    res.status(500).json({ message: 'Error adding position', error: error.message });
  }
};

// Update a position
export const updatePosition = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, title, parentId, employeeId, email, department, status } = req.body;
    
    // Check if this is the root node and parentId is being changed
    const position = await OrganizationNode.findById(id);
    if (!position) {
      return res.status(404).json({ message: 'Position not found' });
    }
    
    // If this is the root node, don't allow changing the parentId
    const isRoot = position.parentId === null;
    
    const updatedPosition = await OrganizationNode.findByIdAndUpdate(
      id,
      {
        name,
        title,
        parentId: isRoot ? null : (parentId || null),
        employeeId,
        email,
        department,
        status
      },
      { new: true }
    );
    
    if (!updatedPosition) {
      return res.status(404).json({ message: 'Position not found' });
    }
    
    res.status(200).json(updatedPosition);
  } catch (error) {
    res.status(500).json({ message: 'Error updating position', error: error.message });
  }
};

// Delete a position
export const deletePosition = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if this is the root node
    const position = await OrganizationNode.findById(id);
    if (!position) {
      return res.status(404).json({ message: 'Position not found' });
    }
    
    if (position.parentId === null) {
      return res.status(400).json({ message: 'Cannot delete the root position' });
    }
    
    // Check if this position has children
    const hasChildren = await OrganizationNode.exists({ parentId: id });
    if (hasChildren) {
      return res.status(400).json({ 
        message: 'Cannot delete a position with subordinates. Please reassign or delete subordinates first.' 
      });
    }
    
    // Delete the position
    await OrganizationNode.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Position deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting position', error: error.message });
  }
};

// Get all positions (flat list)
export const getAllPositions = async (req, res) => {
  try {
    const positions = await OrganizationNode.find().sort('name');
    res.status(200).json(positions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching positions', error: error.message });
  }
};

// Get a single position
export const getPosition = async (req, res) => {
  try {
    const { id } = req.params;
    const position = await OrganizationNode.findById(id);
    
    if (!position) {
      return res.status(404).json({ message: 'Position not found' });
    }
    
    res.status(200).json(position);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching position', error: error.message });
  }
};
