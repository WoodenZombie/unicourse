import { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Button, 
  Typography,
  CircularProgress,
  Box
} from '@mui/material';
import CourseCard from '../components/CourseCard';
import HometaskList from '../components/HometaskList';
import AddCourseModal from '../components/AddCourseModal';
import api from '../services/api';

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [hometasks, setHometasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddCourse, setOpenAddCourse] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getDashboard();
        setCourses(data.courses);
        setHometasks(data.upcomingHometasks);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTaskComplete = async (taskId) => {
    try {
      const updatedTask = await api.completeHometask(taskId);
      setHometasks(hometasks.map(task => 
        task._id === taskId ? updatedTask : task
      ));
    } catch (err) {
      console.error('Failed to complete task:', err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
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
              />
            ))
          ) : (
            <Typography variant="body1">No courses yet. Add your first course!</Typography>
          )}
        </Grid>
        
        <Grid item xs={12} md={6}>
          <HometaskList 
            hometasks={hometasks} 
            onTaskComplete={handleTaskComplete}
          />
        </Grid>
      </Grid>

      <AddCourseModal 
        open={openAddCourse} 
        onClose={() => setOpenAddCourse(false)}
        onCourseAdded={(newCourse) => setCourses([...courses, newCourse])}
      />
    </Container>
  );
}