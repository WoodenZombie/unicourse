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
    // Allow only strings
    if (typeof id !== 'string') {
      return {
        isValid: false,
        error: 'ID must be a string',
      };
    }
  
    // Check for 24-character hex string
    const isValid = /^[a-fA-F0-9]{24}$/.test(id);
  
    if (!isValid) {
      return {
        isValid: false,
        error: 'Invalid ID format',
      };
    }
  
    return { isValid: true };
  };