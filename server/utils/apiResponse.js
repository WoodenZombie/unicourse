export const successResponse = (res, data, status = 200) => {
    res.status(status).json({
      success: true,
      data: Array.isArray(data) ? data : [data]
    });
  };
  
  export const errorResponse = (res, message, status = 500) => {
    res.status(status).json({
      success: false,
      message: message
    });
  };
  
  export const notFoundResponse = (res, resource = 'Resource') => {
    res.status(404).json({
      success: false,
      message: `${resource} not found`
    });
  };
  
  export const validationErrorResponse = (res, errors) => {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: Array.isArray(errors) ? errors : [errors]
    });
  };