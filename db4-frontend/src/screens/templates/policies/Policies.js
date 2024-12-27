// import React, { useState } from 'react';
// import { Card, CardContent, CardActions, IconButton, Typography, Button, TextField, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Paper } from '@mui/material';
// import { Add, Edit, Delete } from '@mui/icons-material';
// import { styled } from '@mui/system';

// const Container = styled(Paper)({
//   padding: '20px',
//   fontFamily: 'Arial, sans-serif',
// });

// const Header = styled('div')({
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'space-between',
//   marginBottom: '20px',
// });

// const SearchField = styled(TextField)({
//   width: '300px',
// });

// const PolicyCard = styled(Card)({
//   position: 'relative',
//   padding: '16px',
//   minHeight: '200px',
//   display: 'flex',
//   flexDirection: 'column',
//   justifyContent: 'space-between',
// });

// const TitleSection = styled('div')({
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'space-between',
// });

// const ViewButton = styled(Button)({
//   color: 'red',
// });

// const Policies = () => {
//   const [policies, setPolicies] = useState([
//     { id: 1, title: 'Code of Conduct', content: 'Respect and Integrity: Employees are expected to treat each other with respect...', status: 'active' },
//     { id: 2, title: 'Attendance and punctuality', content: 'Employees are expected to report to work on time...', status: 'active' },
//     { id: 3, title: 'Non Disclosure', content: 'Employees must maintain the confidentiality...', status: 'active' },
//   ]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [openCreateDialog, setOpenCreateDialog] = useState(false);
//   const [openViewDialog, setOpenViewDialog] = useState(false);
//   const [selectedPolicy, setSelectedPolicy] = useState(null);

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleCreate = () => {
//     setOpenCreateDialog(true);
//   };

//   const handleCreatePolicy = (newPolicy) => {
//     setPolicies([...policies, newPolicy]);
//     setOpenCreateDialog(false);
//   };

//   const handleEditPolicy = (id, newContent) => {
//     setPolicies(policies.map(policy => policy.id === id ? { ...policy, content: newContent } : policy));
//   };

//   const handleDeletePolicy = (id) => {
//     setPolicies(policies.filter(policy => policy.id !== id));
//   };

//   const handleViewPolicy = (policy) => {
//     setSelectedPolicy(policy);
//     setOpenViewDialog(true);
//   };

//   const filteredPolicies = policies.filter(policy => policy.title.toLowerCase().includes(searchTerm.toLowerCase()));

//   return (
//     <Container>
//       <Header>
//         <Typography variant="h5">Policies</Typography>
//         <SearchField 
//           variant="outlined" 
//           placeholder="Search" 
//           value={searchTerm} 
//           onChange={handleSearch} 
//           InputProps={{ style: { borderRadius: '8px' } }}
//         />
//         <Button variant="contained" color="error" startIcon={<Add />} onClick={handleCreate}>
//           Create
//         </Button>
//       </Header>

//       <Grid container spacing={3}>
//         {filteredPolicies.map(policy => (
//           <Grid item xs={12} sm={6} md={4} key={policy.id}>
//             <PolicyCard>
//               <TitleSection>
//                 <Typography variant="h6" component="div">
//                   <span style={{ color: 'green', marginRight: '8px' }}>●</span> {policy.title}
//                 </Typography>
//                 <div>
//                   <IconButton color="primary" onClick={() => handleEditPolicy(policy.id, policy.content)}>
//                     <Edit />
//                   </IconButton>
//                   <IconButton color="error" onClick={() => handleDeletePolicy(policy.id)}>
//                     <Delete />
//                   </IconButton>
//                 </div>
//               </TitleSection>
//               <CardContent style={{ overflowY: 'auto', maxHeight: '80px' }}>
//                 <Typography variant="body2" color="textSecondary">
//                   {policy.content}
//                 </Typography>
//               </CardContent>
//               <CardActions>
//                 <ViewButton onClick={() => handleViewPolicy(policy)}>View Policy</ViewButton>
//               </CardActions>
//             </PolicyCard>
//           </Grid>
//         ))}
//       </Grid>

//       {/* Create Policy Dialog */}
//       <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)}>
//         <DialogTitle>Create New Policy</DialogTitle>
//         <DialogContent>
//           <TextField autoFocus margin="dense" label="Title" fullWidth />
//           <TextField margin="dense" label="Content" multiline rows={4} fullWidth />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenCreateDialog(false)} color="primary">Cancel</Button>
//           <Button onClick={() => handleCreatePolicy({ id: policies.length + 1, title: 'New Policy', content: 'Policy Content', status: 'active' })} color="primary">Create</Button>
//         </DialogActions>
//       </Dialog>

//       {/* View Policy Dialog */}
//       <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)}>
//         <DialogTitle>{selectedPolicy?.title}</DialogTitle>
//         <DialogContent>
//           <Typography variant="body1">
//             {selectedPolicy?.content}
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenViewDialog(false)} color="primary">Close</Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// };

