import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Button,
  Typography,
  CircularProgress,
  Box,
  Alert,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Add,
  Search,
  ArrowForward
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import CourseCard from '../components/CourseCard';
import AddCourseModal from '../components/AddCourseModal';
import api from '../services/api';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  // fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await api.getAllCourses();
        
        if (response.success) {
          setCourses(response.data || []);
        } else {
          throw new Error(response.message || 'Failed to fetch courses');
        }
      } catch (err) {
        setError(err.message || 'Failed to load courses');
        console.error('Fetch courses error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);

  // handle adding new course
  const handleAddCourse = async (courseData) => {
    try {
      const response = await api.createCourse(courseData);
      
      if (response.success) {
        setCourses(prev => [...prev, response.data]);
        enqueueSnackbar('Course created successfully!', { variant: 'success' });
        setOpenAddModal(false);
      } else {
        throw new Error(response.message || 'Failed to create course');
      }
    } catch (err) {
      enqueueSnackbar(err.message || 'Failed to create course', { variant: 'error' });
      console.error('Create course error:', err);
    }
  };

  // handle deleting course
  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await api.deleteCourse(courseId);
      
      if (response.success) {
        setCourses(prev => prev.filter(c => c._id !== courseId));
        enqueueSnackbar('Course deleted successfully!', { variant: 'success' });
      } else {
        throw new Error(response.message || 'Failed to delete course');
      }
    } catch (err) {
      enqueueSnackbar(err.message || 'Failed to delete course', { variant: 'error' });
      console.error('Delete course error:', err);
    }
  };

  // filter courses based on search term
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.professor.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          startIcon={<ArrowForward />}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <Typography variant="h4" component="h1">
          My Courses
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenAddModal(true)}
        >
          Add Course
        </Button>
      </Box>

      {/* Search Bar */}
      <TextField
        fullWidth
        placeholder="Search courses..."
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      {/* Courses Grid */}
      <Grid container spacing={3}>
        {filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <CourseCard 
                course={course}
                onDelete={handleDeleteCourse}
              />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box sx={{ 
              textAlign: 'center', 
              p: 4,
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 1
            }}>
              <Typography variant="body1" color="text.secondary">
                {searchTerm ? 'No matching courses found' : 'No courses available'}
              </Typography>
              {!searchTerm && (
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  sx={{ mt: 2 }}
                  onClick={() => setOpenAddModal(true)}
                >
                  Add Your First Course
                </Button>
              )}
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Add Course Modal */}
      <AddCourseModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onCourseAdded={handleAddCourse}
      />
    </Container>
  );
}