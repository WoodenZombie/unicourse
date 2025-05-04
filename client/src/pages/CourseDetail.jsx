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
import AddHometaskModal from '../components/AddHometaskModal';
import HometaskList from '../components/HometaskList';
import EditCourseModal from '../components/EditCourseModal';
import api from '../services/api';
import dayjs from 'dayjs';

export default function CourseDetail() {
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
        setLoading(true);
        const [courseData, tasksData] = await Promise.all([
          api.getCourse(id),
          api.getCourseHometasks(id)
        ]);
        setCourse(courseData);
        setHometasks(tasksData);
      } catch (err) {
        setError('Failed to fetch course data');
        console.error('Course fetch error:', err);
        showSnackbar('Failed to load course data', 'error');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleTaskComplete = async (taskId) => {
    try {
      const updatedTask = await api.markAsCompleted(taskId);
      setHometasks(hometasks.map(task => 
        task._id === taskId ? updatedTask : task
      ));
      showSnackbar('Task marked as completed!');
    } catch (err) {
      showSnackbar('Failed to complete task', 'error');
      console.error('Task completion error:', err);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const newTask = await api.createHometask({
        ...taskData,
        courseId: id
      });
      setHometasks([...hometasks, newTask]);
      setOpenAddTask(false);
      showSnackbar('Hometask added successfully!');
    } catch (err) {
      showSnackbar('Failed to add hometask', 'error');
      console.error('Hometask creation error:', err);
    }
  };

  const handleUpdateCourse = async (courseData) => {
    try {
      const updatedCourse = await api.updateCourse(id, courseData);
      setCourse(updatedCourse);
      setOpenEditCourse(false);
      showSnackbar('Course updated successfully!');
    } catch (err) {
      showSnackbar('Failed to update course', 'error');
      console.error('Course update error:', err);
    }
  };

  const handleDeleteCourse = async () => {
    try {
      await api.deleteCourse(id);
      showSnackbar('Course deleted successfully!');
      navigate('/dashboard');
    } catch (err) {
      showSnackbar('Failed to delete course', 'error');
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
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Alert severity="error">{error}</Alert>
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

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">
          Hometasks ({hometasks.length})
        </Typography>
        <Button 
          variant="contained"
          onClick={() => setOpenAddTask(true)}
          startIcon={<Add />}
        >
          Add Hometask
        </Button>
      </Box>

      <HometaskList 
        hometasks={hometasks} 
        onTaskComplete={handleTaskComplete}
      />

      <AddHometaskModal 
        open={openAddTask} 
        onClose={() => setOpenAddTask(false)}
        onSubmit={handleAddTask}
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
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}