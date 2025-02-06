import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, IconButton, Card, CardContent, TextField, 
  Button, Dialog, DialogActions, DialogContent, DialogTitle 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import axios from 'axios';

const Policies = () => {
  const [policies, setPolicies] = useState([]);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/policies');
      setPolicies(response.data);
    } catch (error) {
      console.error('Error fetching policies:', error);
    }
  };

  const handleSearchChange = (e) => setSearch(e.target.value);

  const filteredPolicies = policies.filter(policy => 
    policy.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    setSelectedPolicy({ title: '', content: '' });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleEdit = (policy) => {
    setSelectedPolicy(policy);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/policies/${id}`);
      setPolicies(policies.filter(policy => policy._id !== id));
    } catch (error) {
      console.error('Error deleting policy:', error);
    }
  };

  const handleView = (policy) => {
    setSelectedPolicy(policy);
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedPolicy(null);
    setIsEditMode(false);
  };

  const handleSave = async () => {
    try {
      if (isEditMode) {
        if (selectedPolicy._id) {
          // Update existing policy
          const response = await axios.put(
            `http://localhost:5000/api/policies/${selectedPolicy._id}`,
            selectedPolicy
          );
          setPolicies(policies.map(p => 
            p._id === selectedPolicy._id ? response.data : p
          ));
        } else {
          // Create new policy
          const response = await axios.post(
            'http://localhost:5000/api/policies',
            selectedPolicy
          );
          setPolicies([...policies, response.data]);
        }
      }
      handleDialogClose();
    } catch (error) {
      console.error('Error saving policy:', error);
    }
  };

  return (
    <Box sx={{ padding: '24px' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
      <Typography variant="h3" fontWeight="800"  fontSize="1.5rem">Policies</Typography>
        <Box display="flex" alignItems="center">
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search"
            value={search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon />
            }}
            sx={{ marginRight: '16px' }}
          />
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleCreate} 
            startIcon={<AddIcon />}
          >
            Create
          </Button>
        </Box>
      </Box>

      <Box display="flex" gap={2} flexWrap="wrap">
        {filteredPolicies.map(policy => (
          <Card key={policy._id} sx={{ width: '300px', padding: '16px', position: 'relative' }}>
            <Typography variant="h6">
              <span style={{ color: 'green', fontSize: '24px' }}>●</span> {policy.title}
              <IconButton 
                onClick={() => handleEdit(policy)} 
                size="small" 
                sx={{ position: 'absolute', top: 8, right: 40 }}
              >
                <EditIcon />
              </IconButton>
              <IconButton 
                onClick={() => handleDelete(policy._id)} 
                size="small" 
                sx={{ position: 'absolute', top: 8, right: 8 }}
              >
                <DeleteIcon color="error" />
              </IconButton>
            </Typography>
            <CardContent sx={{ height: '120px', overflowY: 'auto' }}>
              <Typography variant="body2" component="p">
                {policy.content}
              </Typography>
            </CardContent>
            <Button 
              variant="text" 
              color="error" 
              onClick={() => handleView(policy)}
            >
              View Policy
            </Button>
          </Card>
        ))}
      </Box>

      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{isEditMode ? 'Edit Policy' : 'View Policy'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            variant="outlined"
            value={selectedPolicy?.title || ''}
            onChange={(e) => setSelectedPolicy({ ...selectedPolicy, title: e.target.value })}
            disabled={!isEditMode}
            sx={{ marginBottom: '16px', marginTop: '16px' }}
          />
          <TextField
            label="Content"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={selectedPolicy?.content || ''}
            onChange={(e) => setSelectedPolicy({ ...selectedPolicy, content: e.target.value })}
            disabled={!isEditMode}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">Cancel</Button>
          {isEditMode && (
            <Button onClick={handleSave} color="primary" variant="contained">
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Policies;
