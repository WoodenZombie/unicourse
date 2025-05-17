import { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button,
  Alert,
  Stack,
  Typography,
  InputAdornment,
  CircularProgress,
  Box,
  IconButton
} from '@mui/material';
import { Assignment, CalendarToday, Close} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import api from '../services/api';

export default function AddHometaskModal({ open, onClose, courseId, onSubmit }) {
  const [form, setForm] = useState({
    description: '',
    deadline: dayjs().add(1, 'day').format('YYYY-MM-DDTHH:mm')
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const validateForm = () => {
    const newErrors = {};
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.deadline) newErrors.deadline = 'Deadline is required';
    else if (dayjs(form.deadline).isBefore(dayjs())) {
      newErrors.deadline = 'Deadline must be in the future';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const response = await api.createHometask({
        courseId,
        description: form.description,
        deadline: form.deadline,
        status: 'pending'
      });
      
      if (response.success) {
        onSubmit(response.data);
        enqueueSnackbar('Hometask added successfully!', { 
          variant: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
        handleClose();
      } else {
        throw new Error(response.message || 'Failed to add hometask');
      }
    } catch (err) {
      console.error('Failed to create hometask:', err);
      enqueueSnackbar(err.message || 'Failed to add hometask', { 
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleClose = () => {
    setForm({ 
      description: '', 
      deadline: dayjs().add(1, 'day').format('YYYY-MM-DDTHH:mm') 
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: 24
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            Create New Hometask
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers sx={{ py: 3 }}>
        <Stack spacing={3}>
          {Object.keys(errors).length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Please fix the errors in the form
            </Alert>
          )}
          
          <TextField
            name="description"
            label="Task Description"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={form.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description || "Describe what needs to be done"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Assignment color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          
          <TextField
            name="deadline"
            label="Deadline"
            type="datetime-local"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={form.deadline}
            onChange={handleChange}
            error={!!errors.deadline}
            helperText={errors.deadline || "When the task needs to be completed"}
            inputProps={{
              min: dayjs().format('YYYY-MM-DDTHH:mm')
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarToday color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button 
          onClick={handleClose} 
          color="inherit"
          disabled={isSubmitting}
          sx={{ 
            borderRadius: 2,
            px: 3,
            py: 1
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={isSubmitting || !form.description || !form.deadline}
          sx={{ 
            borderRadius: 2,
            px: 3,
            py: 1,
            minWidth: 150
          }}
          endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isSubmitting ? 'Creating...' : 'Create Hometask'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}