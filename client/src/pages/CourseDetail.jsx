import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Box,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  Divider,
  IconButton
} from '@mui/material';
import { ArrowBack, Edit, Delete, Add } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import AddHometaskModal from '../components/AddHometaskModal';
import HometaskList from '../components/HometaskList';
import EditCourseModal from '../components/EditCourseModal';
import api from '../services/api';
import dayjs from 'dayjs';

export default function CourseDetail() {
  const { enqueueSnackbar } = useSnackbar();

  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [hometasks, setHometasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAddTask, setOpenAddTask] = useState(false);
  const [openEditCourse, setOpenEditCourse] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First validate the ID
        if (!id || id.length !== 24) { // MongoDB IDs are 24 chars long
          throw new Error('Invalid course ID format');
        }
  
        setLoading(true);
        setError(null);
        
        const [courseResponse, tasksResponse] = await Promise.all([
          api.getCourse(id),
          api.getCourseHometasks(id)
        ]);
  
        if (!courseResponse.success || !tasksResponse.success) {
          throw new Error(
            courseResponse.message || tasksResponse.message || 'Failed to fetch course data'
          );
        }
  
        setCourse(courseResponse.data || null);
        setHometasks(tasksResponse.data || []);
        
      } catch (err) {
        setError(err.message);
        console.error('Course fetch error:', err);
        enqueueSnackbar(err.message || 'Failed to load course data', { variant: 'error' });
        navigate('/dashboard'); // Redirect to dashboard if error occurs
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate, enqueueSnackbar]);

  const handleTaskComplete = async (taskId) => {
    try {
      const response = await api.markAsCompleted(taskId);
      if (response.success) {
        setHometasks(prev => 
          prev.map(task => 
            task._id === taskId ? response.data : task
          )
        );
        showSnackbar('Task marked as completed!');
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      showSnackbar(err.message || 'Failed to complete task', 'error');
      console.error('Task completion error:', err);
    }
  };

  const handleAddTask = (newTask) => {
    setHometasks(prev => [...prev, newTask]);
    setOpenAddTask(false);
  };

  const handleUpdateCourse = async (courseData) => {
    try {
      const response = await api.updateCourse(id, courseData);
      if (response.success) {
        setCourse(response.data);
        setOpenEditCourse(false);
        showSnackbar('Course updated successfully!');
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      showSnackbar(err.message || 'Failed to update course', 'error');
      console.error('Course update error:', err);
    }
  };

  const handleDeleteCourse = async () => {
    try {
      const response = await api.deleteCourse(id);
      if (response.success) {
        showSnackbar('Course deleted successfully!');
        navigate('/dashboard');
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      showSnackbar(err.message || 'Failed to delete course', 'error');
      console.error('Course deletion error:', err);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !course) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Course not found'}
        </Alert>
        <Button 
          variant="outlined" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => navigate('/dashboard')} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          {course.name}
        </Typography>
        <IconButton 
          color="primary" 
          onClick={() => setOpenEditCourse(true)}
          sx={{ mr: 1 }}
        >
          <Edit />
        </IconButton>
        <IconButton 
          color="error" 
          onClick={handleDeleteCourse}
        >
          <Delete />
        </IconButton>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Chip 
          label={`Professor: ${course.professor}`} 
          variant="outlined" 
          sx={{ mr: 1, mb: 1 }}
        />
        <Chip 
          label={`Schedule: ${course.schedule}`} 
          variant="outlined" 
          sx={{ mr: 1, mb: 1 }}
        />
        <Chip 
          label={`Credits: ${course.credits}`} 
          variant="outlined" 
          sx={{ mb: 1 }}
        />
        {course.description && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            {course.description}
          </Typography>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Hometasks ({hometasks.length})
        </Typography>
        <Button 
          variant="contained"
          onClick={() => setOpenAddTask(true)}
          startIcon={<Add />}
          size="small"
        >
          New Task
        </Button>
      </Box>

      {hometasks.length > 0 ? (
        <HometaskList 
          hometasks={hometasks} 
          onTaskComplete={handleTaskComplete}
        />
      ) : (
        <Box sx={{ 
          textAlign: 'center', 
          p: 4,
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 1
        }}>
          <Typography variant="body1" color="text.secondary">
            No hometasks yet. Add your first task!
          </Typography>
        </Box>
      )}

      <AddHometaskModal 
        open={openAddTask} 
        onClose={() => setOpenAddTask(false)}
        onSubmit={handleAddTask}
        courseId={id} 
      />

      <EditCourseModal
        open={openEditCourse}
        onClose={() => setOpenEditCourse(false)}
        course={course}
        onSubmit={handleUpdateCourse}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}