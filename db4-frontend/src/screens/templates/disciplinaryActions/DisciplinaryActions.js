import React, { useState } from 'react';
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, TextField, IconButton, Grid, Stack } from '@mui/material';
import { UploadFile, Close } from '@mui/icons-material';
import GavelIcon from '@mui/icons-material/Gavel';

const DisciplinaryActions = () => {
  const [open, setOpen] = useState(false);

  // Open and close handlers for the dialog
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ padding: 3, textAlign: 'center' }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Disciplinary Actions
      </Typography>
      <GavelIcon sx={{ fontSize: 100, color: '#333', mb: 2 }} />
      <Typography variant="body1" color="textSecondary">
        There are currently no disciplinary actions to consider.
      </Typography>
      <Button
        variant="contained"
        color="error"
        sx={{ mt: 3 }}
        onClick={handleClickOpen}
        startIcon={<span style={{ fontSize: '1.5rem' }}>+</span>}
      >
        Take An Action
      </Button>

      {/* Popup Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Take An Action
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>

            {/* Employee Field */}
            <TextField label="Employee" fullWidth variant="outlined" />

            {/* Action Field */}
            <TextField label="Action" fullWidth variant="outlined" />

            {/* Description Field */}
            <TextField
              label="Description"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
            />

            {/* Start Date Field */}
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
            />

            {/* Attach File */}
            <Grid container alignItems="center">
              <Grid item xs>
                <TextField
                  label="Attach File"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <UploadFile />
                    ),
                  }}
                />
              </Grid>
              <Grid item>
                <Button variant="contained" component="label" sx={{ ml: 2 }}>
                  Upload
                  <input type="file" hidden />
                </Button>
              </Grid>
            </Grid>
          </Stack>
          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button variant="contained" color="primary" sx={{ ml: 2 }}>
              Save
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DisciplinaryActions;
