// Common validation functions
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Common response formatters
export const jsonResponse = (data, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const successResponse = (message, data = null, status = 200) => {
  return jsonResponse({ message, ...(data && { data }) }, status);
};

export const errorResponse = (message, status = 500) => {
  return jsonResponse({ message }, status);
};

// Common error handlers
export const handleApiError = (error) => {
  console.error('API Error:', error);

  if (error instanceof SyntaxError) {
    return errorResponse('Invalid JSON payload', 400);
  }

  if (error.code === 'ER_DUP_ENTRY') {
    return errorResponse('Duplicate entry. This record already exists.', 409);
  }

  return errorResponse('Internal server error', 500);
};

// Request validation helpers
export const validateRequiredFields = (data, requiredFields) => {
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    return {
      isValid: false,
      error: `Missing required fields: ${missingFields.join(', ')}`
    };
  }
  
  return { isValid: true };
};

// Database connection wrapper
export const withDatabaseConnection = async (pool, operation) => {
  let connection;
  try {
    connection = await pool.getConnection();
    return await operation(connection);
  } catch (error) {
    throw error;
  } finally {
    if (connection) connection.release();
  }
}; 