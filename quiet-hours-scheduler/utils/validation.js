export function validateStudyBlock(data) {
  const errors = {};

  if (!data.title || data.title.trim().length === 0) {
    errors.title = 'Title is required';
  } else if (data.title.length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }

  if (!data.date) {
    errors.date = 'Date is required';
  } else if (new Date(data.date) < new Date().setHours(0, 0, 0, 0)) {
    errors.date = 'Date cannot be in the past';
  }

  if (!data.startTime) {
    errors.startTime = 'Start time is required';
  }

  if (!data.endTime) {
    errors.endTime = 'End time is required';
  }

  if (data.startTime && data.endTime) {
    const start = new Date(`2000-01-01T${data.startTime}`);
    const end = new Date(`2000-01-01T${data.endTime}`);
    
    if (end <= start) {
      errors.endTime = 'End time must be after start time';
    }

    // Check if session is too long (more than 8 hours)
    const diffHours = (end - start) / (1000 * 60 * 60);
    if (diffHours > 8) {
      errors.endTime = 'Study session cannot exceed 8 hours';
    }
  }

  if (data.description && data.description.length > 500) {
    errors.description = 'Description must be less than 500 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}