// export default Policies;


import React, { useState } from 'react';
import { 
  Box, Typography, IconButton, Card, CardContent, TextField, 
  Button, Dialog, DialogActions, DialogContent, DialogTitle 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const initialPolicies = [
  { id: 1, title: "Code of Conduct", content: "Respect and Integrity: Employees are expected to treat each other with respect, maintain integrity in all interactions, and uphold the company’s reputation.", editable: false },
  { id: 2, title: "Attendance and Punctuality", content: "Employees are expected to report to work on time and adhere to their scheduled work hours.", editable: false },
  { id: 3, title: "Non Disclosure", content: "Employees must maintain the confidentiality of all company information, proprietary data, and sensitive personal information of clients and colleagues.", editable: false },
  { id: 4, title: "Use of Company Property", content: "Respect and Integrity: Employees are expected to treat each other with respect, maintain integrity in all interactions, and uphold the company’s reputation.", editable: false },
  { id: 5, title: "Test ", content: "Employees are expected to report to work on time and adhere to their scheduled work hours.", editable: false },
  { id: 6, title: "Test", content: "Employees must maintain the confidentiality of all company information, proprietary data, and sensitive personal information of clients and colleagues.", editable: false },
  { id: 7, title: "Test", content: "Respect and Integrity: Employees are expected to treat each other with respect, maintain integrity in all interactions, and uphold the company’s reputation.", editable: false },
  { id: 8, title: "Company Guidelines", content: "Employees are expected to report to work on time and adhere to their scheduled work hours.", editable: false },
  { id: 9, title: "Non Disclosure", content: "Employees must maintain the confidentiality of all company information, proprietary data, and sensitive personal information of clients and colleagues.", editable: false }
];

const Policies = () => {
  const [policies, setPolicies] = useState(initialPolicies);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleSearchChange = (e) => setSearch(e.target.value);

  const filteredPolicies = policies.filter(policy => 
    policy.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    setSelectedPolicy({ id: Date.now(), title: '', content: '', editable: true });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleEdit = (policy) => {
    setSelectedPolicy(policy);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    setPolicies(policies.filter(policy => policy.id !== id));
  };

  const handleView = (policy) => {
    setSelectedPolicy(policy);
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedPolicy(null);
  };

  const handleSave = () => {
    if (isEditMode) {
      if (selectedPolicy.id) {
        setPolicies(policies.map(p => (p.id === selectedPolicy.id ? selectedPolicy : p)));
      } else {
        setPolicies([...policies, selectedPolicy]);
      }
    }
    handleDialogClose();
  };

  const handleUploadImage = () => {
    alert('Upload functionality goes here.');
  };

  return (
    <Box sx={{ padding: '24px' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Policies</Typography>
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
          <Button variant="contained" color="error" onClick={handleCreate} startIcon={<AddIcon />}>+ Create</Button>
        </Box>
      </Box>
      <Box display="flex" gap={2} flexWrap="wrap">
        {filteredPolicies.map(policy => (
          <Card key={policy.id} sx={{ width: '300px', padding: '16px', position: 'relative' }}>
            <Typography variant="h6">
              <span style={{ color: 'green', fontSize: '24px' }}>●</span> {policy.title}
              <IconButton onClick={() => handleEdit(policy)} size="small" sx={{ position: 'absolute', top: 8, right: 40 }}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(policy.id)} size="small" sx={{ position: 'absolute', top: 8, right: 8 }}>
                <DeleteIcon color="error" />
              </IconButton>
            </Typography>
            <CardContent sx={{ height: '120px', overflowY: 'auto' }}>
              <Typography variant="body2" component="p">
                {policy.content}
              </Typography>
            </CardContent>
            <Button variant="text" color="error" onClick={() => handleView(policy)}>View Policy</Button>
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
            sx={{ marginBottom: '16px' }}
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
          {!isEditMode && (
            <IconButton
              sx={{ position: 'absolute', bottom: '8px', left: '8px' }}
              onClick={handleUploadImage}
              color="primary"
            >
              <AddCircleIcon />
            </IconButton>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">Cancel</Button>
          {isEditMode && (
            <Button onClick={handleSave} color="primary" variant="contained">Save</Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Policies;
