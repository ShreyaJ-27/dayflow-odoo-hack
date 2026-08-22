// Form validation utilities for Dayflow HRMS

export const validateEmail = (email) => {
  if (!email || !email.trim()) return 'Email address is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) return 'Please enter a valid email address (e.g. name@domain.com)';
  return null;
};

export const validatePhone = (phone) => {
  if (!phone || !phone.trim()) return 'Phone number is required';
  // Allow +, digits, spaces, parentheses, hyphens (minimum 7 digits)
  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;
  const digitsOnly = phone.replace(/\D/g, '');
  if (!phoneRegex.test(phone.trim()) || digitsOnly.length < 7) {
    return 'Please enter a valid phone number (at least 7 digits)';
  }
  return null;
};

export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || !String(value).trim()) return `${fieldName} is required`;
  return null;
};

export const validatePositiveNumber = (value, fieldName = 'Amount') => {
  if (value === undefined || value === null || value === '') return `${fieldName} is required`;
  const num = Number(value);
  if (isNaN(num) || num < 0) return `${fieldName} must be a positive number`;
  return null;
};

export const validateEmployeeForm = (form) => {
  const errors = {};
  
  const nameError = validateRequired(form.name, 'Full Name');
  if (nameError) errors.name = nameError;

  const emailError = validateEmail(form.email);
  if (emailError) errors.email = emailError;

  const phoneError = validatePhone(form.phone);
  if (phoneError) errors.phone = phoneError;

  const roleError = validateRequired(form.role, 'Job Role');
  if (roleError) errors.role = roleError;

  if (form.salary && form.salary.monthlyWage !== undefined) {
    const wageError = validatePositiveNumber(form.salary.monthlyWage, 'Monthly Wage');
    if (wageError) errors.monthlyWage = wageError;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
