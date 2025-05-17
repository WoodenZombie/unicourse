import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  InputAdornment,
  CircularProgress,
  Typography,
  Alert
} from '@mui/material';
import { Add, Assignment, CalendarToday } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import api from '../services/api';
import dayjs from 'dayjs';

export default function CreateHometaskButton({ courses }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [form, setForm] = useState({
    description: '',
    deadline: dayjs().add(1, 'day').format('YYYY-MM-DDTHH:mm')
  });
  const [errors, setErrors] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  const validateForm = () => {
    const newErrors = {};
    if (!selectedCourse) newErrors.course = 'Course is required';
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
        courseId: selectedCourse,
        description: form.description,
        deadline: form.deadline,
        status: 'pending'
      });
      
      if (response.success) {
        enqueueSnackbar('Hometask created successfully!', { variant: 'success' });
        handleClose();
      } else {
        throw new Error(response.message || 'Failed to create hometask');
      }
    } catch (err) {
      enqueueSnackbar(err.message || 'Failed to create hometask', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCourse('');
    setForm({
      description: '',
      deadline: dayjs().add(1, 'day').format('YYYY-MM-DDTHH:mm')
    });
    setErrors({});
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setOpen(true)}
        sx={{ 
          mb: 3,
          borderRadius: 2,
          boxShadow: 2,
          '&:hover': {
            boxShadow: 4
          }
        }}
      >
        Create Hometask
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Assignment fontSize="large" color="primary" />
            <Typography variant="h6">Create New Hometask</Typography>
          </Stack>
        </DialogTitle>
        
        <DialogContent dividers>
          <Stack spacing={3} sx={{ pt: 2 }}>
            {Object.keys(errors).length > 0 && (
              <Alert severity="error">
                Please fix the form errors
              </Alert>
            )}

            <TextField
              select
              label="Select Course"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              error={!!errors.course}
              helperText={errors.course || "Which course is this task for?"}
              fullWidth
            >
              {courses.map((course) => (
                <MenuItem key={course._id} value={course._id}>
                  {course.name} ({course.professor})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              name="description"
              label="Task Description"
              fullWidth
              multiline
              rows={4}
              value={form.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description || "Describe the assignment"}
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
              InputLabelProps={{ shrink: true }}
              value={form.deadline}
              onChange={handleChange}
              error={!!errors.deadline}
              helperText={errors.deadline || "When is this due?"}
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
              fullWidth
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} color="inherit" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isSubmitting}
            endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? 'Creating...' : 'Create Task'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}