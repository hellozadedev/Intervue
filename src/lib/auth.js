
import { getIronSession as getSession } from 'iron-session';
import { cookies } from 'next/headers';

const IRON_SESSION_PASSWORD_FALLBACK = 'this_is_a_secure_dev_password_at_least_32_characters_long';
let ironSessionPassword = process.env.IRON_SESSION_PASSWORD;

if (!ironSessionPassword || typeof ironSessionPassword !== 'string' || ironSessionPassword.length < 32) {
  if (process.env.NODE_ENV !== 'production') {
    // console.warn('Warning: IRON_SESSION_PASSWORD is not set, is not a string, or is less than 32 characters long. Using a default (insecure) password for development. Set a strong IRON_SESSION_PASSWORD in your .env.local file for production.');
  }
  ironSessionPassword = IRON_SESSION_PASSWORD_FALLBACK;
}


export const sessionOptions = {
  password: ironSessionPassword,
  cookieName: 'intervue-app-session', // A unique name for your session cookie
  cookieOptions: {
    secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
    httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
    sameSite: 'lax', // CSRF protection
    maxAge: 60 * 60 * 24, // 1 day in seconds
    path: '/',
  },
};

// Helper function to get the current session in Route Handlers and Server Components
export async function getAppSession() {
  const session = await getSession(cookies(), sessionOptions);
  return session;
}

// Helper function for middleware usage where `cookies()` from `next/headers` is not directly available
// Instead, middleware receives `request.cookies`
export async function getSessionFromRequest(requestCookies) {
    return await getSession(requestCookies, sessionOptions);
}
