import { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button 
} from '@mui/material';
import api from '../services/api';

export default function AddCourseModal({ open, onClose, onCourseAdded }) {
  const [form, setForm] = useState({
    name: '',
    professor: '',
    schedule: '',
    credits: 3
  });

  const handleSubmit = async () => {
    try {
      const newCourse = await api.createCourse(form);
      onCourseAdded(newCourse);
      onClose();
      setForm({ name: '', professor: '', schedule: '', credits: 3 }); // Сброс формы
    } catch (err) {
      console.error('Failed to create course:', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Course</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Course Name"
          fullWidth
          value={form.name}
          onChange={(e) => setForm({...form, name: e.target.value})}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Professor"
          fullWidth
          value={form.professor}
          onChange={(e) => setForm({...form, professor: e.target.value})}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Schedule (e.g. Mon/Wed 10:00-11:30)"
          fullWidth
          value={form.schedule}
          onChange={(e) => setForm({...form, schedule: e.target.value})}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Credits"
          type="number"
          fullWidth
          value={form.credits}
          onChange={(e) => setForm({...form, credits: parseInt(e.target.value) || 0})}
          inputProps={{ min: 1, max: 10 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={!form.name || !form.professor || !form.schedule}
        >
          Add Course
        </Button>
      </DialogActions>
    </Dialog>
  );
}