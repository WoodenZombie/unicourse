import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Button,
  Stack,
  Alert,
  CircularProgress,
  InputAdornment,
  Chip
} from '@mui/material';
import {
  School,
  Person,
  Schedule,
  Star,
  Description
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import api from '../services/api';
import dayjs from 'dayjs';

export default function EditCourseModal({ open, onClose, course, onSubmit }) {
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

  // initialize form with course data
  useEffect(() => {
    if (course) {
      setForm({
        name: course.name || '',
        professor: course.professor || '',
        schedule: course.schedule || '',
        credits: course.credits || 3,
        description: course.description || ''
      });
    }
  }, [course]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Course name is required';
    if (!form.professor.trim()) newErrors.professor = 'Professor name is required';
    if (!form.schedule.trim()) newErrors.schedule = 'Schedule is required';
    if (form.credits < 1 || form.credits > 10) {
      newErrors.credits = 'Credits must be between 1-10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const updatedCourse = await api.updateCourse(course?._id, {
        ...form,
        credits: Number(form.credits)
      });
      
      onSubmit(updatedCourse);
      enqueueSnackbar('Course updated successfully!', { variant: 'success' });
      handleClose();
    } catch (err) {
      console.error('Failed to update course:', err);
      enqueueSnackbar(
        err.response?.data?.message || 'Failed to update course', 
        { variant: 'error' }
      );
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
    setErrors({});
    onClose();
  };

  if (!course) return null;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <School color="primary" />
          <Typography variant="h6" component="span">
            Edit Course
          </Typography>
          {course?._id && (
            <Chip 
              label={`ID: ${course._id.slice(-6)}`} 
              size="small" 
              color="info"
              variant="outlined"
            />
          )}
        </Stack>
      </DialogTitle>
  
      <DialogContent dividers>
  <Stack spacing={3} sx={{ pt: 2 }}>
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
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Star color="action" />
          </InputAdornment>
        ),
      }}
    />
    
    <TextField
      name="description"
      label="Description"
      fullWidth
      multiline
      rows={4}
      value={form.description}
      onChange={handleChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Description color="action" />
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
          disabled={isSubmitting}
          sx={{ minWidth: 120 }}
          endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}