import { useState } from 'react';
import PropTypes from 'prop-types';
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
import { useSnackbar } from 'notistack';
import { Schedule, School, Person } from '@mui/icons-material';
import api from '../services/api';

export default function AddCourseModal({ open, onClose, onCourseAdded }) {
  const [form, setForm] = useState({
    name: '',
    professor: '',
    schedule: '',
    credits: 3,
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Course name is required';
    if (!form.professor.trim()) newErrors.professor = 'Professor name is required';
    if (!form.schedule.trim()) newErrors.schedule = 'Schedule is required';
    if (form.credits < 1 || form.credits > 10) newErrors.credits = 'Credits must be between 1-10';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const response = await api.createCourse({
        name: form.name,
        professor: form.professor,
        schedule: form.schedule,
        credits: Number(form.credits),
        description: form.description
      });

      if (response.success) {
        if (typeof onCourseAdded === 'function') {
          onCourseAdded(response.data);
        }
        enqueueSnackbar('Course added successfully!', { variant: 'success' });
        handleClose();
      } else {
        throw new Error(response.message || 'Failed to add course');
      }
    } catch (err) {
      console.error('Failed to create course:', err);
      enqueueSnackbar(err.message || 'Failed to add course', { 
        variant: 'error',
        autoHideDuration: 3000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm({ name: '', professor: '', schedule: '', credits: 3, description: '' });
    setErrors({});
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          Add New Course
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
            name="name"
            label="Course Name"
            fullWidth
            value={form.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <School color="action" />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            name="professor"
            label="Professor"
            fullWidth
            value={form.professor}
            onChange={handleChange}
            error={!!errors.professor}
            helperText={errors.professor}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="action" />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            name="schedule"
            label="Schedule"
            fullWidth
            value={form.schedule}
            onChange={handleChange}
            error={!!errors.schedule}
            helperText={errors.schedule || "Example: Mon/Wed 10:00-11:30"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Schedule color="action" />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            name="credits"
            label="Credits"
            type="number"
            fullWidth
            value={form.credits}
            onChange={handleChange}
            error={!!errors.credits}
            helperText={errors.credits}
            inputProps={{ 
              min: 1, 
              max: 10,
              step: 1
            }}
          />
          
          <TextField
            name="description"
            label="Description (Optional)"
            fullWidth
            multiline
            rows={3}
            value={form.description}
            onChange={handleChange}
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
          disabled={isSubmitting}
          sx={{ minWidth: 120 }}
          endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? 'Adding...' : 'Add Course'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AddCourseModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCourseAdded: PropTypes.func
};

AddCourseModal.defaultProps = {
  onCourseAdded: () => {}
};