import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

const handleRequest = async (request) => {
  try {
    const response = await request;
    return {
      success: true,
      data: response.data.data || response.data,
      status: response.status
    };
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data.message || 'Request failed',
        code: error.response.data.code,
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      return {
        success: false,
        message: 'No response from server',
        status: 503
      };
    }
    return {
      success: false,
      message: error.message || 'Request failed',
      status: 400
    };
  }
};

const validateId = (id) => {
  if (!id || typeof id !== 'string') {
    throw new Error(`Invalid ID: ${id}`);
  }
  return id;
};

const apiService = {
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

  // Health check
  checkHealth: () => handleRequest(api.get('/health'))
};

export default apiService;