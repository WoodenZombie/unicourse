import { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Button, 
  Typography,
  CircularProgress,
  Box,
  Alert,
  Snackbar
} from '@mui/material';
import CourseCard from '../components/CourseCard';
import HometaskList from '../components/HometaskList';
import AddCourseModal from '../components/AddCourseModal';
import api from '../services/api';

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [hometasks, setHometasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAddCourse, setOpenAddCourse] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coursesResponse, hometasksResponse] = await Promise.all([
          api.getAllCourses(),
          api.getAllHometasks()
        ]);
        
        if (coursesResponse.success) {
          setCourses(coursesResponse.data || []);
        } else {
          throw new Error(coursesResponse.message || 'Failed to fetch courses');
        }

        if (hometasksResponse.success) {
          setHometasks(hometasksResponse.data || []);
        } else {
          throw new Error(hometasksResponse.message || 'Failed to fetch hometasks');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard data');
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTaskComplete = async (taskId) => {
    try {
      const response = await api.markAsCompleted(taskId);
      if (response.success) {
        setHometasks(prevTasks => 
          prevTasks.map(task => 
            task._id === taskId ? response.data : task
          )
        );
        showSnackbar('Task marked as completed!');
      } else {
        throw new Error(response.message || 'Failed to complete task');
      }
    } catch (err) {
      showSnackbar(err.message || 'Failed to complete task', 'error');
      console.error('Task completion error:', err);
    }
  };

  const handleAddCourse = async (newCourse) => {
    try {
      const response = await api.createCourse({
        name: newCourse.name,
        professor: newCourse.professor,
        schedule: newCourse.schedule,
        credits: Number(newCourse.credits),
        description: newCourse.description
      });

      if (response.success) {
        setCourses(prev => [...prev, response.data]);
        showSnackbar('Course added successfully!');
        setOpenAddCourse(false);
      } else {
        throw new Error(response.message || 'Failed to add course');
      }
    } catch (err) {
      showSnackbar(err.message || 'Failed to add course', 'error');
      console.error('Course creation error:', err);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await api.deleteCourse(courseId);
      if (response.success) {
        setCourses(prevCourses => prevCourses.filter(course => course._id !== courseId));
        showSnackbar('Course deleted successfully!');
      } else {
        throw new Error(response.message || 'Failed to delete course');
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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        My Courses
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={() => setOpenAddCourse(true)}
        sx={{ mb: 3 }}
      >
        Add New Course
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Your Courses ({courses.length})
          </Typography>
          {courses.length > 0 ? (
            courses.map(course => (
              <CourseCard 
                key={course._id} 
                course={course} 
                hometasks={hometasks.filter(t => {
                  const taskCourseId = t.courseId?._id || t.courseId;
                  return taskCourseId?.toString() === course._id?.toString();
                })}
                onDelete={handleDeleteCourse}
              />
            ))
          ) : (
            <Box sx={{ 
              textAlign: 'center', 
              p: 4,
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 1
            }}>
              <Typography variant="body1" color="text.secondary">
                No courses yet. Add your first course!
              </Typography>
            </Box>
          )}
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Your Tasks
          </Typography>
          <HometaskList 
            hometasks={hometasks} 
            courses={courses}
            onTaskComplete={handleTaskComplete}
          />
        </Grid>
      </Grid>

      <AddCourseModal 
        open={openAddCourse} 
        onClose={() => setOpenAddCourse(false)}
        onCourseAdded={handleAddCourse}
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