export function validateStudyBlock(data) {
  const errors = {};

  // Title validation
  if (!data.title || data.title.trim().length === 0) {
    errors.title = 'Title is required';
  } else if (data.title.length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }

  // Date validation
  if (!data.date) {
    errors.date = 'Date is required';
  } else {
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      errors.date = 'Date cannot be in the past';
    }
    
    // Check if date is too far in future (1 year)
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    if (selectedDate > oneYearFromNow) {
      errors.date = 'Date cannot be more than 1 year in the future';
    }
  }

  // Time validation
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

    // Check minimum duration (15 minutes)
    const diffMinutes = (end - start) / (1000 * 60);
    if (diffMinutes < 15) {
      errors.endTime = 'Study session must be at least 15 minutes';
    }

    // Check maximum duration (8 hours)
    const diffHours = diffMinutes / 60;
    if (diffHours > 8) {
      errors.endTime = 'Study session cannot exceed 8 hours';
    }
  }

  // Description validation
  if (data.description && data.description.length > 500) {
    errors.description = 'Description must be less than 500 characters';
  }

  // Check if it's too late to schedule (less than 15 minutes from now)
  if (data.date && data.startTime) {
    const sessionDateTime = new Date(`${data.date}T${data.startTime}`);
    const now = new Date();
    const timeDiff = sessionDateTime - now;
    const minutesDiff = timeDiff / (1000 * 60);
    
    if (minutesDiff < 15 && minutesDiff > 0) {
      errors.startTime = 'Study session must be scheduled at least 15 minutes in advance';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateEmail(email) {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.toLowerCase());
}

export function validatePassword(password) {
  const errors = [];
  
  if (!password) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
}
