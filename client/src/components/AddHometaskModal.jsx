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

export default function AddHometaskModal({ open, onClose, courseId, onTaskAdded }) {
  const [form, setForm] = useState({
    description: '',
    deadline: ''
  });

  const handleSubmit = async () => {
    try {
      const newTask = await api.createHometask({
        courseId,
        description: form.description,
        deadline: form.deadline
      });
      onTaskAdded(newTask);
      onClose();
      setForm({ description: '', deadline: '' }); // Сброс формы
    } catch (err) {
      console.error('Failed to create hometask:', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Hometask</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={form.description}
          onChange={(e) => setForm({...form, description: e.target.value})}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Deadline"
          type="datetime-local"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={form.deadline}
          onChange={(e) => setForm({...form, deadline: e.target.value})}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={!form.description || !form.deadline}
        >
          Add Hometask
        </Button>
      </DialogActions>
    </Dialog>
  );
}