// This module conditionally exports mock data based on environment
// In development, it uses mock data
// In production, it should use real API calls

export * from './mock-data';

// Development-only warning
if (process.env.NODE_ENV === 'development') {
  console.info('ℹ️ Using mock data (development mode)');
}

if (process.env.NODE_ENV === 'production') {
  console.warn('⚠️ Mock data being used in production. Switch to real API calls.');
}
