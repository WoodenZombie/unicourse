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
  CircularProgress
} from '@mui/material';
import { Assignment, CalendarToday } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import api from '../services/api';

export default function AddHometaskModal({ open, onClose, courseId, onTaskAdded }) {
  const [form, setForm] = useState({
    description: '',
    deadline: dayjs().add(1, 'day').format('YYYY-MM-DDTHH:mm') // Default to tomorrow
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
      const newTask = await api.createHometask({
        courseId,
        description: form.description,
        deadline: form.deadline,
        status: 'pending'
      });
      
      onTaskAdded(newTask);
      enqueueSnackbar('Hometask added successfully!', { variant: 'success' });
      handleClose();
    } catch (err) {
      console.error('Failed to create hometask:', err);
      enqueueSnackbar(err.response?.data?.message || 'Failed to add hometask', { 
        variant: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
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
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          Add New Hometask
        </Typography>
      </DialogTitle>
      
      <DialogContent dividers>
        <Stack spacing={3} sx={{ pt: 1 }}>
          {Object.keys(errors).length > 0 && (
            <Alert severity="error">
              Please fix the errors in the form
            </Alert>
          )}
          
          <TextField
            name="description"
            label="Task Description"
            fullWidth
            multiline
            rows={4}
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
          />
          
          <TextField
            name="deadline"
            label="Deadline"
            type="datetime-local"
            fullWidth
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
          />
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={handleClose} 
          color="inherit"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={isSubmitting || !form.description || !form.deadline}
          sx={{ minWidth: 120 }}
          endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? 'Adding...' : 'Add Hometask'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}