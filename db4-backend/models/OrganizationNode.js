import mongoose from 'mongoose';

const organizationNodeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrganizationNode',
    default: null
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrganizationNode'
  }],
  level: {
    type: Number,
    default: 0
  },
  department: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Pre-save middleware to update level based on parent
organizationNodeSchema.pre('save', async function(next) {
  if (this.parentId) {
    const parent = await this.constructor.findById(this.parentId);
    if (parent) {
      this.level = parent.level + 1;
    }
  }
  next();
});

const OrganizationNode = mongoose.model('OrganizationNode', organizationNodeSchema);
export default OrganizationNode;
