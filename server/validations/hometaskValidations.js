export const validateCreateHometask = (hometaskData) => {
    const errors = {};
    
    if (!hometaskData.courseId || typeof hometaskData.courseId !== 'string' || hometaskData.courseId.length !== 24) {
      errors.courseId = 'Valid course ID is required';
    }
    
    if (!hometaskData.description || typeof hometaskData.description !== 'string') {
      errors.description = 'Description is required and must be a string';
    }
    
    if (!hometaskData.deadline || !(hometaskData.deadline instanceof Date || !isNaN(new Date(hometaskData.deadline)))) {
      errors.deadline = 'Valid deadline date is required';
    } else if (new Date(hometaskData.deadline) <= new Date()) {
      errors.deadline = 'Deadline must be in the future';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };