import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// enhanced error handling wrapper
const handleRequest = async (request) => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      config: error.config
    });
    throw error.response?.data || { 
      message: error.message || 'API request failed',
      status: error.response?.status
    };
  }
};

// helper function to validate IDs
const validateId = (id) => {
  if (!id || typeof id !== 'string') {
    throw new Error(`Invalid ID: ${id}`);
  }
  return id;
};

export default {
  // Dashboard
  getDashboard: () => handleRequest(api.get('/dashboard')),
  
  // Courses
  getAllCourses: () => handleRequest(api.get('/courses')),
  createCourse: (courseData) => handleRequest(api.post('/courses', courseData)),
  getCourse: (courseId) => {
    validateId(courseId);
    return handleRequest(api.get(`/courses/${courseId}`));
  },
  updateCourse: (courseId, courseData) => {
    validateId(courseId);
    return handleRequest(api.put(`/courses/${courseId}`, courseData));
  },
  deleteCourse: (courseId) => {
    validateId(courseId);
    return handleRequest(api.delete(`/courses/${courseId}`));
  },
  getCourseHometasks: (courseId) => {
    validateId(courseId);
    return handleRequest(api.get(`/courses/${courseId}/hometasks`));
  },
  
  // Hometasks
  getAllHometasks: () => handleRequest(api.get('/hometasks')),
  createHometask: (taskData) => handleRequest(api.post('/hometasks', taskData)),
  getHometask: (hometaskId) => {
    validateId(hometaskId);
    return handleRequest(api.get(`/hometasks/${hometaskId}`));
  },
  updateHometask: (hometaskId, taskData) => {
    validateId(hometaskId);
    return handleRequest(api.put(`/hometasks/${hometaskId}`, taskData));
  },
  markAsCompleted: (hometaskId) => {
    validateId(hometaskId);
    return handleRequest(api.patch(`/hometasks/${hometaskId}/complete`));
  },
  deleteHometask: (hometaskId) => {
    validateId(hometaskId);
    return handleRequest(api.delete(`/hometasks/${hometaskId}`));
  },

  // test endpoint
  testConnection: () => handleRequest(api.get('/health'))
};