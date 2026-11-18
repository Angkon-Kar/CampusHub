// server/utils/httpError.js
// Never send raw database/library messages to visitors in production.
export const sendServerError = (res, error, fallback = 'Something went wrong. Please try again.') => {
  console.error(error);
  const message = process.env.NODE_ENV === 'production' ? fallback : error?.message || fallback;
  return res.status(500).json({ success: false, message });
};