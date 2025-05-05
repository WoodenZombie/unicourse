export const validateCreateCourse = (courseData) => {
    const errors = {};
    
    if (!courseData.name || typeof courseData.name !== 'string') {
      errors.name = 'Course name is required and must be a string';
    }
    
    if (!courseData.professor || typeof courseData.professor !== 'string') {
      errors.professor = 'Professor name is required and must be a string';
    }
    
    if (!courseData.schedule || typeof courseData.schedule !== 'string') {
      errors.schedule = 'Schedule is required';
    }
    
    if (!courseData.credits || typeof courseData.credits !== 'number' || courseData.credits < 1) {
      errors.credits = 'Credits must be a number and at least 1';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  export const validateId = (id) => {
    if (!id || typeof id !== 'string' || id.length !== 24) {
      return {
        isValid: false,
        error: 'Invalid ID format'
      };
    }
    return { isValid: true };
  };