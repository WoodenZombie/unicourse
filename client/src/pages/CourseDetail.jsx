import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Box,
  CircularProgress
} from '@mui/material';
import AddHometaskModal from '../components/AddHometaskModal';
import HometaskList from '../components/HometaskList';
import api from '../services/api';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [hometasks, setHometasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddTask, setOpenAddTask] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseData, tasksData] = await Promise.all([
          api.getCourse(id),
          api.getCourseHometasks(id)
        ]);
        setCourse(courseData);
        setHometasks(tasksData);
      } catch (err) {
        console.error('Failed to fetch course data:', err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

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
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>{course.name}</Typography>
      <Typography variant="subtitle1" gutterBottom>
        Professor: {course.professor}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Schedule: {course.schedule} | Credits: {course.credits}
      </Typography>
      
      <Button 
        variant="contained" 
        sx={{ mt: 2, mb: 3 }}
        onClick={() => setOpenAddTask(true)}
      >
        Add Hometask
      </Button>
      
      <HometaskList 
        hometasks={hometasks} 
        onTaskComplete={handleTaskComplete}
      />
      
      <AddHometaskModal 
        open={openAddTask} 
        onClose={() => setOpenAddTask(false)}
        courseId={id}
        onTaskAdded={(newTask) => setHometasks([...hometasks, newTask])}
      />
    </Container>
  );
}
