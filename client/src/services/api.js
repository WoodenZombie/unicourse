import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export default {
  // Dashboard
  getDashboard: () => api.get('/dashboard').then(res => res.data),
  
  // Courses
  getCourses: () => api.get('/courses').then(res => res.data),
  createCourse: (courseData) => api.post('/courses', courseData).then(res => res.data),
  getCourse: (id) => api.get(`/courses/${id}`).then(res => res.data),
  
  // Hometasks
  createHometask: (taskData) => api.post('/hometasks', taskData).then(res => res.data),
  completeHometask: (id) => api.patch(`/hometasks/${id}/complete`).then(res => res.data),
  getCourseHometasks: (courseId) => api.get(`/courses/${courseId}/hometasks`).then(res => res.data),
};