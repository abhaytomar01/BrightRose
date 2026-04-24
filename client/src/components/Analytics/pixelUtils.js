/**
 * Meta Pixel Utility Functions
 * 
 * This utility provides a wrapper around the fbq function to ensure
 * consistent event tracking across the application.
 */

export const PIXEL_ID = '1667260638022314';

/**
 * Track a standard Meta Pixel event
 * @param {string} eventName - Name of the standard event (e.g., 'PageView', 'AddToCart')
 * @param {Object} params - Additional parameters for the event
 */
export const trackEvent = (eventName, params = {}) => {
  if (typeof window.fbq === 'function') {
    console.log(`⚜️ Meta Pixel Event: ${eventName}`, params);

    // Using standard 'track' instead of 'trackSingle' for better compatibility with Pixel Helper
    window.fbq('track', eventName, params);
  } else {
    console.warn('⚜️ Meta Pixel (fbq) not found when trying to track:', eventName);
  }
};

/**
 * Initialize or re-initialize the pixel with advanced matching data
 * @param {Object} userData - Hashed user data (em, ph, fn, ln, etc.)
 */
export const initPixel = (userData = {}) => {
  if (typeof window.fbq === 'function') {
    window.fbq('init', PIXEL_ID, userData);
  }
};
