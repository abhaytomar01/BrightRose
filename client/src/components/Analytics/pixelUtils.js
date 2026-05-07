/**
 * Analytics Utility Functions (GA4 & Meta Pixel)
 * 
 * This utility provides a wrapper around gtag and fbq functions to ensure
 * consistent event tracking across the application.
 */

export const PIXEL_ID = '1667260638022314';
export const GA_MEASUREMENT_ID = 'G-E802SXQH4J';

/**
 * Track a standard event across all platforms (GA4 & Meta Pixel)
 * @param {string} eventName - Name of the event
 * @param {Object} params - Additional parameters for the event
 */
export const trackEvent = (eventName, params = {}) => {
  // 1. Meta Pixel Tracking
  if (typeof window.fbq === 'function') {
    console.log(`⚜️ Meta Pixel Event: ${eventName}`, params);
    window.fbq('track', eventName, params);
  } else {
    console.warn('⚜️ Meta Pixel (fbq) not found');
  }

  // 2. Google Analytics 4 Tracking
  if (typeof window.gtag === 'function') {
    console.log(`📊 GA4 Event: ${eventName}`, params);
    
    // Map standard Pixel events to GA4 events if they differ
    let gaEventName = eventName;
    if (eventName === 'InitiateCheckout') gaEventName = 'begin_checkout';
    if (eventName === 'Lead') gaEventName = 'generate_lead';
    if (eventName === 'Purchase') gaEventName = 'purchase';
    if (eventName === 'AddToCart') gaEventName = 'add_to_cart';
    
    window.gtag('event', gaEventName, params);
  } else {
    console.warn('📊 GA4 (gtag) not found');
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
