import { useState } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  Chip,
  Box,
  Button,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  InputAdornment,
  Alert,
  MenuItem
} from '@mui/material';
import { 
  CheckCircle, 
  Schedule, 
  Assignment,
  Edit,
  Delete,
  Description
} from '@mui/icons-material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import api from '../services/api';

dayjs.extend(relativeTime);

export default function HometaskList({ hometasks, courses = [], onTaskComplete, onDelete }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // form state for editing
  const [editForm, setEditForm] = useState({
    description: '',
    deadline: '',
    status: 'pending'
  });

  // safely handle hometasks and courses props
  const safeHometasks = Array.isArray(hometasks) ? hometasks : [];
  const safeCourses = Array.isArray(courses) ? courses : [];

  // group tasks by status and due date
  const overdueTasks = safeHometasks.filter(task => 
    task?.status !== 'completed' && dayjs(task?.deadline).isBefore(dayjs())
  );
  const upcomingTasks = safeHometasks.filter(task => 
    task?.status !== 'completed' && dayjs(task?.deadline).isAfter(dayjs())
  );
  const completedTasks = safeHometasks.filter(task => task?.status === 'completed');

  // handle both string and object course references
  const getCourseName = (courseId) => {
    if (!courseId) return 'Unknown Course';
    
    if (typeof courseId === 'object' && courseId.name) {
      return courseId.name;
    }
    const actualCourseId = courseId._id || courseId;
    const course = safeCourses.find(c => {
      const cId = c?._id?.toString() || c?.toString();
      return cId === actualCourseId?.toString();
    });
    return course?.name || 'Unknown Course';
  };

  const getCourseId = (courseId) => {
    if (!courseId) return null;
    return courseId._id || courseId;
  };

  // open edit modal and initialize form
  const handleEditClick = (task) => {
    setSelectedTask(task);
    setEditForm({
      description: task.description || '',
      deadline: task.deadline ? dayjs(task.deadline).format('YYYY-MM-DDTHH:mm') : '',
      status: task.status || 'pending'
    });
    setEditModalOpen(true);
  };

  // handle form changes
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // validate form
  const validateForm = () => {
    const newErrors = {};
    if (!editForm.description.trim()) newErrors.description = 'Description is required';
    if (!editForm.deadline) newErrors.deadline = 'Deadline is required';
    
    if (editForm.status === 'pending' && dayjs(editForm.deadline).isBefore(dayjs())) {
      newErrors.deadline = 'Deadline must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // submit edited task
  const handleEditSubmit = async () => {
    console.log('Attempting to update task with ID:', selectedTask._id);
    // console.log('Data being sent:', {
    // ...editForm,
    // deadline: new Date(editForm.deadline).toISOString(),
    // courseId: selectedTask.courseId
    // });
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const response = await api.updateHometask(selectedTask._id, {
        ...editForm,
        deadline: new Date(editForm.deadline).toISOString(),
        courseId: selectedTask.courseId // preserve original course ID
      });
      
      if (response.success) {
        enqueueSnackbar('Task updated successfully!', { variant: 'success' });
        setEditModalOpen(false);
        // if (onTaskComplete) {
        //   onTaskComplete(); // Refresh the task list
        // }
      }
    } catch (err) {
      enqueueSnackbar(err.message || 'Failed to update task', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTaskGroup = (tasks, title, color) => {
    if (!Array.isArray(tasks) || tasks.length === 0) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="subtitle1" 
          fontWeight="bold"
          sx={{ 
            mb: 1,
            color: color || 'text.primary',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {title} ({tasks.length})
        </Typography>
        <List sx={{ py: 0 }}>
          {tasks.map(task => {
            const taskId = task?._id?.toString();
            if (!taskId) return null;

            return (
              <ListItem 
                key={taskId}
                sx={{ 
                  bgcolor: task?.status === 'completed' ? 'action.hover' : 'background.paper',
                  borderRadius: 1,
                  mb: 1,
                  boxShadow: 1
                }}
                secondaryAction={
                  <Stack direction="row" spacing={1}>
                    {onTaskComplete && task?.status !== 'completed' && (
                      <Tooltip title="Mark as completed">
                        <IconButton onClick={() => onTaskComplete(taskId)}>
                          <CheckCircle color="success" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Edit task">
                      <IconButton onClick={() => handleEditClick(task)}>
                        <Edit color="primary" />
                      </IconButton>
                    </Tooltip>
                    {onDelete && (
                      <Tooltip title="Delete task">
                        <IconButton onClick={() => onDelete(taskId)}>
                          <Delete color="error" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                }
              >
                <Avatar sx={{ 
                  bgcolor: 'primary.main',
                  mr: 2,
                  width: 40,
                  height: 40
                }}>
                  <Assignment />
                </Avatar>
                <ListItemText
                  primary={
                    <Typography fontWeight="medium">
                      {task?.description || 'No description'}
                    </Typography>
                  }
                  secondary={
                    <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                      {task?.deadline && (
                        <Chip 
                          icon={<Schedule />}
                          label={dayjs(task.deadline).format('MMM D, YYYY h:mm A')}
                          size="small"
                          color={dayjs(task.deadline).isBefore(dayjs()) ? 'error' : 'default'}
                        />
                      )}
                      {task?.courseId && (
                        <Chip 
                          label={getCourseName(task.courseId)}
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            const courseId = getCourseId(task.courseId);
                            if (courseId) navigate(`/courses/${courseId}`);
                          }}
                          sx={{ cursor: 'pointer' }}
                        />
                      )}
                      {task?.status === 'completed' && (
                        <Chip 
                          icon={<CheckCircle />}
                          label="Completed"
                          color="success"
                          size="small"
                        />
                      )}
                    </Stack>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      {renderTaskGroup(overdueTasks, 'Overdue', theme.palette.error.main)}
      {renderTaskGroup(upcomingTasks, 'Upcoming', theme.palette.warning.main)}
      {renderTaskGroup(completedTasks, 'Completed', theme.palette.success.main)}

      {safeHometasks.length === 0 && (
        <Box sx={{ 
          textAlign: 'center', 
          p: 4,
          border: `1px dashed ${theme.palette.divider}`,
          borderRadius: 1
        }}>
          <Typography variant="body1" color="text.secondary">
            No hometasks found. Add your first task!
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Assignment />}
            sx={{ mt: 2 }}
            onClick={() => navigate('/courses/all')}
          >
            View Courses
          </Button>
        </Box>
      )}

      {/* Edit Task Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Assignment color="primary" />
            <Typography variant="h6" component="span">
              Edit Task
            </Typography>
            {selectedTask?._id && (
              <Chip 
                label={`ID: ${selectedTask._id.slice(-6)}`} 
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
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Course:</Typography>
              <Typography>
                {selectedTask ? getCourseName(selectedTask.courseId) : 'No course selected'}
              </Typography>
            </Box>
            
            <TextField
              name="description"
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={editForm.description}
              onChange={handleEditFormChange}
              error={!!errors.description}
              helperText={errors.description}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Description color="action" />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              name="deadline"
              label="Deadline"
              type="datetime-local"
              fullWidth
              value={editForm.deadline}
              onChange={handleEditFormChange}
              error={!!errors.deadline}
              helperText={errors.deadline}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Schedule color="action" />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            
            <TextField
              select
              name="status"
              label="Status"
              fullWidth
              value={editForm.status}
              onChange={handleEditFormChange}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setEditModalOpen(false)} 
            color="inherit"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEditSubmit} 
            variant="contained"
            disabled={isSubmitting}
            sx={{ minWidth: 120 }}
            endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}