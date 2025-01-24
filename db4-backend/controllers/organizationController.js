import OrganizationNode from '../models/OrganizationNode.js';

export const organizationController = {
  getOrganizationChart: async (req, res) => {
    try {
      let rootNode = await OrganizationNode.findOne({ parentId: null })
        .populate({
          path: 'children',
          populate: { 
            path: 'children',
            populate: 'children'
          }
        });

      if (!rootNode) {
        rootNode = await OrganizationNode.create({
          name: 'CEO',
          title: 'Chief Executive Officer',
          level: 0
        });
      }

      res.status(200).json(rootNode);
    } catch (error) {
      console.error('Error fetching organization chart:', error);
      res.status(500).json({ message: error.message });
    }
  },

  addPosition: async (req, res) => {
    try {
      console.log('Adding position:', req.body);
      const { name, title, parentId } = req.body;

      const newNode = new OrganizationNode({
        name,
        title,
        parentId: parentId || null
      });
      
      const savedNode = await newNode.save();
      console.log('Saved node:', savedNode);

      if (parentId) {
        const updatedParent = await OrganizationNode.findByIdAndUpdate(
          parentId,
          { 
            $push: { children: savedNode._id },
            updatedAt: Date.now()
          },
          { new: true }
        );
        console.log('Updated parent:', updatedParent);
      }

      const populatedNode = await OrganizationNode.findById(savedNode._id)
        .populate('children');

      res.status(201).json(populatedNode);
    } catch (error) {
      console.error('Error adding position:', error);
      res.status(400).json({ message: error.message });
    }
  },

  updatePosition: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, title } = req.body;
      
      const updatedNode = await OrganizationNode.findByIdAndUpdate(
        id,
        { 
          name, 
          title,
          updatedAt: Date.now()
        },
        { new: true }
      ).populate('children');

      if (!updatedNode) {
        return res.status(404).json({ message: 'Position not found' });
      }

      res.status(200).json(updatedNode);
    } catch (error) {
      console.error('Error updating position:', error);
      res.status(400).json({ message: error.message });
    }
  },

  deletePosition: async (req, res) => {
    try {
      const { id } = req.params;
      const node = await OrganizationNode.findById(id);

      if (!node) {
        return res.status(404).json({ message: 'Position not found' });
      }

      if (node.children.length > 0) {
        return res.status(400).json({ 
          message: 'Cannot delete position with subordinates' 
        });
      }

      if (node.parentId) {
        await OrganizationNode.findByIdAndUpdate(
          node.parentId,
          { 
            $pull: { children: id },
            updatedAt: Date.now()
          }
        );
      }

      await OrganizationNode.findByIdAndDelete(id);
      res.status(200).json({ message: 'Position deleted successfully' });
    } catch (error) {
      console.error('Error deleting position:', error);
      res.status(400).json({ message: error.message });
    }
  }
};
