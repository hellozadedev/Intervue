
import jwt from 'jsonwebtoken';

// Ensure a valid secret is used.
// If JWT_SECRET is not set, or is an empty string, use a fallback.
// It's crucial that this fallback is ONLY for development and is replaced by a strong secret in .env for production.
const DEFAULT_FALLBACK_SECRET = 'a-secure-fallback-secret-for-dev-must-be-changed-for-prod';
let effectiveSecret = process.env.JWT_SECRET;

if (!effectiveSecret || typeof effectiveSecret !== 'string' || effectiveSecret.trim() === '') {
  // In a real app, you'd want a console warning here for developers,
  // but per instructions, no console logs are added in the final code.
  // e.g., console.warn('JWT_SECRET is not set or is empty. Using a default (insecure) secret. Set a strong JWT_SECRET in .env.local for production.');
  effectiveSecret = DEFAULT_FALLBACK_SECRET;
}

const JWT_SECRET_TO_USE = effectiveSecret;
const JWT_EXPIRES_IN = '1d'; // Token expiration time

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET_TO_USE, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  // If token is null, undefined, or an empty string, jwt.verify will throw.
  // The try-catch will handle this and return null.
  if (!token) { 
    return null;
  }
  try {
    return jwt.verify(token, JWT_SECRET_TO_USE);
  } catch (error) {
    // Errors like 'invalid signature', 'jwt expired', 'jwt malformed', 'jwt must be provided' will be caught.
    return null;
  }
}
