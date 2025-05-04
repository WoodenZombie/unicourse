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
        const [coursesData, hometasksData] = await Promise.all([
          api.getAllCourses(),
          api.getAllHometasks()
        ]);
        
        setCourses(coursesData);
        setHometasks(hometasksData);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  const handleAddCourse = async (courseData) => {
    try {
      const newCourse = await api.createCourse(courseData);
      setCourses([...courses, newCourse]);
      setOpenAddCourse(false);
      showSnackbar('Course added successfully!');
    } catch (err) {
      showSnackbar('Failed to add course', 'error');
      console.error('Course creation error:', err);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await api.deleteCourse(courseId);
      setCourses(courses.filter(course => course._id !== courseId));
      showSnackbar('Course deleted successfully!');
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
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>My Courses</Typography>
      
      <Button 
        variant="contained" 
        onClick={() => setOpenAddCourse(true)}
        sx={{ mb: 3 }}
      >
        Add New Course
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {courses.length > 0 ? (
            courses.map(course => (
              <CourseCard 
                key={course._id} 
                course={course} 
                hometasks={hometasks.filter(t => t.courseId === course._id)}
                onDelete={handleDeleteCourse}
              />
            ))
          ) : (
            <Typography variant="body1">No courses yet. Add your first course!</Typography>
          )}
        </Grid>
        
        <Grid item xs={12} md={6}>
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
        onSubmit={handleAddCourse}
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